import React, { useState, useEffect } from "react";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";

let toastHandler = null;

export function showToast(message, type = "info") {
  if (toastHandler) {
    toastHandler({ id: Date.now(), message, type });
  }
}

export default function ToastContainer() {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    toastHandler = (newToast) => {
      setToasts((prev) => [...prev.slice(-3), newToast]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== newToast.id));
      }, 3500);
    };

    return () => {
      toastHandler = null;
    };
  }, []);

  if (toasts.length === 0) return null;

  return (
    <div className="toast_container">
      {toasts.map((toast) => (
        <div key={toast.id} className={`toast_item toast_${toast.type}`}>
          {toast.type === "success" && <CheckCircle2 size={18} className="toast_icon" />}
          {toast.type === "error" && <AlertCircle size={18} className="toast_icon" />}
          {toast.type === "info" && <Info size={18} className="toast_icon" />}
          <span className="toast_text">{toast.message}</span>
          <button
            className="toast_close"
            onClick={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))}
          >
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
}
