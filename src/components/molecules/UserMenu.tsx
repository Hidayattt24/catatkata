import React, { useState } from "react";
import { User, SignOut } from "@phosphor-icons/react";

interface UserMenuProps {
  userEmail?: string;
  onLogout: () => void;
}

export const UserMenu: React.FC<UserMenuProps> = ({
  userEmail = "user@example.com",
  onLogout,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-10 w-10 items-center justify-center rounded-[12px] bg-[#ffffff] text-[#4b4b4b] hover:bg-[#f7f7f7] border-2 border-[#e5e5e5] border-b-4 transition-all active:translate-y-[1px]"
        aria-label="User menu"
      >
        <User size={20} weight="bold" />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 top-12 z-50 w-56 rounded-[16px] bg-white p-2 shadow-xl border-2 border-[#e5e5e5]">
            <div className="px-3 py-2 border-b border-[#e5e5e5] mb-1">
              <p className="text-xs text-[#777777] font-bold uppercase tracking-wider">Signed in as</p>
              <p className="text-sm font-bold text-[#4b4b4b] truncate">
                {userEmail}
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                onLogout();
              }}
              className="flex w-full items-center gap-2 rounded-[10px] px-3 py-2 text-sm font-bold text-[#ff4b4b] hover:bg-[#fff0f0] transition-colors"
            >
              <SignOut size={18} weight="bold" />
              Sign Out
            </button>
          </div>
        </>
      )}
    </div>
  );
};
