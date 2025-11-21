/**
 * Card Component
 * Based on docs/design-system/COMPONENT_GUIDE.md
 *
 * Features:
 * - Glassmorphism effect
 * - Optional hover effect
 * - Flexible layout
 */

import React from 'react';

export interface CardProps {
  children: React.ReactNode;
  className?: string;
  hoverable?: boolean;
  onClick?: () => void;
}

export default function Card({ children, className = '', hoverable = false, onClick }: CardProps) {
  const hoverClass = hoverable ? 'hover:shadow-lg hover:scale-[1.02] cursor-pointer' : '';
  const clickableClass = onClick ? 'cursor-pointer' : '';

  return (
    <div
      className={`glass p-6 transition-all ${hoverClass} ${clickableClass} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
