import React from "react";
import { Button } from "../atoms/Button";
import { BookOpen } from "@phosphor-icons/react";

interface EmptyStateProps {
  type: "no-data" | "no-result";
  onAddClick?: () => void;
  title?: string;
  description?: string;
  actionLabel?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  type,
  onAddClick,
  title,
  description,
  actionLabel,
}) => {
  if (type === "no-result") {
    return (
      <div className="flex flex-col items-center justify-center p-10 text-center border-2 border-dashed border-border rounded-[20px] bg-white my-2">
        <div className="p-4 bg-surface rounded-full text-gray-faded mb-3">
          <BookOpen size={36} weight="bold" />
        </div>
        <h3 className="text-lg font-black text-charcoal mb-1 font-feather">
          {title || "No vocabulary found"}
        </h3>
        <p className="text-sm font-medium text-gray">
          {description || "Try searching another word or phrase."}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center p-10 text-center border-2 border-dashed border-border rounded-[20px] bg-white my-2">
      <div className="p-4 bg-green-tint text-green rounded-full mb-3">
        <BookOpen size={40} weight="bold" />
      </div>
      <h3 className="text-xl font-black text-charcoal mb-1 font-feather">
        {title || "No vocabulary yet"}
      </h3>
      <p className="text-sm font-medium text-gray max-w-xs mb-6">
        {description ||
          "Start building your personal notebook by adding your first word."}
      </p>
      {onAddClick && (
        <Button onClick={onAddClick}>{actionLabel || "Add Vocabulary"}</Button>
      )}
    </div>
  );
};
