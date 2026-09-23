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
      className="group relative flex flex-col justify-between rounded-[16px] border-2 border-border border-b-4 border-b-border bg-white p-4 shadow-xs hover:border-blue hover:border-b-blue-shadow transition-all cursor-pointer active:translate-y-[2px] active:shadow-none"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex flex-col">
          <span className="text-lg font-extrabold text-charcoal leading-tight">
            {vocabulary.indonesian}
          </span>
          <span className="text-base font-bold text-green mt-0.5">
            {vocabulary.english}
          </span>
        </div>

        <button
          type="button"
          onClick={onToggleFavorite}
          className="p-1.5 rounded-[12px] text-gray-faded hover:text-gold hover:bg-gold-tint transition-colors"
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
              vocabulary.is_favorite ? "text-gold" : "text-gray-faded"
            }
          />
        </button>
      </div>

      <div className="mt-3.5 flex items-center gap-2 pt-2.5 border-t border-divider">
        <Tag pos={vocabulary.part_of_speech} />
        <Badge status={vocabulary.status} />
      </div>
    </div>
  );
};
