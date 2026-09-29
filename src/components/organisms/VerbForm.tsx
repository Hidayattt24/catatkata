import React, { useState } from "react";
import { Verb, CreateVerbInput } from "@/types/verb";
import { FormField } from "../molecules/FormField";
import { Input } from "../atoms/Input";
import { Button } from "../atoms/Button";
import { ModalPortal } from "../molecules/ModalPortal";
import { X } from "@phosphor-icons/react";

interface VerbFormProps {
  isOpen: boolean;
  initialData?: Verb | null;
  onSave: (data: CreateVerbInput) => void;
  onClose: () => void;
}

export const VerbForm: React.FC<VerbFormProps> = ({
  isOpen,
  initialData,
  onSave,
  onClose,
}) => {
  const [indonesian, setIndonesian] = useState(initialData?.indonesian ?? "");
  const [v1, setV1] = useState(initialData?.v1 ?? "");
  const [v2, setV2] = useState(initialData?.v2 ?? "");
  const [v3, setV3] = useState(initialData?.v3 ?? "");
  const [ving, setVing] = useState(initialData?.ving ?? "");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedIndonesian = indonesian.trim();
    const trimmedV1 = v1.trim();
    const trimmedV2 = v2.trim();
    const trimmedV3 = v3.trim();
    const trimmedVing = ving.trim();
    const newErrors: { [key: string]: string } = {};

    if (!trimmedIndonesian) newErrors.indonesian = "Arti is required";
    if (!trimmedV1) newErrors.v1 = "V1 is required";
    if (!trimmedV2) newErrors.v2 = "V2 is required";
    if (!trimmedV3) newErrors.v3 = "V3 is required";
    if (!trimmedVing) newErrors.ving = "V-ing is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSave({
      indonesian: trimmedIndonesian,
      v1: trimmedV1,
      v2: trimmedV2,
      v3: trimmedV3,
      ving: trimmedVing,
    });
  };

  return (
    <ModalPortal isOpen={isOpen} onClose={onClose}>
      <div
        className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/40 p-4 animate-fade-in backdrop-blur-xs overflow-y-auto"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <div
          className="relative my-auto w-full max-w-lg rounded-[20px] bg-white shadow-2xl border-2 border-border overflow-hidden flex flex-col max-h-[85vh]"
          role="dialog"
          aria-modal="true"
        >
          <div className="flex h-14 items-center justify-between border-b-2 border-border px-6 bg-white shrink-0">
            <h2 className="text-lg font-black text-green font-feather">
              {initialData ? "Edit Verb" : "Add Verb"}
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="rounded-[10px] p-1.5 text-gray-faded hover:bg-surface hover:text-charcoal transition-colors"
            >
              <X size={20} weight="bold" />
            </button>
          </div>

          <form
            onSubmit={handleSubmit}
            className="flex flex-col overflow-y-auto p-6 gap-4"
          >
            <FormField label="Arti (Indonesia)" required error={errors.indonesian}>
              <Input
                value={indonesian}
                onChange={(e) => setIndonesian(e.target.value)}
                placeholder="pergi"
                error={!!errors.indonesian}
                autoFocus
              />
            </FormField>

            <div className="grid grid-cols-2 gap-3">
              <FormField label="V1" required error={errors.v1}>
                <Input
                  value={v1}
                  onChange={(e) => setV1(e.target.value)}
                  placeholder="go"
                  error={!!errors.v1}
                />
              </FormField>
              <FormField label="V2" required error={errors.v2}>
                <Input
                  value={v2}
                  onChange={(e) => setV2(e.target.value)}
                  placeholder="went"
                  error={!!errors.v2}
                />
              </FormField>
              <FormField label="V3" required error={errors.v3}>
                <Input
                  value={v3}
                  onChange={(e) => setV3(e.target.value)}
                  placeholder="gone"
                  error={!!errors.v3}
                />
              </FormField>
              <FormField label="V-ing" required error={errors.ving}>
                <Input
                  value={ving}
                  onChange={(e) => setVing(e.target.value)}
                  placeholder="going"
                  error={!!errors.ving}
                />
              </FormField>
            </div>

            <div className="flex gap-3 pt-4 border-t-2 border-border mt-2 justify-end shrink-0">
              <Button
                type="button"
                variant="secondary"
                onClick={onClose}
                size="md"
              >
                Cancel
              </Button>
              <Button type="submit" size="md">
                Save Verb
              </Button>
            </div>
          </form>
        </div>
      </div>
    </ModalPortal>
  );
};
