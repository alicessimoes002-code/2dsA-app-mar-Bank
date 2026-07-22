import { AlertTriangle, Info, X } from "lucide-react";
import { useState } from "react";

export default function AlertBanner({ type = "info", message }) {
  const [visible, setVisible] = useState(true);
  if (!visible) return null;

  const styles = {
    warning: "bg-amber-50 border-amber-200 text-amber-800",
    error: "bg-rose-50 border-rose-200 text-rose-800",
    info: "bg-sky-50 border-sky-200 text-sky-800",
    success: "bg-emerald-50 border-emerald-200 text-emerald-800",
  };

  const Icon = type === "warning" || type === "error" ? AlertTriangle : Info;

  return (
    <div className={`flex items-center gap-3 p-4 rounded-2xl border ${styles[type]} animate-in`}>
      <Icon className="w-5 h-5 flex-shrink-0" />
      <p className="text-sm font-medium flex-1">{message}</p>
      <button onClick={() => setVisible(false)} className="opacity-50 hover:opacity-100 transition-opacity">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
