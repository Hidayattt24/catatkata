import React, { ButtonHTMLAttributes } from "react";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "dark" | "ghost" | "destructive";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  size = "md",
  fullWidth = false,
  className = "",
  disabled,
  ...props
}) => {
  const base =
    "inline-flex items-center justify-center font-bold tracking-wide rounded-[12px] transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none active:translate-y-[2px] active:shadow-none";

  const sizes = {
    sm: "h-9 px-3 text-xs uppercase tracking-wider",
    md: "h-11 px-4 text-sm uppercase tracking-wider",
    lg: "h-12 px-6 text-base uppercase tracking-wider",
  };

  const variants = {
    primary:
      "bg-green text-white border-b-4 border-green-shadow hover:bg-green-hover focus:ring-green shadow-[0_2px_0_var(--c-green-shadow)]",
    secondary:
      "bg-white text-blue border-2 border-gray-faded border-b-4 border-b-gray-faded hover:bg-surface focus:ring-blue",
    dark:
      "bg-dark text-white border-b-4 border-dark-shadow hover:bg-dark-hover focus:ring-dark",
    ghost:
      "bg-transparent text-gray border-2 border-transparent hover:bg-surface hover:text-charcoal",
    destructive:
      "bg-red text-white border-b-4 border-red-shadow hover:bg-red-hover focus:ring-red",
  };

  return (
    <button
      className={`${base} ${sizes[size]} ${variants[variant]} ${fullWidth ? "w-full" : ""} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};
