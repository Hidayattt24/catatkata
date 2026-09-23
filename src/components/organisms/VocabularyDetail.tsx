import React, { useState } from "react";
import { Vocabulary, LearningStatus } from "@/types/vocabulary";
import { Badge } from "../atoms/Badge";
import { Tag } from "../atoms/Tag";
import { Button } from "../atoms/Button";
import { FormattedNote } from "../atoms/FormattedNote";
import { ModalPortal } from "../molecules/ModalPortal";
import { ConfirmDialog } from "../molecules/ConfirmDialog";
import { Star, Pencil, Trash, X } from "@phosphor-icons/react";

interface VocabularyDetailProps {
  vocabulary: Vocabulary | null;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onToggleFavorite: () => void;
  onChangeStatus: (status: LearningStatus) => void;
}

const STATUSES: { value: LearningStatus; label: string }[] = [
  { value: "learning", label: "Learning" },
  { value: "reviewing", label: "Reviewing" },
  { value: "mastered", label: "Mastered" },
];

export const VocabularyDetail: React.FC<VocabularyDetailProps> = ({
  vocabulary,
  onClose,
  onEdit,
  onDelete,
  onToggleFavorite,
  onChangeStatus,
}) => {
  const [pendingStatus, setPendingStatus] = useState<LearningStatus | null>(null);

  if (!vocabulary) return null;

  const handleStatusClick = (status: LearningStatus) => {
    if (status === vocabulary.status) return;
    setPendingStatus(status);
  };

  const handleConfirmStatusChange = () => {
    if (pendingStatus) {
      onChangeStatus(pendingStatus);
      setPendingStatus(null);
    }
  };

  return (
    <>
      <ModalPortal isOpen={!!vocabulary} onClose={onClose}>
        <div
          className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/40 p-4 animate-fade-in backdrop-blur-xs overflow-y-auto"
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
        >
          <div
            className="relative my-auto w-full max-w-lg rounded-[20px] bg-white shadow-2xl border-2 border-border overflow-hidden flex flex-col max-h-[85vh] sm:max-h-[90vh]"
            role="dialog"
            aria-modal="true"
          >
            <div className="flex h-14 items-center justify-between border-b-2 border-border px-6 bg-white shrink-0">
              <div className="flex items-center gap-2">
                <Tag pos={vocabulary.part_of_speech} />
                <Badge status={vocabulary.status} />
              </div>
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
                    Indonesian
                  </span>
                  <h2 className="text-2xl font-black text-charcoal font-feather">
                    {vocabulary.indonesian}
                  </h2>
                </div>

                <div>
                  <span className="text-xs uppercase font-extrabold text-gray-faded tracking-widest">
                    English
                  </span>
                  <h3 className="text-xl font-black text-green font-feather">
                    {vocabulary.english}
                  </h3>
                </div>

                {vocabulary.example_sentence && (
                  <div className="rounded-[16px] bg-green-tint/30 p-4 border-2 border-green-leaf">
                    <span className="text-xs font-bold uppercase text-green tracking-wider block mb-1">
                      Example Sentence
                    </span>
                    <FormattedNote content={vocabulary.example_sentence} />
                  </div>
                )}

                {vocabulary.note && (
                  <div>
                    <span className="text-xs font-bold uppercase text-gray-faded tracking-wider block mb-1">
                      Personal Note
                    </span>
                    <FormattedNote content={vocabulary.note} />
                  </div>
                )}

                <div>
                  <span className="text-xs font-bold uppercase text-gray-faded tracking-wider block mb-2">
                    Learning Status
                  </span>
                  <div className="grid grid-cols-3 gap-2">
                    {STATUSES.map((st) => (
                      <button
                        key={st.value}
                        type="button"
                        onClick={() => handleStatusClick(st.value)}
                        className={`h-9 rounded-[12px] text-xs font-bold uppercase tracking-wider border-2 border-b-4 transition-all ${
                          vocabulary.status === st.value
                            ? "bg-green text-white border-green border-b-green-shadow"
                            : "bg-white text-charcoal border-border border-b-border hover:bg-surface"
                        }`}
                      >
                        {st.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3 pt-4 border-t-2 border-border mt-2 shrink-0">
                <div className="flex gap-2">
                  <Button
                    variant="secondary"
                    fullWidth
                    onClick={onToggleFavorite}
                    className="gap-2"
                  >
                    <Star
                      size={18}
                      weight={vocabulary.is_favorite ? "fill" : "bold"}
                      className={
                        vocabulary.is_favorite
                          ? "text-gold"
                          : "text-gray-faded"
                      }
                    />
                    {vocabulary.is_favorite ? "Favorited" : "Favorite"}
                  </Button>
                  <Button
                    variant="secondary"
                    fullWidth
                    onClick={onEdit}
                    className="gap-2"
                  >
                    <Pencil size={18} weight="bold" />
                    Edit
                  </Button>
                </div>
                <Button
                  variant="destructive"
                  fullWidth
                  onClick={onDelete}
                  className="gap-2"
                >
                  <Trash size={18} weight="bold" />
                  Delete Vocabulary
                </Button>
              </div>
            </div>
          </div>
        </div>
      </ModalPortal>

      {/* Confirmation Dialog for Status Change */}
      <ConfirmDialog
        isOpen={!!pendingStatus}
        title="Update Learning Status?"
        message={`Are you sure you want to change the status of "${vocabulary.english}" to "${pendingStatus}"?`}
        confirmLabel="Update"
        cancelLabel="Cancel"
        onConfirm={handleConfirmStatusChange}
        onCancel={() => setPendingStatus(null)}
      />
    </>
  );
};
