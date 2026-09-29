import React from "react";
import { Verb } from "@/types/verb";
import { VerbCard } from "./VerbCard";
import { EmptyState } from "../molecules/EmptyState";

interface VerbGridProps {
  verbs: Verb[];
  totalCount: number;
  onSelectVerb: (verb: Verb) => void;
  onAddNew: () => void;
}

export const VerbGrid: React.FC<VerbGridProps> = ({
  verbs,
  totalCount,
  onSelectVerb,
  onAddNew,
}) => {
  if (verbs.length === 0) {
    return (
      <EmptyState
        type={totalCount === 0 ? "no-data" : "no-result"}
        onAddClick={onAddNew}
        title={totalCount === 0 ? "No verbs yet" : "No verbs found"}
        description={
          totalCount === 0
            ? "Catat V1, V2, V3, dan V-ing supaya lebih mudah dihafal."
            : "Try searching another verb or meaning."
        }
        actionLabel="Add Verb"
      />
    );
  }

  return (
    <div className="grid gap-3">
      {verbs.map((item) => (
        <VerbCard
          key={item.id}
          verb={item}
          onClick={() => onSelectVerb(item)}
        />
      ))}
    </div>
  );
};
