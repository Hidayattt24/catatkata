import React from "react";
import { Verb } from "@/types/verb";
import { VerbChip } from "../molecules/VerbChip";

interface VerbCardProps {
  verb: Verb;
  onClick: () => void;
}

export const VerbCard: React.FC<VerbCardProps> = ({ verb, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="group relative flex flex-col rounded-[16px] border-2 border-border border-b-4 border-b-border bg-white p-4 shadow-xs hover:border-blue hover:border-b-blue-shadow transition-all cursor-pointer active:translate-y-[2px] active:shadow-none"
    >
      <span className="text-lg font-extrabold text-charcoal leading-tight">
        {verb.indonesian}
      </span>
      <div className="mt-3 flex items-stretch gap-1.5">
        <VerbChip form="V1" value={verb.v1} />
        <VerbChip form="V2" value={verb.v2} />
        <VerbChip form="V3" value={verb.v3} />
        <VerbChip form="V-ing" value={verb.ving} />
      </div>
    </div>
  );
};
