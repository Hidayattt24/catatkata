import React from "react";
import { UserMenu } from "../molecules/UserMenu";

interface AppHeaderProps {
  userEmail?: string;
  onLogout: () => void;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  userEmail,
  onLogout,
}) => {
  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b-2 border-border bg-white px-4 sm:px-6">
      <div className="flex items-center gap-2">
        <h1 className="text-2xl font-black tracking-tight text-green font-feather">
          CatatKata
        </h1>
      </div>
      <UserMenu userEmail={userEmail} onLogout={onLogout} />
    </header>
  );
};
