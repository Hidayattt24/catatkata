"use client";

import React, { useState } from "react";
import { Check, Trash, Clock, X } from "@phosphor-icons/react";
import { LockedInTask } from "@/types/lockedIn";
import { PencilStrike } from "../atoms/PencilStrike";

interface LockedInItemProps {
  task: LockedInTask;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdateDuration: (id: string, durationMinutes: number | null) => void;
}

const PRESETS = [15, 25, 45, 60];

export const LockedInItem: React.FC<LockedInItemProps> = ({
  task,
  onToggle,
  onDelete,
  onUpdateDuration,
}) => {
  const [isEditingDuration, setIsEditingDuration] = useState(false);
  const [customInput, setCustomInput] = useState("");

  const handleSetPreset = (min: number) => {
    onUpdateDuration(task.id, task.durationMinutes === min ? null : min);
    setIsEditingDuration(false);
  };

  const handleSaveCustom = () => {
    const val = parseInt(customInput, 10);
    if (!isNaN(val) && val > 0) {
      onUpdateDuration(task.id, val);
      setCustomInput("");
      setIsEditingDuration(false);
    }
  };

  return (
    <div
      className={`group relative flex flex-col rounded-[16px] border-2 border-b-4 bg-white p-3.5 sm:p-4 transition-all ${
        task.completed
          ? "border-border bg-surface/50 opacity-90"
          : "border-border hover:border-blue-border active:translate-y-[1px]"
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3.5 flex-1 min-w-0">
          {/* 3D Checkbox Button */}
          <button
            type="button"
            onClick={() => onToggle(task.id)}
            className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-[10px] border-2 border-b-4 transition-all focus:outline-none select-none active:translate-y-[2px] active:border-b-2 ${
              task.completed
                ? "bg-green text-white border-green-shadow shadow-[0_1px_0_var(--c-green-shadow)]"
                : "bg-white border-border hover:border-gray-faded text-transparent"
            }`}
            aria-label={task.completed ? "Tandai belum selesai" : "Tandai selesai"}
          >
            <Check size={18} weight="bold" />
          </button>

          {/* Task Text with Pencil Strikethrough Effect */}
          <div className="flex-1 min-w-0 text-left">
            <PencilStrike completed={task.completed} className="text-sm sm:text-base break-words">
              {task.text}
            </PencilStrike>
          </div>
        </div>

        {/* Right actions: Duration pill & Delete button */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          {/* Duration Badge / Button */}
          {task.durationMinutes ? (
            <button
              type="button"
              onClick={() => setIsEditingDuration((prev) => !prev)}
              className="flex items-center gap-1 px-2 py-0.5 rounded-full border border-blue-border bg-blue-tint text-blue text-xs font-bold transition-all hover:bg-blue hover:text-white"
              title="Klik untuk ubah durasi"
            >
              <Clock size={13} weight="fill" />
              <span>{task.durationMinutes}m</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setIsEditingDuration((prev) => !prev)}
              className="flex items-center gap-1 px-2 py-0.5 rounded-full border border-dashed border-border text-gray text-xs font-semibold hover:border-blue hover:text-blue hover:bg-blue-tint/50 transition-all"
              title="Tambah durasi waktu"
            >
              <Clock size={13} weight="bold" />
              <span>+ Waktu</span>
            </button>
          )}

          {/* Delete Action */}
          <button
            type="button"
            onClick={() => onDelete(task.id)}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-faded hover:text-red hover:bg-red-tint transition-colors focus:outline-none"
            aria-label="Hapus target"
          >
            <Trash size={18} weight="bold" />
          </button>
        </div>
      </div>

      {/* Inline Duration Editor Panel */}
      {isEditingDuration && (
        <div className="mt-3 pt-2.5 border-t border-border/80 flex flex-wrap items-center gap-1.5 text-xs animate-in fade-in duration-200">
          <span className="font-bold text-charcoal flex items-center gap-1 mr-1">
            <Clock size={14} weight="bold" className="text-blue" />
            Set Waktu:
          </span>

          {PRESETS.map((min) => (
            <button
              key={min}
              type="button"
              onClick={() => handleSetPreset(min)}
              className={`px-2 py-0.5 rounded-full border font-bold transition-all ${
                task.durationMinutes === min
                  ? "bg-blue text-white border-blue"
                  : "bg-surface border-border text-charcoal hover:border-gray-faded"
              }`}
            >
              {min}m
            </button>
          ))}

          {/* Custom minute input */}
          <div className="flex items-center gap-1 bg-surface border border-border rounded-full px-2 py-0.5">
            <input
              type="number"
              min="1"
              max="600"
              placeholder="Min"
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleSaveCustom();
                }
              }}
              className="w-10 text-center text-xs font-bold text-charcoal outline-none bg-transparent"
            />
            <button
              type="button"
              onClick={handleSaveCustom}
              className="text-[11px] font-bold text-blue hover:underline"
            >
              OK
            </button>
          </div>

          {task.durationMinutes && (
            <button
              type="button"
              onClick={() => {
                onUpdateDuration(task.id, null);
                setIsEditingDuration(false);
              }}
              className="text-[11px] font-semibold text-gray hover:text-red transition-colors ml-1"
            >
              Hapus
            </button>
          )}

          <button
            type="button"
            onClick={() => setIsEditingDuration(false)}
            className="ml-auto text-gray-faded hover:text-charcoal p-1"
            aria-label="Tutup"
          >
            <X size={14} weight="bold" />
          </button>
        </div>
      )}
    </div>
  );
};
