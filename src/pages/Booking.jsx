import React, { useState } from "react";
import { FaCheckCircle, FaClock, FaMoneyBillWave } from "react-icons/fa";
import { BsCalendar2CheckFill } from "react-icons/bs";

const stats = [
  {
    title: "Pending Payments",
    value: "7",
    change: "+3 today",
    icon: FaMoneyBillWave,
    tone: "text-amber-600 bg-amber-100",
  },
  {
    title: "Reservations",
    value: "12",
    change: "+2 this week",
    icon: BsCalendar2CheckFill,
    tone: "text-blue-600 bg-blue-100",
  },
  {
    title: "Expiring Holds",
    value: "2",
    change: "Due in 24 hrs",
    icon: FaClock,
    tone: "text-rose-600 bg-rose-100",
  },
];

const pendingPayments = [
  {
    id: "PMT-0921",
    tenant: "Amara Okafor",
    unit: "A-14",
    status: "Awaiting Confirmation",
    amount: "$220",
    due: "Feb 10, 2026",
  },
  {
    id: "PMT-0922",
    tenant: "Liam Chen",
    unit: "B-07",
    status: "Proof Uploaded",
    amount: "$210",
    due: "Feb 11, 2026",
  },
  {
    id: "PMT-0923",
    tenant: "Nia Patel",
    unit: "C-22",
    status: "Awaiting Confirmation",
    amount: "$240",
    due: "Feb 12, 2026",
  },
];

const reservations = [
  {
    id: "RSV-1180",
    tenant: "Jules Carter",
    unit: "A-02",
    hold: "7 days",
    deadline: "Feb 09, 2026",
    status: "Pending Payment",
  },
  {
    id: "RSV-1181",
    tenant: "Elena Rossi",
    unit: "B-12",
    hold: "5 days",
    deadline: "Feb 10, 2026",
    status: "Payment Received",
  },
  {
    id: "RSV-1182",
    tenant: "Tomás Silva",
    unit: "C-04",
    hold: "3 days",
    deadline: "Feb 08, 2026",
    status: "Pending Payment",
  },
  {
    id: "RSV-1183",
    tenant: "Aisha Bello",
    unit: "D-10",
    hold: "6 days",
    deadline: "Feb 13, 2026",
    status: "Awaiting Review",
  },
];

const bookings = [
  {
    id: "BKG-4401",
    tenant: "Amara Okafor",
    unit: "A-14",
    start: "Jan 05, 2026",
    end: "Dec 05, 2026",
    payment: "Confirmed",
  },
  {
    id: "BKG-4402",
    tenant: "Kenji Ito",
    unit: "B-03",
    start: "Jan 22, 2026",
    end: "Nov 22, 2026",
    payment: "Confirmed",
  },
  {
    id: "BKG-4403",
    tenant: "Nia Patel",
    unit: "C-22",
    start: "Feb 01, 2026",
    end: "Jan 31, 2027",
    payment: "Pending",
  },
];

const getStatusTone = (status) => {
  if (status === "Confirmed" || status === "Payment Received") {
    return "bg-emerald-50 text-emerald-700 border-emerald-200";
  }
  if (status === "Awaiting Review") {
    return "bg-amber-50 text-amber-700 border-amber-200";
  }
  return "bg-rose-50 text-rose-700 border-rose-200";
};

const Booking = () => {
  const [activeTab, setActiveTab] = useState("payments");

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-slate-100 p-6 md:p-8">
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
              className="bg-white/90 backdrop-blur px-6 py-7 rounded-2xl shadow-sm border border-slate-200/70 flex items-start justify-between"
            >
              <div>
                <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">
                  {item.title}
                </p>
                <h3 className="text-4xl font-bold text-navy-900 mt-2">
                  {item.value}
                </h3>
                <p className="text-sm text-slate-400 mt-2">{item.change}</p>
              </div>
              <div
                className={`p-2.5 rounded-xl ${item.tone} flex items-center justify-center`}
              >
                <Icon size={16} />
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8">
        <div className="inline-flex rounded-full bg-white/90 backdrop-blur border border-slate-200/70 p-1 shadow-sm">
          <button
            type="button"
            onClick={() => setActiveTab("payments")}
            className={`px-5 py-2 text-sm font-semibold rounded-full transition ${
              activeTab === "payments"
                ? "bg-slate-900 text-white shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Pending Payments
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("reservations")}
            className={`px-5 py-2 text-sm font-semibold rounded-full transition ${
              activeTab === "reservations"
                ? "bg-slate-900 text-white shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Reservations
          </button>
        </div>

        {activeTab === "payments" ? (
          <div className="mt-6 bg-white/90 backdrop-blur rounded-2xl shadow-sm border border-slate-200/70 overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-100 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  Pending Payment Confirmation
                </h2>
                <p className="text-sm text-slate-500">
                  Review uploaded proofs and confirm payments.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <select className="appearance-none rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600">
                  <option>All Status</option>
                  <option>Awaiting Confirmation</option>
                  <option>Proof Uploaded</option>
                </select>
                <button className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800">
                  Bulk Confirm
                </button>
              </div>
            </div>

            <div className="overflow-auto">
              <table className="min-w-full text-left">
                <thead className="bg-slate-50 text-sm uppercase text-slate-400">
                  <tr>
                    <th className="px-6 py-4">Payment ID</th>
                    <th className="px-6 py-4">Tenant</th>
                    <th className="px-6 py-4">Unit</th>
                    <th className="px-6 py-4">Amount</th>
                    <th className="px-6 py-4">Due</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-base">
                  {pendingPayments.map((row) => (
                    <tr key={row.id} className="hover:bg-slate-50/70">
                      <td className="px-6 py-5 font-semibold text-slate-700">
                        {row.id}
                      </td>
                      <td className="px-6 py-5 text-slate-600">{row.tenant}</td>
                      <td className="px-6 py-5 text-slate-600">{row.unit}</td>
                      <td className="px-6 py-5 text-slate-600">{row.amount}</td>
                      <td className="px-6 py-5 text-slate-600">{row.due}</td>
                      <td className="px-6 py-5">
                        <span
                          className={`inline-flex items-center rounded-full border px-3 py-1 text-sm font-semibold ${getStatusTone(
                            row.status,
                          )}`}
                        >
                          {row.status}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <button className="rounded-lg border border-slate-200 px-3 py-1 text-sm font-semibold text-slate-600 hover:bg-slate-50">
                          Review
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : null}

        {activeTab === "reservations" ? (
          <div className="mt-6 bg-white/90 backdrop-blur rounded-2xl shadow-sm border border-slate-200/70 overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-100">
              <h3 className="text-lg font-semibold text-slate-900">
                Pending Reservations
              </h3>
              <p className="text-sm text-slate-500">
                Holds awaiting payment confirmation.
              </p>
            </div>
            <div className="px-6 py-5 grid gap-4">
              {reservations.map((res) => (
                <div
                  key={res.id}
                  className="rounded-2xl border border-slate-200/70 bg-slate-50/60 px-5 py-4 grid gap-3 shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-base font-semibold text-slate-800">
                      {res.tenant}
                    </p>
                    <span
                      className={`inline-flex items-center rounded-full border px-3 py-1 text-sm font-semibold ${getStatusTone(
                        res.status,
                      )}`}
                    >
                      {res.status}
                    </span>
                  </div>
                  <div className="text-sm text-slate-500 grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <span className="rounded-xl bg-white/80 px-3 py-2 border border-slate-200/70">
                      Unit: {res.unit}
                    </span>
                    <span className="rounded-xl bg-white/80 px-3 py-2 border border-slate-200/70">
                      Hold: {res.hold}
                    </span>
                    <span className="rounded-xl bg-white/80 px-3 py-2 border border-slate-200/70">
                      Deadline: {res.deadline}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <button className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800">
                      Confirm
                    </button>
                    <button className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50">
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default Booking;
