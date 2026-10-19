"use client";

import React from "react";
import {
  CheckCircle,
  Clock,
  Flame,
  CalendarBlank,
  CalendarCheck,
} from "@phosphor-icons/react";
import { HistoryDayGroup, AllTimeStats } from "@/types/lockedIn";
import { LockedInItem } from "../molecules/LockedInItem";

interface LockedInHistoryProps {
  historyGroups: HistoryDayGroup[];
  allTimeStats: AllTimeStats;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdateDuration: (id: string, durationMinutes: number | null) => void;
}

function formatMinutes(mins: number): string {
  if (mins < 60) return `${mins}m`;
  const hours = Math.floor(mins / 60);
  const remaining = mins % 60;
  return remaining > 0 ? `${hours}j ${remaining}m` : `${hours}j`;
}

export const LockedInHistory: React.FC<LockedInHistoryProps> = ({
  historyGroups,
  allTimeStats,
  onToggle,
  onDelete,
  onUpdateDuration,
}) => {
  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-300">
      {/* All-Time Overall Stats Overview */}
      <div className="grid grid-cols-3 gap-2.5 sm:gap-3">
        {/* Completed Tasks Stat */}
        <div className="flex flex-col items-center justify-center p-3 rounded-[16px] border-2 border-b-4 border-border bg-white text-center">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-tint text-green mb-1">
            <CheckCircle size={20} weight="fill" />
          </div>
          <span className="text-lg sm:text-xl font-black text-charcoal leading-tight">
            {allTimeStats.totalCompleted}
          </span>
          <span className="text-[10px] sm:text-xs font-bold text-gray uppercase tracking-wider">
            Selesai
          </span>
        </div>

        {/* Total Time Stat */}
        <div className="flex flex-col items-center justify-center p-3 rounded-[16px] border-2 border-b-4 border-border bg-white text-center">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-tint text-blue mb-1">
            <Clock size={20} weight="fill" />
          </div>
          <span className="text-lg sm:text-xl font-black text-charcoal leading-tight">
            {formatMinutes(allTimeStats.totalMinutes)}
          </span>
          <span className="text-[10px] sm:text-xs font-bold text-gray uppercase tracking-wider">
            Total Waktu
          </span>
        </div>

        {/* Productive Days Stat */}
        <div className="flex flex-col items-center justify-center p-3 rounded-[16px] border-2 border-b-4 border-border bg-white text-center">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-100 text-orange-500 mb-1">
            <Flame size={20} weight="fill" />
          </div>
          <span className="text-lg sm:text-xl font-black text-charcoal leading-tight">
            {allTimeStats.productiveDays}
          </span>
          <span className="text-[10px] sm:text-xs font-bold text-gray uppercase tracking-wider">
            Hari Aktif
          </span>
        </div>
      </div>

      {/* Date-Grouped History Timeline */}
      {historyGroups.length > 0 ? (
        <div className="flex flex-col gap-6">
          {historyGroups.map((group) => {
            const isAllCompleted =
              group.totalTasks > 0 && group.completedTasks === group.totalTasks;

            return (
              <div key={group.date} className="flex flex-col gap-2.5">
                {/* Date Header Pill */}
                <div className="flex items-center justify-between px-1">
                  <div className="flex items-center gap-1.5">
                    <CalendarCheck size={18} weight="fill" className="text-blue" />
                    <h4 className="text-sm font-extrabold text-charcoal">
                      {group.formattedDate}
                    </h4>
                  </div>

                  <div className="flex items-center gap-2 text-xs">
                    {group.totalMinutes > 0 && (
                      <span className="flex items-center gap-1 font-bold text-blue bg-blue-tint px-2 py-0.5 rounded-full border border-blue-border">
                        <Clock size={12} weight="fill" />
                        {formatMinutes(group.totalMinutes)}
                      </span>
                    )}

                    <span
                      className={`font-bold px-2 py-0.5 rounded-full border text-[11px] ${
                        isAllCompleted
                          ? "bg-green-tint border-green-shadow text-green"
                          : "bg-surface border-border text-charcoal"
                      }`}
                    >
                      {group.completedTasks} / {group.totalTasks} Selesai
                    </span>
                  </div>
                </div>

                {/* Tasks in this Date */}
                <div className="flex flex-col gap-2">
                  {group.tasks.map((task) => (
                    <LockedInItem
                      key={task.id}
                      task={task}
                      onToggle={onToggle}
                      onDelete={onDelete}
                      onUpdateDuration={onUpdateDuration}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-[16px] border-2 border-dashed border-border p-10 text-center bg-surface/40">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-tint text-blue mb-3">
            <CalendarBlank size={28} weight="bold" />
          </div>
          <h4 className="text-base font-bold text-charcoal">Belum Ada Riwayat</h4>
          <p className="mt-1 text-xs text-gray max-w-xs leading-relaxed">
            Semua target yang kamu catat dan selesaikan akan otomatis terekam rapi di sini untuk memantau konsistensi belajarmu!
          </p>
        </div>
      )}
    </div>
  );
};
