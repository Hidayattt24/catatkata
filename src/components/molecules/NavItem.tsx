import React from "react";
import Link from "next/link";

interface NavItemProps {
  href: string;
  label: string;
  icon: React.ReactNode;
  isActive: boolean;
}

export const NavItem: React.FC<NavItemProps> = ({
  href,
  label,
  icon,
  isActive,
}) => {
  return (
    <Link
      href={href}
      className={`flex min-h-11 min-w-[4.5rem] flex-col items-center justify-center gap-0.5 rounded-[12px] px-3 py-1 transition-colors ${
        isActive
          ? "bg-green-tint text-green"
          : "text-gray-faded hover:text-charcoal"
      }`}
      aria-current={isActive ? "page" : undefined}
      aria-label={label}
    >
      {icon}
      <span className="text-[11px] font-bold uppercase tracking-wider leading-none">
        {label}
      </span>
    </Link>
  );
};
