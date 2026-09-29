import React from "react";

interface VerbChipProps {
  form: "V1" | "V2" | "V3" | "V-ing";
  value: string;
}

export const VerbChip: React.FC<VerbChipProps> = ({ form, value }) => {
  return (
    <div className="flex min-w-0 flex-1 flex-col items-center rounded-[12px] border-2 border-border bg-surface px-1.5 py-2">
      <span className="text-[11px] font-bold uppercase tracking-wider text-gray-faded">
        {form}
      </span>
      <span className="mt-0.5 w-full truncate text-center text-sm font-extrabold text-charcoal">
        {value}
      </span>
    </div>
  );
};
