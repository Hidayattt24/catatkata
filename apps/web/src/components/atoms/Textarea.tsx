import React, { TextareaHTMLAttributes } from "react";

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
}

export const Textarea: React.FC<TextareaProps> = ({
  className = "",
  error = false,
  ...props
}) => {
  return (
    <textarea
      className={`w-full rounded-[12px] border-2 bg-white p-3.5 text-base text-[#4b4b4b] placeholder:text-[#afafaf] focus:outline-none focus:border-[#58cc02] focus:ring-2 focus:ring-[#d7ffb8] disabled:opacity-50 transition-all font-medium ${
        error ? "border-[#ff4b4b]" : "border-[#e5e5e5]"
      } ${className}`}
      {...props}
    />
  );
};
