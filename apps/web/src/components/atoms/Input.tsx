import React, { InputHTMLAttributes } from "react";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export const Input: React.FC<InputProps> = ({
  className = "",
  error = false,
  ...props
}) => {
  return (
    <input
      className={`h-11 w-full rounded-[12px] border-2 bg-white px-3.5 py-2 text-base text-[#4b4b4b] placeholder:text-[#afafaf] focus:outline-none focus:border-[#58cc02] focus:ring-2 focus:ring-[#d7ffb8] disabled:opacity-50 transition-all font-medium ${
        error ? "border-[#ff4b4b]" : "border-[#e5e5e5]"
      } ${className}`}
      {...props}
    />
  );
};
