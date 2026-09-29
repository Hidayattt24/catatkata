import React from "react";
import { Verb } from "@/types/verb";
import { Button } from "../atoms/Button";
import { VerbChip } from "../molecules/VerbChip";
import { ModalPortal } from "../molecules/ModalPortal";
import { Pencil, Trash, X } from "@phosphor-icons/react";

interface VerbDetailProps {
  verb: Verb | null;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export const VerbDetail: React.FC<VerbDetailProps> = ({
  verb,
  onClose,
  onEdit,
  onDelete,
}) => {
  if (!verb) return null;

  return (
    <ModalPortal isOpen={!!verb} onClose={onClose}>
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
            <span className="text-xs uppercase font-extrabold text-gray-faded tracking-widest">
              Verb
            </span>
            <button
              type="button"
              onClick={onClose}
              className="rounded-[10px] p-1.5 text-gray-faded hover:bg-surface hover:text-charcoal transition-colors"
            >
              <X size={20} weight="bold" />
            </button>
          </div>

          <div className="flex flex-1 flex-col justify-between overflow-y-auto p-6 gap-6">
            <div className="flex flex-col gap-5">
              <div>
                <span className="text-xs uppercase font-extrabold text-gray-faded tracking-widest">
                  Arti
                </span>
                <h2 className="text-2xl font-black text-charcoal font-feather">
                  {verb.indonesian}
                </h2>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <VerbChip form="V1" value={verb.v1} />
                <VerbChip form="V2" value={verb.v2} />
                <VerbChip form="V3" value={verb.v3} />
                <VerbChip form="V-ing" value={verb.ving} />
              </div>
            </div>

            <div className="flex flex-col gap-3 pt-4 border-t-2 border-border mt-2 shrink-0">
              <Button
                variant="secondary"
                fullWidth
                onClick={onEdit}
                className="gap-2"
              >
                <Pencil size={18} weight="bold" />
                Edit
              </Button>
              <Button
                variant="destructive"
                fullWidth
                onClick={onDelete}
                className="gap-2"
              >
                <Trash size={18} weight="bold" />
                Delete Verb
              </Button>
            </div>
          </div>
        </div>
      </div>
    </ModalPortal>
  );
};
