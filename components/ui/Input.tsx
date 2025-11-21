/**
 * Input Component
 * Based on docs/design-system/COMPONENT_GUIDE.md
 *
 * Types: text, email, password, number, select, textarea
 */

import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  options: Array<{ value: string; label: string }>;
}

// Text Input
export function Input({ label, error, helperText, className = '', ...props }: InputProps) {
  const baseStyles =
    'w-full px-4 py-3 bg-white/80 backdrop-blur-sm border rounded-lg font-medium focus:outline-none transition-all';
  const borderStyles = error
    ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-200'
    : 'border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200';

  return (
    <div className="w-full">
      {label && <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>}
      <input className={`${baseStyles} ${borderStyles} ${className}`} {...props} />
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      {helperText && !error && <p className="mt-1 text-sm text-gray-500">{helperText}</p>}
    </div>
  );
}

// Textarea
export function Textarea({ label, error, helperText, className = '', rows = 4, ...props }: TextareaProps) {
  const baseStyles =
    'w-full px-4 py-3 bg-white/80 backdrop-blur-sm border rounded-lg font-medium focus:outline-none transition-all resize-none';
  const borderStyles = error
    ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-200'
    : 'border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200';

  return (
    <div className="w-full">
      {label && <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>}
      <textarea className={`${baseStyles} ${borderStyles} ${className}`} rows={rows} {...props} />
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      {helperText && !error && <p className="mt-1 text-sm text-gray-500">{helperText}</p>}
    </div>
  );
}

// Select
export function Select({ label, error, helperText, options, className = '', ...props }: SelectProps) {
  const baseStyles =
    'w-full px-4 py-3 bg-white/80 backdrop-blur-sm border rounded-lg font-medium focus:outline-none transition-all';
  const borderStyles = error
    ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-200'
    : 'border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200';

  return (
    <div className="w-full">
      {label && <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>}
      <select className={`${baseStyles} ${borderStyles} ${className}`} {...props}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      {helperText && !error && <p className="mt-1 text-sm text-gray-500">{helperText}</p>}
    </div>
  );
}

export default Input;
