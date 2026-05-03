import React, { useCallback, useEffect, useMemo, useState } from "react";
import { FaClock, FaMoneyBillWave, FaSearch } from "react-icons/fa";
import { BsCalendar2CheckFill } from "react-icons/bs";
import { FiFilter } from "react-icons/fi";
import {
  cancelBooking,
  confirmBooking,
  confirmPayment,
  fetchBookings,
  vacateBooking,
  approveRenewal,
  approveEarlyReturn,
} from "../services/booking.service";
import { addDays } from "../helper/helper";
import { useLocation } from "react-router-dom";
import { formatDate } from "../helper/helper";
import ToastContainer, { useToast } from "../components/Toast";
const getAttentionType = (booking) => {
  if (booking.status === "PENDING") return "NEW_BOOKING";
  // VACATING = early return approved OR ≤2 days left — needs move-out confirmation
  if (booking.status === "VACATING" && !booking.is_vacated) {
    return "ENDING_SOON";
  }
  if (
    (booking.status === "CONFIRMED" || booking.status === "RENEWED") &&
    !booking.is_vacated &&
    booking.return_date
  ) {
    return "EARLY_RETURN";
  }
  if (booking.renewal_status === "REQUESTED") return "RENEWAL";
  if (
    booking.status === "CONFIRMED" &&
    !booking.is_vacated &&
    booking.end_date
  ) {
    const end = new Date(booking.end_date);
    const now = new Date();
    const diffDays = Math.ceil((end - now) / (1000 * 60 * 60 * 24));
    if (diffDays <= 2 && diffDays >= 0) return "ENDING_SOON";
  }
  // Active booking with payment due within 3 days
  if (
    (booking.status === "CONFIRMED" || booking.status === "RENEWED") &&
    !booking.is_vacated &&
    booking.payments?.[0]?.due_date
  ) {
    const due = new Date(booking.payments[0].due_date);
    const now = new Date();
    const diffDays = Math.ceil((due - now) / (1000 * 60 * 60 * 24));
    if (diffDays <= 3 && diffDays >= 0) return "PAYMENT_DUE";
  }
  return null;
};

const attentionConfig = {
  NEW_BOOKING: {
    label: "New Booking",
    tone: "bg-amber-50 text-amber-700 border-amber-200",
  },
  EARLY_RETURN: {
    label: "Early Return",
    tone: "bg-purple-50 text-purple-700 border-purple-200",
  },
  RENEWAL: {
    label: "Renewal",
    tone: "bg-sky-50 text-sky-700 border-sky-200",
  },
  ENDING_SOON: {
    label: "Ending Soon",
    tone: "bg-rose-50 text-rose-700 border-rose-200",
  },
  PAYMENT_DUE: {
    label: "Payment Due",
    tone: "bg-orange-50 text-orange-700 border-orange-200",
  },
};

const Booking = () => {
  const { state } = useLocation();
  const bookingId = state?.bookingId ?? null;
  const [bookings, setBookings] = useState([]);
  const [activeTab, setActiveTab] = useState("inbox");
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [approvedRenewals, setApprovedRenewals] = useState(new Set());
  const [loadingAction, setLoadingAction] = useState(null);
  const { toasts, addToast, dismissToast } = useToast();

  const Spinner = () => (
    <svg
      className="animate-spin h-4 w-4"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );

  const getStatusTone = (status) => {
    let statusColor = "";
    switch (status?.toLowerCase()) {
      case "pending":
        statusColor = "border-blue-700 bg-blue-100/20 text-blue-500";
        break;
      case "confirmed":
        statusColor = "border-green-700 bg-green-100/20 text-green-500";
        break;
      case "cancelled":
        statusColor = "border-red-700 bg-red-100/20 text-red-500";
        break;
      case "renewed":
        statusColor = "border-green-700 bg-green-100/20 text-green-500";
        break;
      case "vacating":
        statusColor = "border-orange-700 bg-orange-100/20 text-orange-500";
        break;
      default:
        statusColor = "border-gray-500 bg-gray-200/20 text-gray-700";
    }
    return statusColor;
  };

  const handleFetch = useCallback(
    async (args = null) => {
      const data = await fetchBookings(args?.year);
      const normalized = Array.isArray(data) ? data : [];
      setBookings(normalized);

      if (bookingId) {
        const match = normalized.find((item) => item.id === bookingId);
        setSelectedBooking(match ?? null);
      }
    },
    [bookingId],
  );

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    handleFetch();
  }, [handleFetch]);

  const needsAttention = useMemo(() => {
    return bookings.reduce((list, booking) => {
      const attentionType = getAttentionType(booking);
      if (attentionType) {
        list.push({ ...booking, attentionType });
      }
      return list;
    }, []);
  }, [bookings]);

  const inboxBookings = needsAttention;

  const activeBookings = useMemo(() => {
    return bookings.filter(
      (booking) =>
        booking.status === "CONFIRMED" ||
        (booking.status === "RENEWED" &&
          !booking.is_vacated &&
          !getAttentionType(booking)),
    );
  }, [bookings]);

  const visibleBookings =
    activeTab === "inbox" ? inboxBookings : activeBookings;

  const selectedVisibleBooking = selectedBooking
    ? visibleBookings.find((b) => b.id === selectedBooking.id) || null
    : null;

  const stats = useMemo(() => {
    const pendingCount = needsAttention.length;
    const activeCount = activeBookings.length;
    const expiringHoldsCount = bookings.filter((b) => {
      if (b.status !== "PENDING") return false;
      const createdAt = new Date(b.createdAt);
      const now = new Date();
      const diffTime = Math.abs(now - createdAt);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays >= 3;
    }).length;

    return [
      {
        title: "Pending Verification",
        value: pendingCount,

        icon: FaMoneyBillWave,
        tone: "text-blue-600 bg-blue-50 border-blue-200",
      },
      {
        title: "Active Allocations",
        value: activeCount,

        icon: BsCalendar2CheckFill,
        tone: "text-green-600 bg-green-50 border-green-200",
      },
      {
        title: "Expiring Holds",
        value: expiringHoldsCount,
        icon: FaClock,
        tone: "text-rose-600 bg-rose-50 border-rose-200",
      },
    ];
  }, [bookings]);
  const handleConfirmBooking = async (bookingId) => {
    setLoadingAction("confirm");
    try {
      await confirmBooking(bookingId);
      addToast({
        type: "success",
        title: "Booking Confirmed",
        message: "The booking has been confirmed successfully.",
      });
      await handleFetch();
    } catch {
      addToast({
        type: "error",
        title: "Confirmation Failed",
        message: "Something went wrong. Please try again.",
      });
    } finally {
      setLoadingAction(null);
    }
  };

  const handleConfirmPayment = async (paymentId) => {
    setLoadingAction("confirm-payment");
    try {
      await confirmPayment(paymentId);
      addToast({
        type: "success",
        title: "Payment Confirmed",
        message: "The monthly payment has been confirmed successfully.",
      });
      await handleFetch();
    } catch {
      addToast({
        type: "error",
        title: "Payment Confirmation Failed",
        message: "Something went wrong. Please try again.",
      });
    } finally {
      setLoadingAction(null);
    }
  };

  const handleCancel = async (bookingId) => {
    setLoadingAction("cancel");
    try {
      await cancelBooking(bookingId);
      if (selectedBooking?.id === bookingId) setSelectedBooking(null);
      addToast({
        type: "info",
        title: "Booking Cancelled",
        message: "The booking has been cancelled.",
      });
      await handleFetch();
    } catch {
      addToast({
        type: "error",
        title: "Cancellation Failed",
        message: "Something went wrong. Please try again.",
      });
    } finally {
      setLoadingAction(null);
    }
  };

  const handleMoveOut = async (bookingId) => {
    setLoadingAction("moveout");
    try {
      await vacateBooking(bookingId);
      setApprovedRenewals((prev) => {
        const next = new Set(prev);
        next.delete(bookingId);
        return next;
      });
      if (selectedBooking?.id === bookingId) setSelectedBooking(null);
      addToast({
        type: "success",
        title: "Move Out Confirmed",
        message: "The tenant has been moved out successfully.",
      });
      await handleFetch();
    } catch {
      addToast({
        type: "error",
        title: "Move Out Failed",
        message: "Something went wrong. Please try again.",
      });
    } finally {
      setLoadingAction(null);
    }
  };

  const handleApproveRenewal = async (bookingId) => {
    setLoadingAction("approve-renewal");
    try {
      await approveRenewal(bookingId);
      setApprovedRenewals((prev) => new Set(prev).add(bookingId));
      addToast({
        type: "success",
        title: "Renewal Approved",
        message: "Please confirm the move out to complete.",
      });
      await handleFetch();
    } catch {
      addToast({
        type: "error",
        title: "Approval Failed",
        message: "Something went wrong. Please try again.",
      });
    } finally {
      setLoadingAction(null);
    }
  };

  const handleRejectRenewal = async (bookingId) => {
    setLoadingAction("reject-renewal");
    try {
      await cancelBooking(bookingId);
      if (selectedBooking?.id === bookingId) setSelectedBooking(null);
      addToast({
        type: "info",
        title: "Renewal Rejected",
        message: "The renewal request has been rejected.",
      });
      await handleFetch();
    } catch {
      addToast({
        type: "error",
        title: "Rejection Failed",
        message: "Something went wrong. Please try again.",
      });
    } finally {
      setLoadingAction(null);
    }
  };

  const handleApproveEarlyReturn = async (bookingId) => {
    setLoadingAction("approve-return");
    try {
      await approveEarlyReturn(bookingId);
      addToast({
        type: "success",
        title: "Early Return Approved",
        message: "The early return has been approved. Confirm the move out.",
      });
      await handleFetch();
    } catch {
      addToast({
        type: "error",
        title: "Approval Failed",
        message: "Something went wrong. Please try again.",
      });
    } finally {
      setLoadingAction(null);
    }
  };

  const handleRejectEarlyReturn = async (bookingId) => {
    setLoadingAction("reject-return");
    try {
      await cancelBooking(bookingId);
      if (selectedBooking?.id === bookingId) setSelectedBooking(null);
      addToast({
        type: "info",
        title: "Early Return Rejected",
        message: "The early return request has been rejected.",
      });
      await handleFetch();
    } catch {
      addToast({
        type: "error",
        title: "Rejection Failed",
        message: "Something went wrong. Please try again.",
      });
    } finally {
      setLoadingAction(null);
    }
  };

  const selectedAttentionType = selectedVisibleBooking
    ? getAttentionType(selectedVisibleBooking)
    : null;

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-slate-100 p-6 md:p-8">
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
      <div className="mb-6 flex flex-col gap-2">
        <h1 className="text-3xl md:text-4xl font-semibold text-navy-900">
          Booking & Payments
        </h1>
        <p className="text-sm md:text-base text-slate-500">
          Confirm reservation payments, monitor booking statuses, and manage
          pending holds.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.title}
              className={`bg-white/90 backdrop-blur px-6 py-6 rounded-2xl shadow-sm border flex items-start justify-between ${item.tone}`}
            >
              <div>
                <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">
                  {item.title}
                </p>
                <h3 className="text-4xl font-bold text-navy-900 mt-2">
                  {item.value}
                </h3>
              </div>
              <div className="p-2.5 rounded-xl bg-white shadow-sm">
                <Icon size={16} />
              </div>
            </div>
          );
        })}
      </div>
      <div
        className={`mt-8 grid gap-6 items-start ${
          selectedBooking ? "grid-cols-1 xl:grid-cols-[2fr_1fr]" : "grid-cols-1"
        }`}
      >
        <div className="bg-white/90 backdrop-blur rounded-2xl shadow-sm border border-slate-200/70 overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-100 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => {
                  setActiveTab("inbox");
                  setSelectedBooking(null);
                }}
                className={`inline-flex items-center gap-2 rounded-2xl px-5 py-2 text-sm font-semibold transition ${
                  activeTab === "inbox"
                    ? "bg-slate-900 text-white shadow-sm"
                    : "text-slate-600 border border-slate-200"
                }`}
              >
                Inbox
                <span className="rounded-full bg-yellow-300 text-slate-900 px-2 py-0.5 text-xs font-semibold">
                  {inboxBookings.length}
                </span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveTab("active");
                  setSelectedBooking(null);
                }}
                className={`rounded-2xl px-5 py-2 text-sm font-semibold transition ${
                  activeTab === "active"
                    ? "bg-slate-900 text-white shadow-sm"
                    : "text-slate-500"
                }`}
              >
                Active
                <span className="ml-2 rounded-full bg-amber-100 text-amber-800 px-2 py-0.5 text-xs font-semibold">
                  {activeBookings.length}
                </span>
              </button>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-500">
                <FaSearch size={14} />
                <input
                  className="bg-transparent outline-none placeholder:text-slate-400"
                  placeholder="Search by tenant, unit, or ID..."
                />
              </div>
              <button className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50">
                <FiFilter />
                Filter
              </button>
            </div>
          </div>

          <div className="overflow-auto">
            <table className="min-w-full text-left">
              <thead className="bg-slate-50 text-xs uppercase text-slate-400">
                <tr>
                  <th className="px-6 py-3">ID</th>
                  <th className="px-6 py-3">Tenant</th>
                  <th className="px-6 py-3">Unit</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">
                    {activeTab === "inbox" ? "Type" : "Upcoming Payment"}
                  </th>
                  <th className="px-6 py-3">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-base">
                {visibleBookings.map((row) => {
                  const statusTone = getStatusTone(row.status);
                  const attentionType =
                    row.attentionType ?? getAttentionType(row);
                  return (
                    <tr
                      key={row.id}
                      onClick={() => setSelectedBooking(row)}
                      className={`cursor-pointer hover:bg-slate-50/70 ${
                        selectedVisibleBooking?.id === row.id
                          ? "bg-slate-200/50"
                          : "bg-white"
                      }`}
                    >
                      <td className="px-6 py-4 text-slate-500 font-semibold">
                        {row.id}
                      </td>
                      <td className="px-6 py-4 text-slate-800 font-semibold">
                        {row.user?.full_name}
                      </td>
                      <td className="px-6 py-4 text-slate-600">
                        <div className="font-semibold text-slate-800">
                          {row.unit?.unit_number}
                        </div>
                        <div className="text-sm text-slate-400">
                          {parseInt(row.unit?.type?.sqft)} sqft
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center justify-center rounded-full border px-4 py-1.5 text-xs font-semibold uppercase tracking-wide ${statusTone}`}
                        >
                          {row.status === "CONFIRMED"
                            ? "Active"
                            : row.status === "VACATING"
                              ? "Vacating"
                              : row.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {activeTab === "inbox" &&
                        attentionType &&
                        attentionConfig[attentionType] ? (
                          <span
                            className={`inline-flex items-center justify-center rounded-full border px-3 py-1.5 text-xs font-semibold ${attentionConfig[attentionType].tone}`}
                          >
                            {attentionConfig[attentionType].label}
                          </span>
                        ) : (
                          (() => {
                            const dueDate = row.payments?.[0]?.due_date;
                            const isDueSoon =
                              dueDate &&
                              (() => {
                                const due = new Date(dueDate);
                                const now = new Date();
                                const diff = Math.ceil(
                                  (due - now) / (1000 * 60 * 60 * 24),
                                );
                                return diff <= 3 && diff >= 0;
                              })();
                            return (
                              <div className="flex flex-col gap-1">
                                <span className="font-semibold text-slate-900">
                                  $ {row.payments?.[0]?.amount || "—"}
                                </span>
                                {isDueSoon && (
                                  <span className="inline-flex items-center w-fit rounded-full border border-orange-200 bg-orange-50 px-2 py-0.5 text-[10px] font-semibold text-orange-700">
                                    Due Soon
                                  </span>
                                )}
                              </div>
                            );
                          })()
                        )}
                      </td>
                      <td className="px-6 py-6 text-slate-400 text-lg">›</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
        {selectedVisibleBooking ? (
          <div className="bg-white/90 backdrop-blur rounded-2xl shadow-sm border border-slate-200/70 overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-900">
                {activeTab === "inbox"
                  ? selectedAttentionType === "NEW_BOOKING"
                    ? "New Booking"
                    : selectedAttentionType === "RENEWAL"
                      ? "Renewal Request"
                      : selectedAttentionType === "EARLY_RETURN"
                        ? "Early Return Request"
                        : selectedAttentionType === "ENDING_SOON"
                          ? "Confirm Move Out"
                          : selectedAttentionType === "PAYMENT_DUE"
                            ? "Payment Due Soon"
                            : "Booking Details"
                  : "Booking Details"}
                {activeTab === "active" &&
                  selectedVisibleBooking.payments?.[0]?.due_date &&
                  (() => {
                    const due = new Date(
                      selectedVisibleBooking.payments[0].due_date,
                    );
                    const now = new Date();
                    const diffDays = Math.ceil(
                      (due - now) / (1000 * 60 * 60 * 24),
                    );
                    return diffDays <= 3 && diffDays >= 0;
                  })() && (
                    <span className="ml-2 inline-flex items-center rounded-full border border-orange-200 bg-orange-50 px-2.5 py-0.5 text-xs font-semibold text-orange-700">
                      Payment Due
                    </span>
                  )}
              </h3>
              <button
                type="button"
                onClick={() => setSelectedBooking(null)}
                className="rounded-full border border-slate-200 p-1 text-slate-400"
              >
                ×
              </button>
            </div>
            <div className="px-6 py-5 grid gap-5">
              {/* Tenant info — shared */}
              <div className="flex items-center gap-4">
                <div className="h-11 w-11 rounded-full bg-slate-900 text-white flex items-center justify-center font-semibold">
                  {(selectedVisibleBooking.user?.full_name ?? "")
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <div>
                  <p className="font-semibold text-slate-900">
                    {selectedVisibleBooking.user?.full_name}
                  </p>
                  <p className="text-xs text-slate-500">
                    {selectedVisibleBooking.user?.email}
                  </p>
                </div>
              </div>

              {/* ── INBOX: NEW_BOOKING ── */}
              {activeTab === "inbox" &&
              selectedAttentionType === "NEW_BOOKING" ? (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-2xl border border-slate-200 px-4 py-3">
                      <p className="text-xs text-slate-400 uppercase">
                        Assigned Unit
                      </p>
                      <p className="text-sm font-semibold text-slate-900">
                        {selectedVisibleBooking.unit?.unit_number}
                      </p>
                      <p className="text-xs text-slate-400">
                        {parseInt(selectedVisibleBooking.unit?.type?.sqft)} sqft
                      </p>
                    </div>
                    <div className="rounded-2xl border border-slate-200 px-4 py-3">
                      <p className="text-xs text-slate-400 uppercase">
                        Payment Amount
                      </p>
                      <p className="text-sm font-semibold text-slate-900">
                        $ {selectedVisibleBooking.payments?.[0]?.amount || "—"}
                      </p>
                      <p className="text-xs text-slate-400">
                        {selectedVisibleBooking.payments?.[0]?.description}
                      </p>
                    </div>
                    <div className="rounded-2xl border border-slate-200 px-4 py-3">
                      <p className="text-xs text-slate-400 uppercase">
                        Submission Date
                      </p>
                      <p className="text-sm font-semibold text-slate-900">
                        {formatDate(selectedVisibleBooking.createdAt)}
                      </p>
                    </div>
                    <div className="rounded-2xl border border-slate-200 px-4 py-3">
                      <p className="text-xs text-slate-400 uppercase">
                        Hold Deadline
                      </p>
                      <p className="text-sm font-semibold text-slate-900">
                        {addDays(selectedVisibleBooking.createdAt, 5)}
                      </p>
                    </div>
                    <div className="col-span-2 rounded-2xl border border-slate-200 px-4 py-3">
                      <p className="text-xs text-slate-400 uppercase">
                        Payment Method
                      </p>
                      <p className="text-sm font-semibold text-slate-900 capitalize">
                        {selectedVisibleBooking.payments?.[0]?.payment_method ||
                          "—"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      disabled={!!loadingAction}
                      className="flex-1 rounded-xl hover:bg-yellow-400/80 cursor-pointer bg-yellow-400 px-4 py-2 text-sm font-semibold text-slate-900 disabled:opacity-60 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
                      onClick={() =>
                        handleConfirmBooking(selectedVisibleBooking.id)
                      }
                    >
                      {loadingAction === "confirm" && <Spinner />}
                      {loadingAction === "confirm"
                        ? "Confirming..."
                        : "Confirm Booking"}
                    </button>
                    <button
                      disabled={!!loadingAction}
                      className="flex-1 rounded-xl border border-red-200 px-4 py-2 hover:bg-red-200 cursor-pointer text-sm font-semibold text-red-600 disabled:opacity-60 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
                      onClick={() => handleCancel(selectedVisibleBooking.id)}
                    >
                      {loadingAction === "cancel" && <Spinner />}
                      {loadingAction === "cancel"
                        ? "Cancelling..."
                        : "Cancel Booking"}
                    </button>
                  </div>
                </>
              ) : null}

              {/* ── INBOX: RENEWAL ── */}
              {activeTab === "inbox" && selectedAttentionType === "RENEWAL" ? (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-2xl border border-slate-200 px-4 py-3">
                      <p className="text-xs text-slate-400 uppercase">Unit</p>
                      <p className="text-sm font-semibold text-slate-900">
                        {selectedVisibleBooking.unit?.unit_number}
                      </p>
                      <p className="text-xs text-slate-400">
                        {parseInt(selectedVisibleBooking.unit?.type?.sqft)} sqft
                      </p>
                    </div>
                    <div className="rounded-2xl border border-slate-200 px-4 py-3">
                      <p className="text-xs text-slate-400 uppercase">
                        Upcoming Amount
                      </p>
                      <p className="text-sm font-semibold text-slate-900">
                        $ {selectedVisibleBooking.payments?.[0]?.amount || "—"}
                      </p>
                    </div>
                    <div className="rounded-2xl border border-slate-200 px-4 py-3">
                      <p className="text-xs text-slate-400 uppercase">
                        Previous End Date
                      </p>
                      <p className="text-sm font-semibold text-slate-900">
                        {formatDate(selectedVisibleBooking.end_date)}
                      </p>
                    </div>
                    <div className="rounded-2xl border border-slate-200 px-4 py-3">
                      <p className="text-xs text-slate-400 uppercase">
                        New End Date
                      </p>
                      <p className="text-sm font-semibold text-slate-900">
                        {formatDate(
                          selectedVisibleBooking.renewal_requested_date,
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {approvedRenewals.has(selectedVisibleBooking.id) ? (
                      <button
                        disabled={!!loadingAction}
                        className="flex-1 rounded-xl hover:bg-yellow-400/80 cursor-pointer bg-yellow-400 px-4 py-2 text-sm font-semibold text-slate-900 disabled:opacity-60 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
                        onClick={() => handleMoveOut(selectedVisibleBooking.id)}
                      >
                        {loadingAction === "moveout" && <Spinner />}
                        {loadingAction === "moveout"
                          ? "Processing..."
                          : "Confirm Move Out"}
                      </button>
                    ) : (
                      <>
                        <button
                          disabled={!!loadingAction}
                          className="flex-1 rounded-xl hover:bg-yellow-400/80 cursor-pointer bg-yellow-400 px-4 py-2 text-sm font-semibold text-slate-900 disabled:opacity-60 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
                          onClick={() =>
                            handleApproveRenewal(selectedVisibleBooking.id)
                          }
                        >
                          {loadingAction === "approve-renewal" && <Spinner />}
                          {loadingAction === "approve-renewal"
                            ? "Approving..."
                            : "Approve Renewal"}
                        </button>
                        <button
                          disabled={!!loadingAction}
                          className="flex-1 rounded-xl border border-red-200 px-4 py-2 hover:bg-red-200 cursor-pointer text-sm font-semibold text-red-600 disabled:opacity-60 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
                          onClick={() =>
                            handleRejectRenewal(selectedVisibleBooking.id)
                          }
                        >
                          {loadingAction === "reject-renewal" && <Spinner />}
                          {loadingAction === "reject-renewal"
                            ? "Rejecting..."
                            : "Reject"}
                        </button>
                      </>
                    )}
                  </div>
                </>
              ) : null}

              {/* ── INBOX: EARLY_RETURN ── */}
              {activeTab === "inbox" && selectedAttentionType === "EARLY_RETURN"
                ? (() => {
                    const returnDate = new Date(
                      selectedVisibleBooking.return_date,
                    );
                    const dueDate = selectedVisibleBooking.payments?.[0]
                      ?.due_date
                      ? new Date(selectedVisibleBooking.payments[0].due_date)
                      : null;
                    const hasOutstanding = dueDate && returnDate > dueDate;

                    return (
                      <>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="rounded-2xl border border-slate-200 px-4 py-3">
                            <p className="text-xs text-slate-400 uppercase">
                              Unit
                            </p>
                            <p className="text-sm font-semibold text-slate-900">
                              {selectedVisibleBooking.unit?.unit_number}
                            </p>
                          </div>
                          <div className="rounded-2xl border border-slate-200 px-4 py-3">
                            <p className="text-xs text-slate-400 uppercase">
                              Return Date
                            </p>
                            <p className="text-sm font-semibold text-slate-900">
                              {formatDate(selectedVisibleBooking.return_date)}
                            </p>
                          </div>
                          <div className="col-span-2 rounded-2xl border border-slate-200 px-4 py-3">
                            <p className="text-xs text-slate-400 uppercase">
                              Original End Date
                            </p>
                            <p className="text-sm font-semibold text-slate-900">
                              {formatDate(selectedVisibleBooking.end_date)}
                            </p>
                          </div>
                        </div>
                        <div
                          className={`rounded-2xl border px-4 py-3 ${
                            hasOutstanding
                              ? "border-amber-200 bg-amber-50"
                              : "border-green-200 bg-green-50"
                          }`}
                        >
                          <p className="text-xs text-slate-500 uppercase">
                            Outstanding Payment
                          </p>
                          {hasOutstanding ? (
                            <p className="text-sm font-semibold text-amber-700">
                              ${" "}
                              {selectedVisibleBooking.payments?.[0]?.amount ||
                                "—"}{" "}
                              — due{" "}
                              {formatDate(
                                selectedVisibleBooking.payments[0].due_date,
                              )}
                            </p>
                          ) : (
                            <p className="text-sm font-semibold text-green-700">
                              No outstanding payment
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-3">
                          <button
                            disabled={!!loadingAction}
                            className="flex-1 rounded-xl hover:bg-yellow-400/80 cursor-pointer bg-yellow-400 px-4 py-2 text-sm font-semibold text-slate-900 disabled:opacity-60 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
                            onClick={() =>
                              handleApproveEarlyReturn(
                                selectedVisibleBooking.id,
                              )
                            }
                          >
                            {loadingAction === "approve-return" && <Spinner />}
                            {loadingAction === "approve-return"
                              ? "Approving..."
                              : "Approve Return"}
                          </button>
                          <button
                            disabled={!!loadingAction}
                            className="flex-1 rounded-xl border border-red-200 px-4 py-2 hover:bg-red-200 cursor-pointer text-sm font-semibold text-red-600 disabled:opacity-60 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
                            onClick={() =>
                              handleRejectEarlyReturn(selectedVisibleBooking.id)
                            }
                          >
                            {loadingAction === "reject-return" && <Spinner />}
                            {loadingAction === "reject-return"
                              ? "Rejecting..."
                              : "Reject"}
                          </button>
                        </div>
                      </>
                    );
                  })()
                : null}

              {/* ── INBOX: ENDING_SOON ── */}
              {activeTab === "inbox" &&
              selectedAttentionType === "ENDING_SOON" ? (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-2xl border border-slate-200 px-4 py-3">
                      <p className="text-xs text-slate-400 uppercase">Unit</p>
                      <p className="text-sm font-semibold text-slate-900">
                        {selectedVisibleBooking.unit?.unit_number}
                      </p>
                      <p className="text-xs text-slate-400">
                        {parseInt(selectedVisibleBooking.unit?.type?.sqft)} sqft
                      </p>
                    </div>
                    <div className="rounded-2xl border border-slate-200 px-4 py-3">
                      <p className="text-xs text-slate-400 uppercase">
                        End Date
                      </p>
                      <p className="text-sm font-semibold text-rose-600">
                        {formatDate(
                          selectedVisibleBooking.return_date ||
                            selectedVisibleBooking.end_date,
                        )}
                      </p>
                    </div>
                    <div className="rounded-2xl border border-slate-200 px-4 py-3">
                      <p className="text-xs text-slate-400 uppercase">
                        Start Date
                      </p>
                      <p className="text-sm font-semibold text-slate-900">
                        {formatDate(selectedVisibleBooking.start_date)}
                      </p>
                    </div>
                    <div
                      className={`rounded-2xl border px-4 py-3 ${selectedVisibleBooking.payments?.[0]?.amount ? "border-red-200 bg-red-50" : "border-green-200 bg-green-50"}`}
                    >
                      <p className="text-xs text-slate-400 uppercase">
                        Remaining Payment
                      </p>
                      {selectedVisibleBooking.payments?.[0]?.amount ? (
                        <p className="text-sm font-semibold text-red-600">
                          $ {selectedVisibleBooking.payments[0].amount}
                        </p>
                      ) : (
                        <p className="text-sm font-semibold text-green-700">
                          No remaining payments
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      disabled={!!loadingAction}
                      className="flex-1 rounded-xl hover:bg-yellow-400/80 cursor-pointer bg-yellow-400 px-4 py-2 text-sm font-semibold text-slate-900 disabled:opacity-60 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
                      onClick={() => handleMoveOut(selectedVisibleBooking.id)}
                    >
                      {loadingAction === "moveout" && <Spinner />}
                      {loadingAction === "moveout"
                        ? "Processing..."
                        : "Confirm Move Out"}
                    </button>
                  </div>
                </>
              ) : null}

              {/* ── INBOX: PAYMENT_DUE ── */}
              {activeTab === "inbox" &&
              selectedAttentionType === "PAYMENT_DUE" ? (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-2xl border border-slate-200 px-4 py-3">
                      <p className="text-xs text-slate-400 uppercase">Unit</p>
                      <p className="text-sm font-semibold text-slate-900">
                        {selectedVisibleBooking.unit?.unit_number}
                      </p>
                      <p className="text-xs text-slate-400">
                        {parseInt(selectedVisibleBooking.unit?.type?.sqft)} sqft
                      </p>
                    </div>
                    <div className="rounded-2xl border border-orange-200 bg-orange-50 px-4 py-3">
                      <p className="text-xs text-slate-400 uppercase">
                        Due Date
                      </p>
                      <p className="text-sm font-semibold text-orange-700">
                        {formatDate(
                          selectedVisibleBooking.payments?.[0]?.due_date,
                        )}
                      </p>
                    </div>
                    <div className="rounded-2xl border border-slate-200 px-4 py-3">
                      <p className="text-xs text-slate-400 uppercase">
                        Amount Due
                      </p>
                      <p className="text-sm font-semibold text-slate-900">
                        ${" "}
                        {selectedVisibleBooking.payments?.[0]?.amount ||
                          "\u2014"}
                      </p>
                    </div>
                    <div className="rounded-2xl border border-slate-200 px-4 py-3">
                      <p className="text-xs text-slate-400 uppercase">
                        Payment Method
                      </p>
                      <p className="text-sm font-semibold text-slate-900 capitalize">
                        {selectedVisibleBooking.payments?.[0]?.payment_method ||
                          "\u2014"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      disabled={!!loadingAction}
                      className="flex-1 rounded-xl hover:bg-yellow-400/80 cursor-pointer bg-yellow-400 px-4 py-2 text-sm font-semibold text-slate-900 disabled:opacity-60 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
                      onClick={() =>
                        handleConfirmPayment(
                          selectedVisibleBooking.payments?.[0]?.id,
                        )
                      }
                    >
                      {loadingAction === "confirm-payment" && <Spinner />}
                      {loadingAction === "confirm-payment"
                        ? "Confirming..."
                        : "Confirm Payment"}
                    </button>
                  </div>
                </>
              ) : null}

              {/* ── ACTIVE TAB ── */}
              {activeTab === "active" ? (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-2xl border border-slate-200 px-4 py-3">
                      <p className="text-xs text-slate-400 uppercase">
                        Assigned Unit
                      </p>
                      <p className="text-sm font-semibold text-slate-900">
                        {selectedVisibleBooking.unit?.unit_number}
                      </p>
                      <p className="text-xs text-slate-400">
                        {parseInt(selectedVisibleBooking.unit?.type?.sqft)} sqft
                      </p>
                    </div>
                    <div className="rounded-2xl border border-slate-200 px-4 py-3">
                      <p className="text-xs text-slate-400 uppercase">
                        Monthly Payment
                      </p>
                      <p className="text-sm font-semibold text-slate-900">
                        $ {selectedVisibleBooking.payments?.[0]?.amount || "—"}
                      </p>
                      <p className="text-xs text-slate-400">
                        {selectedVisibleBooking.payments?.[0]?.due_date
                          ? `Due ${formatDate(selectedVisibleBooking.payments[0].due_date)}`
                          : ""}
                      </p>
                    </div>
                    <div className="rounded-2xl border border-slate-200 px-4 py-3">
                      <p className="text-xs text-slate-400 uppercase">
                        Start Date
                      </p>
                      <p className="text-sm font-semibold text-slate-900">
                        {formatDate(selectedVisibleBooking.start_date)}
                      </p>
                    </div>
                    <div className="rounded-2xl border border-slate-200 px-4 py-3">
                      <p className="text-xs text-slate-400 uppercase">
                        End Date
                      </p>
                      <p className="text-sm font-semibold text-slate-900">
                        {formatDate(selectedVisibleBooking.end_date)}
                      </p>
                    </div>
                    <div className="col-span-2 rounded-2xl border border-slate-200 px-4 py-3">
                      <p className="text-xs text-slate-400 uppercase">
                        Payment Method
                      </p>
                      <p className="text-sm font-semibold text-slate-900 capitalize">
                        {selectedVisibleBooking.payments?.[0]?.payment_method ||
                          "—"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      disabled={!!loadingAction}
                      className="flex-1 rounded-xl hover:bg-yellow-400/80 cursor-pointer bg-yellow-400 px-4 py-2 text-sm font-semibold text-slate-900 disabled:opacity-60 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
                      onClick={() =>
                        handleConfirmPayment(
                          selectedVisibleBooking.payments?.[0]?.id,
                        )
                      }
                    >
                      {loadingAction === "confirm-payment" && <Spinner />}
                      {loadingAction === "confirm-payment"
                        ? "Confirming..."
                        : "Confirm Payment"}
                    </button>
                  </div>
                </>
              ) : null}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default Booking;
