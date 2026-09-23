import React, { useState, useEffect } from "react";
import {
  Vocabulary,
  CreateVocabularyInput,
  PartOfSpeech,
  LearningStatus,
} from "@/types/vocabulary";
import { FormField } from "../molecules/FormField";
import { Input } from "../atoms/Input";
import { Textarea } from "../atoms/Textarea";
import { Button } from "../atoms/Button";
import { ModalPortal } from "../molecules/ModalPortal";
import { X } from "@phosphor-icons/react";

interface VocabularyFormProps {
  isOpen: boolean;
  initialData?: Vocabulary | null;
  onSave: (data: CreateVocabularyInput) => void;
  onClose: () => void;
}

const PARTS_OF_SPEECH: PartOfSpeech[] = [
  "Noun",
  "Verb",
  "Adjective",
  "Adverb",
  "Phrase",
  "Idiom",
  "Other",
];

const STATUSES: { value: LearningStatus; label: string }[] = [
  { value: "learning", label: "Learning" },
  { value: "reviewing", label: "Reviewing" },
  { value: "mastered", label: "Mastered" },
];

export const VocabularyForm: React.FC<VocabularyFormProps> = ({
  isOpen,
  initialData,
  onSave,
  onClose,
}) => {
  const [indonesian, setIndonesian] = useState("");
  const [english, setEnglish] = useState("");
  const [partOfSpeech, setPartOfSpeech] = useState<PartOfSpeech | "">("");
  const [exampleSentence, setExampleSentence] = useState("");
  const [note, setNote] = useState("");
  const [status, setStatus] = useState<LearningStatus>("learning");
  const [isFavorite, setIsFavorite] = useState(false);

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (initialData) {
      setIndonesian(initialData.indonesian);
      setEnglish(initialData.english);
      setPartOfSpeech(initialData.part_of_speech || "");
      setExampleSentence(initialData.example_sentence || "");
      setNote(initialData.note || "");
      setStatus(initialData.status);
      setIsFavorite(initialData.is_favorite);
    } else {
      setIndonesian("");
      setEnglish("");
      setPartOfSpeech("");
      setExampleSentence("");
      setNote("");
      setStatus("learning");
      setIsFavorite(false);
    }
    setErrors({});
  }, [initialData, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedIndonesian = indonesian.trim();
    const trimmedEnglish = english.trim();
    const newErrors: { [key: string]: string } = {};

    if (!trimmedIndonesian) {
      newErrors.indonesian = "Indonesian word is required";
    }
    if (!trimmedEnglish) {
      newErrors.english = "English word is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSave({
      indonesian: trimmedIndonesian,
      english: trimmedEnglish,
      part_of_speech: partOfSpeech ? (partOfSpeech as PartOfSpeech) : undefined,
      example_sentence: exampleSentence.trim() || undefined,
      note: note.trim() || undefined,
      status,
      is_favorite: isFavorite,
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
          className="relative my-auto w-full max-w-lg rounded-[20px] bg-white shadow-2xl border-2 border-border overflow-hidden flex flex-col max-h-[85vh] sm:max-h-[90vh]"
          role="dialog"
          aria-modal="true"
        >
          <div className="flex h-14 items-center justify-between border-b-2 border-border px-6 bg-white shrink-0">
            <h2 className="text-lg font-black text-green font-feather">
              {initialData ? "Edit Vocabulary" : "Add Vocabulary"}
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
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField label="Indonesian" required error={errors.indonesian}>
                <Input
                  value={indonesian}
                  onChange={(e) => setIndonesian(e.target.value)}
                  placeholder="Enter Indonesian word..."
                  error={!!errors.indonesian}
                />
              </FormField>

              <FormField label="English" required error={errors.english}>
                <Input
                  value={english}
                  onChange={(e) => setEnglish(e.target.value)}
                  placeholder="Enter English translation..."
                  error={!!errors.english}
                />
              </FormField>
            </div>

            <FormField label="Part of Speech">
              <select
                value={partOfSpeech}
                onChange={(e) =>
                  setPartOfSpeech(e.target.value as PartOfSpeech | "")
                }
                className="h-11 w-full rounded-[12px] border-2 border-border bg-white px-3.5 py-2 text-base font-medium text-charcoal focus:outline-none focus:border-green focus:ring-2 focus:ring-green-tint"
              >
                <option value="">Select Part of Speech (Optional)</option>
                {PARTS_OF_SPEECH.map((pos) => (
                  <option key={pos} value={pos}>
                    {pos}
                  </option>
                ))}
              </select>
            </FormField>

            {initialData && (
              <FormField label="Status">
                <div className="grid grid-cols-3 gap-2">
                  {STATUSES.map((st) => (
                    <button
                      key={st.value}
                      type="button"
                      onClick={() => setStatus(st.value)}
                      className={`h-10 rounded-[12px] text-xs font-bold uppercase tracking-wider border-2 border-b-4 transition-all ${
                        status === st.value
                          ? "bg-green text-white border-green border-b-green-shadow"
                          : "bg-white text-charcoal border-border border-b-border hover:bg-surface"
                      }`}
                    >
                      {st.label}
                    </button>
                  ))}
                </div>
              </FormField>
            )}

            <FormField label="Example Sentence">
              <Textarea
                value={exampleSentence}
                onChange={(e) => setExampleSentence(e.target.value)}
                placeholder="Enter an example sentence (optional)..."
                rows={2}
              />
            </FormField>

            <FormField label="Personal Note">
              <Textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Enter personal note or context (optional)..."
                rows={2}
              />
            </FormField>

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
                Save Vocabulary
              </Button>
            </div>
          </form>
        </div>
      </div>
    </ModalPortal>
  );
};
