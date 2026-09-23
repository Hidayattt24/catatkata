import React from "react";

interface FormFieldProps {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  required = false,
  error,
  children,
}) => {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      <label className="text-xs font-bold uppercase tracking-widest text-[#777777]">
        {label} {required && <span className="text-[#ff4b4b]">*</span>}
      </label>
      {children}
      {error && <span className="text-xs font-bold text-[#ff4b4b]">{error}</span>}
    </div>
  );
};
