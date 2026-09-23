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
  const baseStyles =
    "inline-flex items-center justify-center font-bold tracking-wide rounded-[12px] transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none active:translate-y-[2px] active:shadow-none";

  const sizeStyles = {
    sm: "h-9 px-3 text-xs uppercase tracking-wider",
    md: "h-11 px-4 text-sm uppercase tracking-wider",
    lg: "h-12 px-6 text-base uppercase tracking-wider",
  };

  const variantStyles = {
    primary:
      "bg-[#58cc02] text-white border-b-4 border-[#46a302] hover:bg-[#61df02] focus:ring-[#58cc02] shadow-[0_2px_0_#46a302]",
    secondary:
      "bg-white text-[#1cb0f6] border-2 border-[#afafaf] border-b-4 border-b-[#afafaf] hover:bg-[#f7f7f7] focus:ring-[#1cb0f6]",
    dark: "bg-[#000437] text-white border-b-4 border-[#00021c] hover:bg-[#090d47] focus:ring-[#000437]",
    ghost:
      "bg-transparent text-[#777777] border-2 border-transparent hover:bg-[#f7f7f7] hover:text-[#4b4b4b]",
    destructive:
      "bg-[#ff4b4b] text-white border-b-4 border-[#ea2b2b] hover:bg-[#ff5959] focus:ring-[#ff4b4b]",
  };

  const widthStyle = fullWidth ? "w-full" : "";

  return (
    <button
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${widthStyle} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};
