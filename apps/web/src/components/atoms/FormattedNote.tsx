import React from "react";

interface FormattedNoteProps {
  content?: string;
  className?: string;
}

export const FormattedNote: React.FC<FormattedNoteProps> = ({
  content,
  className = "",
}) => {
  if (!content) return null;

  const lines = content.split("\n");

  return (
    <div className={`space-y-1.5 text-sm text-[#4b4b4b] leading-relaxed ${className}`}>
      {lines.map((line, idx) => {
        const isBullet = line.trim().startsWith("- ") || line.trim().startsWith("* ");
        const text = isBullet ? line.trim().substring(2) : line;

        const parts = text.split(/(`[^`]+`)/g);

        const renderedContent = parts.map((part, pIdx) => {
          if (part.startsWith("`") && part.endsWith("`")) {
            return (
              <code
                key={pIdx}
                className="rounded bg-[#f0eeec] px-1.5 py-0.5 font-mono text-[0.85em] text-[#000000] border border-[#e5e5e5]"
              >
                {part.slice(1, -1)}
              </code>
            );
          }
          return part;
        });

        if (isBullet) {
          return (
            <div key={idx} className="flex items-start gap-2 pl-1">
              <span className="h-1.5 w-1.5 rounded-full bg-[#58cc02] mt-2 flex-shrink-0" />
              <span>{renderedContent}</span>
            </div>
          );
        }

        return <p key={idx}>{renderedContent}</p>;
      })}
    </div>
  );
};
