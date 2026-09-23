import React from "react";
import { PartOfSpeech } from "@/types/vocabulary";

interface TagProps {
  pos?: PartOfSpeech;
}

export const Tag: React.FC<TagProps> = ({ pos }) => {
  if (!pos) return null;

  const posStyles: Record<string, { bg: string; border: string; text: string }> = {
    Verb: {
      bg: "bg-[var(--c-pos-verb-bg)]",
      border: "border-[var(--c-pos-verb-bdr)]",
      text: "text-[var(--c-pos-verb-txt)]",
    },
    Noun: {
      bg: "bg-[var(--c-pos-noun-bg)]",
      border: "border-[var(--c-pos-noun-bdr)]",
      text: "text-[var(--c-pos-noun-txt)]",
    },
    Adjective: {
      bg: "bg-[var(--c-pos-adj-bg)]",
      border: "border-[var(--c-pos-adj-bdr)]",
      text: "text-[var(--c-pos-adj-txt)]",
    },
    Adverb: {
      bg: "bg-[var(--c-pos-adv-bg)]",
      border: "border-[var(--c-pos-adv-bdr)]",
      text: "text-[var(--c-pos-adv-txt)]",
    },
    Phrase: {
      bg: "bg-[var(--c-pos-phr-bg)]",
      border: "border-[var(--c-pos-phr-bdr)]",
      text: "text-[var(--c-pos-phr-txt)]",
    },
    Idiom: {
      bg: "bg-[var(--c-pos-idm-bg)]",
      border: "border-[var(--c-pos-idm-bdr)]",
      text: "text-[var(--c-pos-idm-txt)]",
    },
    Other: {
      bg: "bg-[var(--c-pos-oth-bg)]",
      border: "border-[var(--c-pos-oth-bdr)]",
      text: "text-[var(--c-pos-oth-txt)]",
    },
  };

  const current = posStyles[pos] || posStyles.Other;

  return (
    <span
      className={`inline-flex items-center rounded-[12px] border-2 ${current.border} ${current.bg} ${current.text} px-2.5 py-0.5 text-xs font-black uppercase tracking-wider shadow-xs`}
    >
      {pos}
    </span>
  );
};
