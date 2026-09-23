import React from "react";
import { LearningStatus } from "@/types/vocabulary";

interface BadgeProps {
  status: LearningStatus;
}

export const Badge: React.FC<BadgeProps> = ({ status }) => {
  const styles: Record<LearningStatus, string> = {
    learning: "bg-learning-bg text-learning-text border-learning-bdr",
    reviewing: "bg-reviewing-bg text-reviewing-text border-reviewing-bdr",
    mastered: "bg-mastered-bg text-mastered-text border-mastered-bdr",
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
