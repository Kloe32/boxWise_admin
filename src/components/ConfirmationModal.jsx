import React from "react";

const ConfirmationModal = ({
  isOpen,
  title = "Confirm Action",
  description = "Are you sure you want to proceed?",
  confirmLabel = "Yes, Proceed",
  cancelLabel = "Cancel",
  variant = "danger",
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  const variantStyles =
    variant === "danger"
      ? "bg-rose-600 hover:bg-rose-700"
      : "bg-slate-900 hover:bg-slate-800";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
      <div className="w-full max-w-md rounded-3xl bg-white shadow-[0_20px_60px_rgba(15,23,42,0.25)] border border-slate-200/70 overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100 bg-linear-to-r from-slate-900 to-slate-800 text-white">
          <h3 className="text-lg font-semibold">{title}</h3>
        </div>
        <div className="px-6 py-5">
          <p className="text-sm text-slate-600">{description}</p>
        </div>
        <div className="px-6 py-5 border-t border-slate-100 bg-white flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 cursor-pointer hover:bg-slate-100"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`rounded-xl px-4 py-2 text-sm cursor-pointer font-semibold text-white ${variantStyles}`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
