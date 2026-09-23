import React from "react";
import { LearningStatus } from "@/types/vocabulary";

interface BadgeProps {
  status: LearningStatus;
}

export const Badge: React.FC<BadgeProps> = ({ status }) => {
  const styles: Record<LearningStatus, string> = {
    learning: "bg-[#ffe8d4] text-[#ff9600] border-[#ffc38c]",
    reviewing: "bg-[#fff4d4] text-[#d7a100] border-[#ffe38c]",
    mastered: "bg-[#d7ffb8] text-[#58cc02] border-[#a5ed6e]",
  };

  const labels: Record<LearningStatus, string> = {
    learning: "Learning",
    reviewing: "Reviewing",
    mastered: "Mastered",
  };

  return (
    <span
      className={`inline-flex items-center rounded-[12px] border-2 px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider ${styles[status]}`}
    >
      {labels[status]}
    </span>
  );
};
