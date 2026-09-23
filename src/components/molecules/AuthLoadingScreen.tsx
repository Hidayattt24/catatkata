import React from "react";

export const AuthLoadingScreen: React.FC = () => {
  return (
    <div className="flex min-h-[100dvh] items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-3">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-border border-t-green" />
        <span className="text-sm font-bold text-green font-feather uppercase tracking-wider">
          Loading CatatKata...
        </span>
      </div>
    </div>
  );
};
