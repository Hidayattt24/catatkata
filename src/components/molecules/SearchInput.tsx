import React from "react";
import { Input } from "../atoms/Input";
import { MagnifyingGlass, X } from "@phosphor-icons/react";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onChange,
  placeholder = "Search Indonesian or English...",
}) => {
  return (
    <div className="relative w-full">
      <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-gray-faded">
        <MagnifyingGlass size={20} weight="bold" />
      </div>
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="pl-11 pr-10 border-2 border-border bg-white text-charcoal rounded-[12px] shadow-xs"
        aria-label="Search vocabulary"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-gray-faded hover:text-charcoal transition-colors"
          aria-label="Clear search"
        >
          <X size={18} weight="bold" />
        </button>
      )}
    </div>
  );
};
