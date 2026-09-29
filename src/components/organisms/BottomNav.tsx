"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { BookOpen, ArrowsClockwise } from "@phosphor-icons/react";
import { NavItem } from "../molecules/NavItem";

const NAV_ITEMS = [
  { href: "/", label: "Kata", icon: BookOpen },
  { href: "/verbs", label: "Verb", icon: ArrowsClockwise },
] as const;

export const BottomNav: React.FC = () => {
  const pathname = usePathname();

  return (
    <nav
      className="fixed inset-x-0 z-40 flex justify-center px-4"
      style={{ bottom: "max(12px, env(safe-area-inset-bottom, 0px))" }}
      aria-label="Main"
    >
      <div className="flex items-center gap-1 rounded-[16px] border-2 border-b-4 border-border bg-white px-1.5 py-1">
        {NAV_ITEMS.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);
          const Icon = item.icon;

          return (
            <NavItem
              key={item.href}
              href={item.href}
              label={item.label}
              isActive={isActive}
              icon={<Icon size={20} weight={isActive ? "fill" : "bold"} />}
            />
          );
        })}
      </div>
    </nav>
  );
};
