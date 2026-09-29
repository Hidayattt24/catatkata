import React from "react";

interface WordCounterProps {
  count: number;
  activeFilter?: string;
  singular?: string;
  plural?: string;
}

export const WordCounter: React.FC<WordCounterProps> = ({
  count,
  activeFilter = "all",
  singular = "word",
  plural = "words",
}) => {
  return (
    <div className="flex items-center justify-between px-1">
      <div className="flex items-center gap-2">
        <span className="text-sm font-extrabold text-charcoal uppercase tracking-wider">
          {count} {count === 1 ? singular : plural}
        </span>
        {activeFilter !== "all" && (
          <span className="text-xs font-bold text-green bg-green-tint px-2 py-0.5 rounded-[8px] uppercase tracking-wider">
            In {activeFilter}
          </span>
        )}
      </div>
    </div>
  );
};
