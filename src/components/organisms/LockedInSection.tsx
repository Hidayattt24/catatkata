"use client";

import React from "react";
import { CheckCircle, Target, Sparkle } from "@phosphor-icons/react";
import { LockedInTask } from "@/types/lockedIn";
import { LockedInItem } from "../molecules/LockedInItem";
import { LockedInInput } from "../molecules/LockedInInput";

interface LockedInSectionProps {
  tasks: LockedInTask[];
  onAdd: (text: string, durationMinutes?: number | null) => void;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdateDuration: (id: string, durationMinutes: number | null) => void;
}

export const LockedInSection: React.FC<LockedInSectionProps> = ({
  tasks,
  onAdd,
  onToggle,
  onDelete,
  onUpdateDuration,
}) => {
  const completedCount = tasks.filter((t) => t.completed).length;
  const totalCount = tasks.length;
  const isAllDone = totalCount > 0 && completedCount === totalCount;

  return (
    <div className="flex flex-col gap-4">
      {/* Header & Status Counter */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Target size={20} weight="fill" className="text-blue" />
          <h3 className="text-base sm:text-lg font-black uppercase tracking-wide text-charcoal">
            Target Hari Ini
          </h3>
        </div>

        {totalCount > 0 && (
          <span className="flex items-center gap-1 text-xs font-extrabold px-2.5 py-1 rounded-full bg-surface border-2 border-border text-charcoal">
            {completedCount === 0 ? (
              <span>0 / {totalCount} Selesai</span>
            ) : isAllDone ? (
              <span className="text-green flex items-center gap-1">
                <CheckCircle size={14} weight="fill" />
                Semua Selesai!
              </span>
            ) : (
              <span>{completedCount} / {totalCount} Selesai</span>
            )}
          </span>
        )}
      </div>

      {/* Input Form */}
      <LockedInInput onAdd={onAdd} />

      {/* All Done Celebration Banner */}
      {/* {isAllDone && (
        <div className="flex items-center gap-2 rounded-[14px] border-2 border-b-4 border-green-shadow bg-green-tint p-3 text-xs sm:text-sm font-bold text-green">
          <Sparkle size={18} weight="fill" />
          <span>Luar biasa! Semua target hari ini sudah selesai tercoret! 🎉</span>
        </div>
      )} */}

      {/* List of Tasks */}
      {tasks.length > 0 ? (
        <div className="flex flex-col gap-2.5">
          {tasks.map((task) => (
            <LockedInItem
              key={task.id}
              task={task}
              onToggle={onToggle}
              onDelete={onDelete}
              onUpdateDuration={onUpdateDuration}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-[16px] border-2 border-dashed border-border p-8 text-center bg-surface/40">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-tint text-blue mb-2.5">
            <Target size={24} weight="bold" />
          </div>
          <h4 className="text-sm font-bold text-charcoal">Belum Ada Target Hari Ini</h4>
          <p className="mt-1 text-xs text-gray max-w-xs">
            Tulis hal produktif yang ingin kamu kerjakan hari ini. Selesaikan minimal 1 target untuk menyalakan apimu!
          </p>
        </div>
      )}
    </div>
  );
};
