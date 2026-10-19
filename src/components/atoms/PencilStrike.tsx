"use client";

import React, { useEffect, useState } from "react";
import { PencilSimple } from "@phosphor-icons/react";

interface PencilStrikeProps {
  completed: boolean;
  children: React.ReactNode;
  className?: string;
}

export const PencilStrike: React.FC<PencilStrikeProps> = ({
  completed,
  children,
  className = "",
}) => {
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    if (completed) {
      setAnimating(true);
      const timer = setTimeout(() => {
        setAnimating(false);
      }, 550);
      return () => clearTimeout(timer);
    } else {
      setAnimating(false);
    }
  }, [completed]);

  return (
    <span className={`relative inline-block ${className}`}>
      <span
        className={`transition-colors duration-300 select-none ${
          completed ? "text-gray-faded" : "text-charcoal font-medium"
        }`}
      >
        {children}
      </span>

      {/* SVG Hand-drawn Pencil Strike */}
      <svg
        className={`absolute left-0 top-1/2 -translate-y-1/2 w-full pointer-events-none overflow-visible transition-opacity duration-300 ${
          completed ? "opacity-100" : "opacity-0"
        }`}
        height="12"
        viewBox="0 0 100 12"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        {/* Double-layered organic pencil scratch stroke */}
        <path
          d="M 0,7 Q 25,3 50,7 T 100,6"
          fill="none"
          stroke="#4b4b4b"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          pathLength="100"
          style={{
            strokeDasharray: 100,
            strokeDashoffset: completed ? 0 : 100,
            transition: "stroke-dashoffset 420ms cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        />
        <path
          d="M 1,5 Q 35,8 70,4 T 100,8"
          fill="none"
          stroke="#777777"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          pathLength="100"
          style={{
            strokeDasharray: 100,
            strokeDashoffset: completed ? 0 : 100,
            transition: "stroke-dashoffset 480ms cubic-bezier(0.4, 0, 0.2, 1) 40ms",
          }}
        />
      </svg>

      {/* Moving pencil icon during strike animation */}
      {animating && (
        <span
          className="absolute top-1/2 -translate-y-1/2 pointer-events-none text-charcoal z-10"
          style={{
            animation: "pencil-draw 450ms cubic-bezier(0.4, 0, 0.2, 1) forwards",
          }}
        >
          <PencilSimple
            size={18}
            weight="fill"
            className="rotate-[-45deg] -translate-y-2 translate-x-1 filter drop-shadow-sm"
          />
        </span>
      )}

      <style jsx>{`
        @keyframes pencil-draw {
          0% {
            left: 0%;
            opacity: 1;
            transform: translateY(-50%) scale(1.1);
          }
          90% {
            left: 100%;
            opacity: 1;
            transform: translateY(-50%) scale(1.1);
          }
          100% {
            left: 100%;
            opacity: 0;
            transform: translateY(-50%) scale(0.8);
          }
        }
      `}</style>
    </span>
  );
};
