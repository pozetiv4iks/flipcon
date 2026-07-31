"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { X, AlertCircle, CheckCircle, Info } from "lucide-react";

type ToastType = "success" | "error" | "info";

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: ToastType = "info") => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 5000);
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed left-6 top-6 z-[1000] flex flex-col gap-3 pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex min-w-[300px] max-w-md items-start gap-3 rounded-2xl border p-4 shadow-2xl transition-all animate-in slide-in-from-left-10 duration-300 ${
              toast.type === "error"
                ? "border-red-500/20 bg-red-500/10 text-red-200"
                : toast.type === "success"
                ? "border-green-500/20 bg-green-500/10 text-green-200"
                : "border-white/10 bg-white/5 text-white"
            } backdrop-blur-xl`}
          >
            <div className="mt-0.5">
              {toast.type === "error" && <AlertCircle size={18} />}
              {toast.type === "success" && <CheckCircle size={18} />}
              {toast.type === "info" && <Info size={18} />}
            </div>
            <div className="flex-1 text-[14px] font-medium leading-relaxed">
              {toast.message}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="ml-2 rounded-lg p-1 hover:bg-white/10 transition-colors"
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};
