"use client";

import React, { useEffect, useRef } from "react";
import { AppHeader } from "../organisms/AppHeader";
import { Plus } from "@phosphor-icons/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Lenis from "lenis";

interface AppLayoutProps {
  userEmail?: string;
  onLogout: () => void;
  onAddClick: () => void;
  isAddDisabled?: boolean;
  children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({
  userEmail,
  onLogout,
  onAddClick,
  isAddDisabled = false,
  children,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger, useGSAP);

    // Initialize Lenis Smooth Scroll
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 2,
    });

    lenisRef.current = lenis;

    // Sync Lenis scroll events with GSAP ScrollTrigger
    lenis.on("scroll", ScrollTrigger.update);

    // Synchronize Lenis with GSAP's requestAnimationFrame ticker
    const updateTicker = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(updateTicker);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(updateTicker);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  useGSAP(
    () => {
      // Entrance animation for content items using @gsap/react useGSAP
      gsap.fromTo(
        ".smooth-content-inner",
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }
      );
    },
    { scope: containerRef }
  );

  return (
    <div ref={containerRef} className="relative min-h-screen bg-[#ffffff]">
      <AppHeader userEmail={userEmail} onLogout={onLogout} />

      <main className="smooth-content-inner w-full max-w-2xl mx-auto p-4 sm:p-6 pb-28">
        {children}
      </main>

      {/* Floating Action Button */}
      {!isAddDisabled && (
        <button
          type="button"
          onClick={onAddClick}
          className="fixed right-5 bottom-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#58cc02] text-white border-b-4 border-[#46a302] shadow-lg hover:bg-[#61df02] active:translate-y-[2px] active:shadow-none transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#58cc02]"
          aria-label="Add vocabulary"
        >
          <Plus size={26} weight="bold" />
        </button>
      )}
    </div>
  );
};
