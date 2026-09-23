import React from "react";
import { PartOfSpeech } from "@/types/vocabulary";

interface TagProps {
  pos?: PartOfSpeech;
}

export const Tag: React.FC<TagProps> = ({ pos }) => {
  if (!pos) return null;

  const posStyles: Record<string, { bg: string; border: string; text: string }> = {
    Verb: {
      bg: "bg-[#ddf4ff]",
      border: "border-[#1cb0f6]",
      text: "text-[#008cc9]",
    },
    Noun: {
      bg: "bg-[#ffe8d4]",
      border: "border-[#ff9600]",
      text: "text-[#d67a00]",
    },
    Adjective: {
      bg: "bg-[#fce4ec]",
      border: "border-[#ff629e]",
      text: "text-[#d62872]",
    },
    Adverb: {
      bg: "bg-[#f3e5f5]",
      border: "border-[#ce93d8]",
      text: "text-[#8e24aa]",
    },
    Phrase: {
      bg: "bg-[#e8f5e9]",
      border: "border-[#81c784]",
      text: "text-[#2e7d32]",
    },
    Idiom: {
      bg: "bg-[#fff8e1]",
      border: "border-[#ffd54f]",
      text: "text-[#f57f17]",
    },
    Other: {
      bg: "bg-[#f5f5f5]",
      border: "border-[#bdbdbd]",
      text: "text-[#616161]",
    },
  };

  const currentStyle = posStyles[pos] || posStyles.Other;

  return (
    <span
      className={`inline-flex items-center rounded-[12px] border-2 ${currentStyle.border} ${currentStyle.bg} ${currentStyle.text} px-2.5 py-0.5 text-xs font-black uppercase tracking-wider shadow-xs`}
    >
      {pos}
    </span>
  );
};
