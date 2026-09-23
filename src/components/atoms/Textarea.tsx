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
      className={`w-full rounded-[12px] border-2 bg-white p-3.5 text-base text-charcoal placeholder:text-gray-faded focus:outline-none focus:border-green focus:ring-2 focus:ring-green-tint disabled:opacity-50 transition-all font-medium ${
        error ? "border-red" : "border-border"
      } ${className}`}
      {...props}
    />
  );
};
