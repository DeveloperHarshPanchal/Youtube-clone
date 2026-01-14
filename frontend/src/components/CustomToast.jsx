import React from "react";
import { Toaster, toast } from "react-hot-toast";
import { Check, XCircle } from "lucide-react";
import "./CustomToast.css"; // make sure this path is correct

// Show success toast
export const showSuccess = (message) => {
  toast.custom((t) => <Toast message={message} type="success" t={t} />);
};

// Show error toast
export const showError = (message) => {
  toast.custom((t) => <Toast message={message} type="error" t={t} />);
};

// Toast component
const Toast = ({ message, type, t }) => (
  <div className={`toast-container ${type} ${t.visible ? "show" : "hide"}`}>
    <span className="toast-icon">
      {type === "success" ? <Check /> : <XCircle />}
    </span>
    <span className="toast-message">{message}</span>
    <button className="toast-close" onClick={() => toast.dismiss(t.id)}>
      ✖
    </button>
  </div>
);

// Include once in App.jsx
export const ToastProvider = () => (
  <Toaster
    position="top-right"
    reverseOrder={false}
    gutter={8}
    containerStyle={{ top: 70, right: 20 }}
  />
);
