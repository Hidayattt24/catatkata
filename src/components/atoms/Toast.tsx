"use client";

import React, { useEffect } from "react";
import { CheckCircle, Info, X } from "@phosphor-icons/react";

interface ToastProps {
  message: string | null;
  onClose: () => void;
  duration?: number;
  type?: "success" | "info" | "error";
}

export const Toast: React.FC<ToastProps> = ({
  message,
  onClose,
  duration = 3000,
  type = "success",
}) => {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [message, duration, onClose]);

  if (!message) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed z-[999999] left-1/2 -translate-x-1/2 flex items-center gap-2.5 rounded-[14px] border-2 border-b-4 border-dark-shadow bg-dark text-white px-4 py-2.5 shadow-2xl transition-all select-none animate-in fade-in slide-in-from-bottom-3 duration-300 pointer-events-auto"
      style={{
        bottom: "max(5rem, calc(4.5rem + env(safe-area-inset-bottom, 0px)))",
      }}
    >
      {type === "success" ? (
        <CheckCircle size={18} weight="fill" className="text-green flex-shrink-0" />
      ) : (
        <Info size={18} weight="fill" className="text-blue flex-shrink-0" />
      )}

      <span className="text-xs sm:text-sm font-bold tracking-wide">{message}</span>

      <button
        type="button"
        onClick={onClose}
        className="ml-1 text-gray-faded hover:text-white transition-colors p-0.5 rounded-md focus:outline-none"
        aria-label="Tutup notifikasi"
      >
        <X size={14} weight="bold" />
      </button>
    </div>
  );
};
