/**
 * Button Component
 * Based on docs/design-system/COMPONENT_GUIDE.md
 *
 * Variants: primary, secondary, ghost, outline, danger
 * Sizes: sm, md, lg
 */

import React from 'react';

export interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  onClick,
  disabled = false,
  type = 'button',
  className = '',
}: ButtonProps) {
  const baseStyles =
    'rounded-lg font-medium transition-all duration-150 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 active:scale-[0.98]',
    secondary: 'bg-white border border-blue-600 text-blue-600 hover:bg-blue-50 active:scale-[0.98]',
    ghost: 'bg-transparent text-gray-600 hover:bg-gray-100 active:scale-[0.98]',
    outline: 'border border-blue-600 text-blue-600 bg-white hover:bg-blue-50 active:scale-[0.98]',
    danger: 'bg-red-600 text-white hover:bg-red-700 active:scale-[0.98]',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      onClick={onClick}
      disabled={disabled}
      type={type}
    >
      {children}
    </button>
  );
}
