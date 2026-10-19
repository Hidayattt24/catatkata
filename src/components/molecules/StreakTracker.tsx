"use client";

import React from "react";
import { LottieFire } from "../atoms/LottieFire";
import { StreakDayBadge } from "../atoms/StreakDayBadge";
import { StreakState } from "@/types/lockedIn";
import { Lightning, Fire, Clock } from "@phosphor-icons/react";

interface StreakTrackerProps {
  streakState: StreakState;
}

function formatMinutes(mins: number): string {
  if (mins < 60) return `${mins} Menit`;
  const hours = Math.floor(mins / 60);
  const remaining = mins % 60;
  return remaining > 0 ? `${hours} Jam ${remaining} Menit` : `${hours} Jam`;
}

export const StreakTracker: React.FC<StreakTrackerProps> = ({ streakState }) => {
  const percent = Math.round((streakState.weeklyCompletedDays / 7) * 100);

  return (
    <div className="flex flex-col items-center rounded-[20px] border-2 border-b-4 border-border bg-white p-5 sm:p-6 shadow-sm">
      {/* Lottie Fire Centerpiece */}
      <div className="relative -mt-2">
        <LottieFire active={streakState.isFireActive} />
      </div>

      {/* Streak Status Title & Motivational Text */}
      <div className="mt-1 text-center flex flex-col items-center">
        <div className="flex items-center justify-center gap-1.5">
          <Fire
            size={22}
            weight="fill"
            className={streakState.isFireActive ? "text-orange-500" : "text-gray-faded"}
          />
          <h2 className="text-xl sm:text-2xl font-black uppercase tracking-wide text-charcoal">
            {streakState.isFireActive
              ? `${Math.max(streakState.streakCount, 1)} Hari Streak!`
              : "Api Belum Menyala"}
          </h2>
        </div>
        <p className="mt-1 text-xs sm:text-sm text-gray max-w-sm">
          {streakState.isFireActive
            ? "Luar biasa! Target hari ini tercapai, apimu tetap menyala! 🔥"
            : "Selesaikan minimal 1 target todolist hari ini untuk menyalakan apimu!"}
        </p>

        {/* Optional Total Focus Time Badge */}
        {streakState.totalMinutesToday > 0 && (
          <div className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-tint border border-blue-border text-blue text-xs font-bold">
            <Clock size={15} weight="fill" />
            <span>Fokus Hari Ini: {formatMinutes(streakState.totalMinutesToday)}</span>
          </div>
        )}
      </div>

      {/* 7-Day Progress Bar Section */}
      <div className="mt-5 w-full">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-charcoal">
            <Lightning size={16} weight="fill" className="text-gold" />
            <span>Target Mingguan (7 Hari)</span>
          </div>
          <span className="text-xs font-extrabold px-2 py-0.5 rounded-full bg-surface border border-border text-charcoal">
            {streakState.weeklyCompletedDays} / 7 Hari
          </span>
        </div>

        {/* Progress Bar Track */}
        <div className="h-4 w-full rounded-full bg-mute border-2 border-border p-0.5 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-700 ease-out border-b-2 ${
              streakState.isFireActive
                ? "bg-gradient-to-r from-orange-400 to-amber-500 border-amber-600"
                : "bg-green border-green-shadow"
            }`}
            style={{ width: `${Math.max(percent, 4)}%` }}
          />
        </div>

        {/* 7-Day Badges Grid */}
        <div className="mt-3.5 flex gap-1.5 sm:gap-2">
          {streakState.days.map((day) => (
            <StreakDayBadge key={day.date} day={day} />
          ))}
        </div>
      </div>
    </div>
  );
};
