import React, { useEffect, useState } from "react";
import { FiCheckCircle, FiXCircle, FiInfo, FiX } from "react-icons/fi";

const variants = {
  success: {
    icon: FiCheckCircle,
    bg: "bg-green-50 border-green-200",
    iconColor: "text-green-500",
    text: "text-green-800",
    progress: "bg-green-400",
  },
  error: {
    icon: FiXCircle,
    bg: "bg-red-50 border-red-200",
    iconColor: "text-red-500",
    text: "text-red-800",
    progress: "bg-red-400",
  },
  info: {
    icon: FiInfo,
    bg: "bg-blue-50 border-blue-200",
    iconColor: "text-blue-500",
    text: "text-blue-800",
    progress: "bg-blue-400",
  },
};

const ToastItem = ({ toast, onDismiss }) => {
  const [visible, setVisible] = useState(false);
  const [exiting, setExiting] = useState(false);
  const variant = variants[toast.type] || variants.info;
  const Icon = variant.icon;
  const duration = toast.duration || 3500;

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));

    const timer = setTimeout(() => {
      setExiting(true);
      setTimeout(() => onDismiss(toast.id), 300);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, toast.id, onDismiss]);

  return (
    <div
      className={`relative overflow-hidden rounded-xl border shadow-lg backdrop-blur-sm transition-all duration-300 ${variant.bg} ${
        visible && !exiting
          ? "translate-x-0 opacity-100"
          : "translate-x-full opacity-0"
      }`}
    >
      <div className="flex items-start gap-3 px-4 py-3 pr-10">
        <Icon className={`mt-0.5 shrink-0 ${variant.iconColor}`} size={18} />
        <div className="min-w-0">
          {toast.title && (
            <p className={`text-sm font-semibold ${variant.text}`}>
              {toast.title}
            </p>
          )}
          <p className={`text-sm ${variant.text} opacity-80`}>
            {toast.message}
          </p>
        </div>
        <button
          onClick={() => {
            setExiting(true);
            setTimeout(() => onDismiss(toast.id), 300);
          }}
          className="absolute right-2.5 top-2.5 rounded-full p-0.5 text-slate-400 hover:text-slate-600"
        >
          <FiX size={14} />
        </button>
      </div>
      {/* Progress bar */}
      <div className="h-0.5 w-full bg-black/5">
        <div
          className={`h-full ${variant.progress}`}
          style={{
            animation: `shrink ${duration}ms linear forwards`,
          }}
        />
      </div>
      <style>{`
        @keyframes shrink {
          from { width: 100%; }
          to   { width: 0%; }
        }
      `}</style>
    </div>
  );
};

let toastIdCounter = 0;

export const useToast = () => {
  const [toasts, setToasts] = useState([]);

  const addToast = ({ type = "success", title, message, duration }) => {
    const id = ++toastIdCounter;
    setToasts((prev) => [...prev, { id, type, title, message, duration }]);
  };

  const dismissToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return { toasts, addToast, dismissToast };
};

const ToastContainer = ({ toasts, onDismiss }) => {
  if (!toasts.length) return null;

  return (
    <div className="fixed top-6 right-6 z-50 flex flex-col gap-2.5 w-80">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
};

export default ToastContainer;
