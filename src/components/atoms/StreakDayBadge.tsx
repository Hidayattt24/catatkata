"use client";

import React from "react";
import { Check, Flame } from "@phosphor-icons/react";
import { DayStreakInfo } from "@/types/lockedIn";

interface StreakDayBadgeProps {
  day: DayStreakInfo;
}

export const StreakDayBadge: React.FC<StreakDayBadgeProps> = ({ day }) => {
  return (
    <div
      className={`flex flex-col items-center justify-center flex-1 py-1.5 px-1 rounded-[12px] border-2 transition-all ${
        day.isToday
          ? "border-b-4 border-blue bg-blue-tint text-blue shadow-sm"
          : day.isCompleted
          ? "border-b-4 border-green-shadow bg-green-tint text-green"
          : "border-border bg-surface text-gray-faded"
      }`}
    >
      <span className="text-[11px] font-bold uppercase tracking-wider">
        {day.dayName}
      </span>

      <div className="mt-1 flex h-6 w-6 items-center justify-center rounded-full">
        {day.isCompleted ? (
          <Flame size={18} weight="fill" className="text-orange-500 animate-bounce-short" />
        ) : (
          <div
            className={`h-2.5 w-2.5 rounded-full ${
              day.isToday ? "bg-blue animate-pulse" : "bg-gray-faded/40"
            }`}
          />
        )}
      </div>

      <span className="text-[10px] font-semibold opacity-75 mt-0.5">
        {day.dayNumber}
      </span>
    </div>
  );
};
