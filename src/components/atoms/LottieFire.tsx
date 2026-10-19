"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const DotLottieReact = dynamic(
  () =>
    import("@lottiefiles/dotlottie-react").then((mod) => mod.DotLottieReact),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex items-center justify-center animate-pulse bg-mute rounded-full" />
    ),
  }
);

interface LottieFireProps {
  active: boolean;
  className?: string;
}

export const LottieFire: React.FC<LottieFireProps> = ({
  active,
  className = "w-28 h-28 sm:w-36 sm:h-36",
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className={className} />;
  }

  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      {/* Grey Fire Layer (smooth dissolve out when active) */}
      <div
        className={`absolute inset-0 flex items-center justify-center transition-all duration-700 ease-in-out pointer-events-none ${
          active
            ? "opacity-0 scale-90 filter blur-[0.5px]"
            : "opacity-100 scale-100"
        }`}
      >
        <DotLottieReact
          src="/lottie/Grey%20Fire.lottie"
          loop
          autoplay
          className="w-full h-full object-contain"
        />
      </div>

      {/* Active Burning Fire Layer (smooth dissolve in when active) */}
      <div
        className={`absolute inset-0 flex items-center justify-center transition-all duration-700 ease-in-out pointer-events-none ${
          active
            ? "opacity-100 scale-100"
            : "opacity-0 scale-90 filter blur-[0.5px]"
        }`}
      >
        <DotLottieReact
          src="/lottie/Fire.lottie"
          loop
          autoplay
          className="w-full h-full object-contain"
        />
      </div>
    </div>
  );
};
