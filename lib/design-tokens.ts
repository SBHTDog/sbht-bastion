/**
 * Design Tokens
 * Based on docs/design-system/design-tokens.json
 * Type-safe design system values
 */

export const colors = {
  primary: {
    blue: '#4a90e2',
    blueLight: '#6bb6ff',
    blueDark: '#2e5f8f',
  },
  neutral: {
    white: '#ffffff',
    bgLight: '#f8fafc',
    bgGray: '#f1f5f9',
    gray50: '#f9fafb',
    gray100: '#f3f4f6',
    gray200: '#e5e7eb',
    gray300: '#d1d5db',
    gray400: '#9ca3af',
    gray500: '#6b7280',
    gray600: '#4b5563',
    gray700: '#374151',
    gray800: '#1f2937',
    gray900: '#111827',
  },
  text: {
    dark: '#1e293b',
    gray: '#64748b',
    light: '#94a3b8',
  },
  semantic: {
    success: '#10b981',
    error: '#ef4444',
    warning: '#f59e0b',
    info: '#3b82f6',
  },
  code: {
    bg: '#0f172a',
    text: '#e2e8f0',
  },
} as const;

export const typography = {
  fontFamily: {
    sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
    mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
  },
  fontSize: {
    xs: '0.75rem', // 12px
    sm: '0.875rem', // 14px
    base: '1rem', // 16px
    lg: '1.125rem', // 18px
    xl: '1.25rem', // 20px
    '2xl': '1.5rem', // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem', // 36px
    '5xl': '3rem', // 48px
  },
  fontWeight: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  lineHeight: {
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.75,
  },
} as const;

export const spacing = {
  0: '0px',
  0.5: '0.125rem', // 2px
  1: '0.25rem', // 4px
  2: '0.5rem', // 8px
  3: '0.75rem', // 12px
  4: '1rem', // 16px
  6: '1.5rem', // 24px
  8: '2rem', // 32px
  12: '3rem', // 48px
  16: '4rem', // 64px
  20: '5rem', // 80px
  24: '6rem', // 96px
} as const;

export const borderRadius = {
  none: '0px',
  sm: '0.25rem', // 4px
  base: '0.5rem', // 8px
  md: '0.75rem', // 12px
  lg: '1rem', // 16px
  xl: '1.5rem', // 24px
  full: '9999px',
} as const;

export const shadows = {
  sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
  base: '0 1px 3px rgba(0, 0, 0, 0.1)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
  glass: '0 8px 32px rgba(74, 144, 226, 0.1)',
} as const;

export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
} as const;

export const animation = {
  duration: {
    fast: '150ms',
    base: '200ms',
    slow: '300ms',
  },
  easing: {
    linear: 'linear',
    easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    spring: 'cubic-bezier(0.16, 1, 0.3, 1)',
  },
} as const;

export const glass = {
  light: {
    background: 'rgba(255, 255, 255, 0.25)',
    blur: '10px',
    border: 'rgba(255, 255, 255, 0.18)',
  },
  heavy: {
    background: 'rgba(255, 255, 255, 0.95)',
    blur: '20px',
    border: 'rgba(255, 255, 255, 0.6)',
  },
  navbar: {
    background: 'rgba(255, 255, 255, 0.9)',
    blur: '8px',
  },
} as const;

export const zIndex = {
  base: 0,
  content: 10,
  floating: 20,
  dropdown: 30,
  sticky: 40,
  modal: 50,
} as const;

/**
 * Type exports for type-safe usage
 */
export type Color = typeof colors;
export type Typography = typeof typography;
export type Spacing = typeof spacing;
export type BorderRadius = typeof borderRadius;
export type Shadow = typeof shadows;
export type Breakpoint = typeof breakpoints;
export type Animation = typeof animation;
export type Glass = typeof glass;
export type ZIndex = typeof zIndex;
