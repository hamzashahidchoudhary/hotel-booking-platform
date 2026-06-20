import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CheckCircle2, XCircle, Info, X } from "lucide-react";
import { dismissToast } from "../store/uiSlice.js";

const TOAST_STYLES = {
  success: { icon: CheckCircle2, accent: "border-l-emerald-500", iconColor: "text-emerald-500" },
  error: { icon: XCircle, accent: "border-l-coral", iconColor: "text-coral" },
  info: { icon: Info, accent: "border-l-ink-light", iconColor: "text-ink-light" },
};

const Toast = ({ id, message, type = "info" }) => {
  const dispatch = useDispatch();
  const { icon: Icon, accent, iconColor } = TOAST_STYLES[type] || TOAST_STYLES.info;

  useEffect(() => {
    const timer = setTimeout(() => dispatch(dismissToast(id)), 4500);
    return () => clearTimeout(timer);
  }, [id, dispatch]);

  return (
    <div
      className={`flex items-start gap-3 rounded-lg border-l-4 ${accent} bg-white px-4 py-3 shadow-lg shadow-ink/10 animate-[slideIn_0.2s_ease-out]`}
      role="status"
    >
      <Icon className={`mt-0.5 h-5 w-5 flex-shrink-0 ${iconColor}`} />
      <p className="flex-1 text-sm text-ink">{message}</p>
      <button
        onClick={() => dispatch(dismissToast(id))}
        className="text-ink/40 hover:text-ink"
        aria-label="Dismiss notification"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
};

const ToastContainer = () => {
  const toasts = useSelector((state) => state.ui.toasts);

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex w-full max-w-sm flex-col gap-2">
      {toasts.map((toast) => (
        <Toast key={toast.id} {...toast} />
      ))}
    </div>
  );
};

export default ToastContainer;
