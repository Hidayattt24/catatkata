import React from "react";
import { Vocabulary } from "@/types/vocabulary";
import { VocabularyCard } from "./VocabularyCard";
import { EmptyState } from "../molecules/EmptyState";

interface VocabularyGridProps {
  vocabularies: Vocabulary[];
  totalCount: number;
  onSelectVocab: (vocab: Vocabulary) => void;
  onToggleFavorite: (id: string, e: React.MouseEvent) => void;
  onAddNew: () => void;
}

export const VocabularyGrid: React.FC<VocabularyGridProps> = ({
  vocabularies,
  totalCount,
  onSelectVocab,
  onToggleFavorite,
  onAddNew,
}) => {
  if (vocabularies.length === 0) {
    return (
      <EmptyState
        type={totalCount === 0 ? "no-data" : "no-result"}
        onAddClick={onAddNew}
      />
    );
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {vocabularies.map((item) => (
        <VocabularyCard
          key={item.id}
          vocabulary={item}
          onClick={() => onSelectVocab(item)}
          onToggleFavorite={(e) => onToggleFavorite(item.id, e)}
        />
      ))}
    </div>
  );
};
