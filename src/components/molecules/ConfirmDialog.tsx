import React from "react";
import { Button } from "../atoms/Button";
import { ModalPortal } from "./ModalPortal";

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  isDestructive?: boolean;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  onConfirm,
  onCancel,
  isDestructive = false,
}) => {
  return (
    <ModalPortal isOpen={isOpen} onClose={onCancel}>
      <div
        className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/40 p-4 animate-fade-in backdrop-blur-xs"
        onClick={(e) => {
          if (e.target === e.currentTarget) onCancel();
        }}
      >
        <div
          className="relative w-full max-w-sm rounded-[20px] bg-white p-6 shadow-2xl border-2 border-border"
          role="dialog"
          aria-modal="true"
        >
          <h3 className="text-xl font-extrabold text-charcoal mb-2 font-feather">{title}</h3>
          <p className="text-sm text-gray mb-6 leading-relaxed font-medium">{message}</p>

          <div className="flex gap-3 justify-end">
            <Button variant="secondary" onClick={onCancel} size="sm">
              {cancelLabel}
            </Button>
            <Button
              variant={isDestructive ? "destructive" : "primary"}
              onClick={onConfirm}
              size="sm"
            >
              {confirmLabel}
            </Button>
          </div>
        </div>
      </div>
    </ModalPortal>
  );
};
