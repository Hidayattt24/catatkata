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
      className={`h-11 w-full rounded-[12px] border-2 bg-white px-3.5 py-2 text-base text-charcoal placeholder:text-gray-faded focus:outline-none focus:border-green focus:ring-2 focus:ring-green-tint disabled:opacity-50 transition-all font-medium ${
        error ? "border-red" : "border-border"
      } ${className}`}
      {...props}
    />
  );
};
