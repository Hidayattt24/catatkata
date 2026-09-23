import React from "react";

export interface FilterCounts {
  all: number;
  favorite: number;
  learning: number;
  reviewing: number;
  mastered: number;
}

interface FilterBarProps {
  currentFilter: string;
  onFilterChange: (filter: string) => void;
  counts: FilterCounts;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  currentFilter,
  onFilterChange,
  counts,
}) => {
  const options = [
    { key: "all", label: "All", count: counts.all },
    { key: "favorite", label: "Favorites", count: counts.favorite },
    { key: "learning", label: "Learning", count: counts.learning },
    { key: "reviewing", label: "Reviewing", count: counts.reviewing },
    { key: "mastered", label: "Mastered", count: counts.mastered },
  ];

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-1.5 pt-0.5 no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
      {options.map((opt) => {
        const isActive = currentFilter === opt.key;
        return (
          <button
            key={opt.key}
            type="button"
            onClick={() => onFilterChange(opt.key)}
            className={`flex-shrink-0 flex items-center gap-1.5 h-9 px-3.5 rounded-[12px] text-xs font-extrabold uppercase tracking-wider border-2 border-b-4 transition-all ${
              isActive
                ? "bg-green text-white border-green border-b-green-shadow"
                : "bg-white text-gray border-border border-b-border hover:border-gray-faded hover:text-charcoal"
            }`}
          >
            <span>{opt.label}</span>
            <span
              className={`rounded-full px-1.5 py-0.2 text-[10px] font-black ${
                isActive ? "bg-white/30 text-white" : "bg-mute text-gray"
              }`}
            >
              {opt.count}
            </span>
          </button>
        );
      })}
    </div>
  );
};
