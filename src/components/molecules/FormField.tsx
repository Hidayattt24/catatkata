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
      <label className="text-xs font-bold uppercase tracking-widest text-gray">
        {label} {required && <span className="text-red">*</span>}
      </label>
      {children}
      {error && <span className="text-xs font-bold text-red">{error}</span>}
    </div>
  );
};
