"use client";

import React, { useState } from "react";
import { Plus, Clock, X } from "@phosphor-icons/react";
import { Button } from "../atoms/Button";

interface LockedInInputProps {
  onAdd: (text: string, durationMinutes?: number | null) => void;
}

const PRESET_DURATIONS = [15, 25, 45, 60];

export const LockedInInput: React.FC<LockedInInputProps> = ({ onAdd }) => {
  const [text, setText] = useState("");
  const [selectedDuration, setSelectedDuration] = useState<number | null>(null);
  const [isCustomOpen, setIsCustomOpen] = useState(false);
  const [customValue, setCustomValue] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    onAdd(text.trim(), selectedDuration);
    setText("");
    setSelectedDuration(null);
    setIsCustomOpen(false);
    setCustomValue("");
  };

  const handleSelectPreset = (min: number) => {
    if (selectedDuration === min) {
      setSelectedDuration(null);
    } else {
      setSelectedDuration(min);
      setIsCustomOpen(false);
    }
  };

  const handleApplyCustom = () => {
    const val = parseInt(customValue, 10);
    if (!isNaN(val) && val > 0) {
      setSelectedDuration(val);
      setIsCustomOpen(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      {/* Top row: input and action button */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Target produktif hari ini... (misal: hafal 5 kata baru)"
            className="w-full h-12 rounded-[14px] border-2 border-b-4 border-border bg-white px-4 text-sm sm:text-base font-medium text-charcoal placeholder:text-gray-faded outline-none transition-colors focus:border-blue focus:border-b-blue-shadow"
          />
        </div>

        <Button
          type="submit"
          variant="primary"
          size="md"
          disabled={!text.trim()}
          className="h-12 px-4 sm:px-5 flex items-center gap-1.5 flex-shrink-0"
        >
          <Plus size={18} weight="bold" />
          <span className="hidden sm:inline">Kunci</span>
        </Button>
      </div>

      {/* Bottom row: Optional Time Selection */}
      <div className="flex flex-wrap items-center gap-1.5 px-0.5 text-xs">
        <span className="flex items-center gap-1 font-semibold text-gray mr-1 select-none">
          <Clock size={14} weight="bold" />
          Durasi:
        </span>

        {PRESET_DURATIONS.map((min) => {
          const isSelected = selectedDuration === min;
          return (
            <button
              key={min}
              type="button"
              onClick={() => handleSelectPreset(min)}
              className={`px-2.5 py-1 rounded-full border transition-all font-bold ${
                isSelected
                  ? "bg-blue text-white border-blue shadow-sm"
                  : "bg-surface border-border text-charcoal hover:border-gray-faded hover:bg-white"
              }`}
            >
              {min}m
            </button>
          );
        })}

        {/* Custom duration toggle or input */}
        {isCustomOpen ? (
          <div className="flex items-center gap-1 bg-white border border-blue rounded-full px-2 py-0.5 shadow-xs">
            <input
              type="number"
              min="1"
              max="600"
              placeholder="Menit"
              value={customValue}
              onChange={(e) => setCustomValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleApplyCustom();
                }
              }}
              className="w-14 text-center text-xs font-bold text-charcoal outline-none"
              autoFocus
            />
            <button
              type="button"
              onClick={handleApplyCustom}
              className="text-[11px] font-bold text-blue hover:underline"
            >
              OK
            </button>
            <button
              type="button"
              onClick={() => setIsCustomOpen(false)}
              className="text-gray-faded hover:text-charcoal"
            >
              <X size={12} weight="bold" />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setIsCustomOpen(true)}
            className={`px-2 py-1 rounded-full border transition-all font-semibold ${
              selectedDuration && !PRESET_DURATIONS.includes(selectedDuration)
                ? "bg-blue text-white border-blue font-bold"
                : "bg-surface border-border text-gray hover:text-charcoal"
            }`}
          >
            {selectedDuration && !PRESET_DURATIONS.includes(selectedDuration)
              ? `${selectedDuration}m`
              : "Lainnya..."}
          </button>
        )}

        {selectedDuration && (
          <button
            type="button"
            onClick={() => setSelectedDuration(null)}
            className="text-[11px] font-medium text-gray hover:text-red transition-colors ml-1"
          >
            Hapus durasi
          </button>
        )}
      </div>
    </form>
  );
};
