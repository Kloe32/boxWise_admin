import React, { useState } from "react";
import { cancelBooking } from "../services/booking.service";
import ConfirmationModal from "./ConfirmationModal";
import { useNavigate } from "react-router-dom";
const UnitInfoModal = ({ selectedUnit, details, onClose }) => {
  const navigate = useNavigate();
  const [isCancelOpen, setIsCancelOpen] = useState(false);
  if (!selectedUnit || !details) return null;
  const bookingId = details?.bookings?.[0]?.id;
  const onCancelClick = async (id) => {
    if (!id) return;
    await cancelBooking(id);
    onClose();
  };
  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
        <div className="w-full max-w-3xl rounded-[28px] bg-white shadow-[0_20px_60px_rgba(15,23,42,0.25)] border border-slate-200/70 overflow-hidden">
          <div className="px-6 md:px-7 py-6 border-b border-slate-100 bg-linear-to-r from-slate-950 via-slate-900 to-slate-800 text-white">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold">
                  {details.status}
                </div>
                <h3 className="mt-3 text-2xl font-semibold">{details.title}</h3>
                <p className="text-sm text-slate-200">
                  {selectedUnit?.unit_number ?? "Unit"} •{" "}
                  {selectedUnit?.type?.type_name ?? "Standard"}
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="rounded-full border border-white/30 px-3 py-1 text-sm  cursor-pointer font-semibold text-white/90 hover:bg-white/10"
              >
                Close
              </button>
            </div>
          </div>

          <div className="px-6 md:px-7 py-5 grid gap-5 bg-linear-to-b from-white via-white to-slate-50">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {details.base.map((item) => (
                <div
                  key={item.label}
                  className="rounded-xl border border-slate-200/70 bg-white px-3 py-2.5"
                >
                  <p className="text-xs uppercase tracking-wide text-slate-400">
                    {item.label}
                  </p>
                  <p className="text-base font-semibold text-slate-900">
                    {item.value}
                  </p>
                </div>
              ))}
            </div>

            {details.sections.map((section) => (
              <div key={section.title} className="grid gap-2">
                <h4 className="text-base font-semibold text-slate-800">
                  {section.title}
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {section.fields.map((field) => (
                    <div
                      key={field.label}
                      className="rounded-xl border border-slate-200/70 bg-white px-3 py-2.5"
                    >
                      <p className="text-xs uppercase tracking-wide text-slate-400">
                        {field.label}
                      </p>
                      <p className="text-base font-semibold text-slate-900">
                        {field.value}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {details.status === "Available" ? (
            <div className="px-6 md:px-7 py-5 border-t border-slate-100 bg-white flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <p className="text-sm text-slate-500">
                Ready to assign a tenant to this unit.
              </p>
              <button
                type="button"
                className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
              >
                Assign Tenant
              </button>
            </div>
          ) : null}

          {details.status === "Reserved" ? (
            <div className="px-6 md:px-7 py-5 border-t border-slate-100 bg-white flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <p className="text-sm text-slate-500">
                Reservation on hold. Confirm payment or manage the hold.
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700 cursor-pointer"
                  onClick={() => {
                    navigate("/bookings");
                  }}
                >
                  Confirm Payment
                </button>
                <button
                  type="button"
                  className="rounded-xl border bg-red-500 border-slate-200 px-4 py-2 text-sm font-semibold text-slate-50 hover:bg-red-500/70 cursor-pointer"
                  onClick={() => setIsCancelOpen(true)}
                >
                  Cancel Hold
                </button>
              </div>
            </div>
          ) : null}

          {details.status === "Occupied" ? (
            <div className="px-6 md:px-7 py-5 border-t border-slate-100 bg-white flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <p className="text-sm text-slate-500">Use quick actions.</p>
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  className="rounded-xl cursor-pointer bg-accent2 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700"
                >
                  Message Tenant
                </button>
                <button
                  type="button"
                  className="rounded-xl border cursor-pointer border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Record Payment
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </div>

      <ConfirmationModal
        description="Are you sure you want to cancel this hold?"
        title="Cancel Hold"
        isOpen={isCancelOpen}
        cancelLabel="No, Keep Hold"
        confirmLabel="Yes, Cancel Hold"
        variant="danger"
        onCancel={() => setIsCancelOpen(false)}
        onConfirm={() => onCancelClick(bookingId)}
      />
    </>
  );
};

export default UnitInfoModal;
