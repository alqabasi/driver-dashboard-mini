import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({ label, error, className = '', id, ...props }) => {
  const inputId = id || props.name;

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-slate-700 mb-1">
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={`w-full rounded-lg border px-3 py-2 text-sm outline-none transition-all
          ${error 
            ? 'border-red-300 focus:border-red-500 focus:ring-1 focus:ring-red-500' 
            : 'border-slate-300 focus:border-accent focus:ring-1 focus:ring-accent'
          }
          disabled:bg-slate-50 disabled:text-slate-500
          ${className}
        `}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
};
