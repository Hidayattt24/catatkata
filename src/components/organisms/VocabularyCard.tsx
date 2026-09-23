import React from "react";
import { Vocabulary } from "@/types/vocabulary";
import { Badge } from "../atoms/Badge";
import { Tag } from "../atoms/Tag";
import { Star } from "@phosphor-icons/react";

interface VocabularyCardProps {
  vocabulary: Vocabulary;
  onClick: () => void;
  onToggleFavorite: (e: React.MouseEvent) => void;
}

export const VocabularyCard: React.FC<VocabularyCardProps> = ({
  vocabulary,
  onClick,
  onToggleFavorite,
}) => {
  return (
    <div
      onClick={onClick}
      className="group relative flex flex-col justify-between rounded-[16px] border-2 border-[#e5e5e5] border-b-4 border-b-[#e5e5e5] bg-white p-4 shadow-xs hover:border-[#1cb0f6] hover:border-b-[#0092d6] transition-all cursor-pointer active:translate-y-[2px] active:shadow-none"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex flex-col">
          <span className="text-lg font-extrabold text-[#4b4b4b] leading-tight">
            {vocabulary.indonesian}
          </span>
          <span className="text-base font-bold text-[#58cc02] mt-0.5">
            {vocabulary.english}
          </span>
        </div>

        <button
          type="button"
          onClick={onToggleFavorite}
          className="p-1.5 rounded-[12px] text-[#afafaf] hover:text-[#ffc800] hover:bg-[#fff9e6] transition-colors"
          aria-label={
            vocabulary.is_favorite
              ? "Remove from favorite"
              : "Mark as favorite"
          }
        >
          <Star
            size={22}
            weight={vocabulary.is_favorite ? "fill" : "bold"}
            className={
              vocabulary.is_favorite ? "text-[#ffc800]" : "text-[#afafaf]"
            }
          />
        </button>
      </div>

      <div className="mt-3.5 flex items-center gap-2 pt-2.5 border-t border-[#f0f0f0]">
        <Tag pos={vocabulary.part_of_speech} />
        <Badge status={vocabulary.status} />
      </div>
    </div>
  );
};
