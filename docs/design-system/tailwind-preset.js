/**
 * DEPLOY MONITOR DESIGN SYSTEM - TAILWIND PRESET
 *
 * Reusable Tailwind CSS preset for Deploy Monitor design system
 * Can be imported into any Tailwind v4 project
 *
 * Usage:
 * 1. Copy this file to your project
 * 2. Import in tailwind.config.js:
 *    import deployMonitorPreset from './tailwind-preset.js';
 *    export default {
 *      presets: [deployMonitorPreset],
 *      // your config
 *    }
 */

export default {
  theme: {
    extend: {
      colors: {
        // Primary Blue
        'primary-blue': {
          DEFAULT: '#4a90e2',
          light: '#6bb6ff',
          dark: '#2e5f8f',
        },

        // Semantic Colors
        success: '#10b981',
        error: '#ef4444',
        warning: '#f59e0b',
        info: '#3b82f6',

        // Text Colors
        'text-dark': '#1e293b',
        'text-gray': '#64748b',
        'text-light': '#94a3b8',

        // Background Colors
        'bg-light': '#f8fafc',
        'bg-gray': '#f1f5f9',

        // Code Colors
        'code-bg': '#0f172a',
        'code-text': '#e2e8f0',
      },

      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },

      fontSize: {
        xs: ['0.75rem', { lineHeight: '1rem' }],      // 12px
        sm: ['0.875rem', { lineHeight: '1.25rem' }],  // 14px
        base: ['1rem', { lineHeight: '1.5rem' }],     // 16px
        lg: ['1.125rem', { lineHeight: '1.75rem' }],  // 18px
        xl: ['1.25rem', { lineHeight: '1.75rem' }],   // 20px
        '2xl': ['1.5rem', { lineHeight: '2rem' }],    // 24px
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }], // 30px
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }], // 36px
        '5xl': ['3rem', { lineHeight: '1' }],         // 48px
      },

      spacing: {
        '0.5': '0.125rem',  // 2px
        '1': '0.25rem',     // 4px
        '2': '0.5rem',      // 8px
        '3': '0.75rem',     // 12px
        '4': '1rem',        // 16px
        '6': '1.5rem',      // 24px
        '8': '2rem',        // 32px
        '12': '3rem',       // 48px
        '16': '4rem',       // 64px
        '20': '5rem',       // 80px
        '24': '6rem',       // 96px
      },

      borderRadius: {
        'none': '0',
        'sm': '0.25rem',    // 4px
        DEFAULT: '0.5rem',  // 8px
        'md': '0.75rem',    // 12px
        'lg': '1rem',       // 16px
        'xl': '1.5rem',     // 24px
        'full': '9999px',
      },

      boxShadow: {
        'sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'DEFAULT': '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
        'md': '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        'lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
        'xl': '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
        'glass': '0 8px 32px rgba(74, 144, 226, 0.1), 0 2px 8px rgba(0, 0, 0, 0.05)',
        'glass-sm': '0 4px 16px 0 rgba(0, 0, 0, 0.05)',
        'glass-md': '0 8px 32px 0 rgba(0, 0, 0, 0.08)',
        'glass-lg': '0 12px 48px 0 rgba(0, 0, 0, 0.12)',
      },

      animation: {
        'fadeIn': 'fadeIn 0.2s ease-out',
        'slideUp': 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        'blob': 'blob 7s infinite',
        'shimmer': 'shimmer 2s infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },

      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': {
            opacity: '0',
            transform: 'translateY(20px) scale(0.95)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0) scale(1)',
          },
        },
        blob: {
          '0%': {
            transform: 'translate(0px, 0px) scale(1)',
          },
          '33%': {
            transform: 'translate(30px, -50px) scale(1.1)',
          },
          '66%': {
            transform: 'translate(-20px, 20px) scale(0.9)',
          },
          '100%': {
            transform: 'translate(0px, 0px) scale(1)',
          },
        },
        shimmer: {
          '0%': {
            backgroundPosition: '-200% center',
          },
          '100%': {
            backgroundPosition: '200% center',
          },
        },
      },

      backdropBlur: {
        xs: '2px',
        sm: '4px',
        DEFAULT: '8px',
        md: '10px',
        lg: '16px',
        xl: '20px',
      },

      backdropSaturate: {
        0: '0',
        50: '.5',
        100: '1',
        150: '1.5',
        200: '2',
      },

      transitionDuration: {
        '150': '150ms',
        '200': '200ms',
        '300': '300ms',
        '500': '500ms',
      },

      transitionTimingFunction: {
        'glass': 'cubic-bezier(0.4, 0, 0.2, 1)',
        'spring': 'cubic-bezier(0.16, 1, 0.3, 1)',
      },

      zIndex: {
        '0': '0',
        '10': '10',
        '20': '20',
        '30': '30',
        '40': '40',
        '50': '50',
      },

      screens: {
        'xs': '480px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
      },

      maxWidth: {
        'xs': '20rem',    // 320px
        'sm': '24rem',    // 384px
        'md': '28rem',    // 448px
        'lg': '32rem',    // 512px
        'xl': '36rem',    // 576px
        '2xl': '42rem',   // 672px
        '3xl': '48rem',   // 768px
        '4xl': '56rem',   // 896px
        '5xl': '64rem',   // 1024px
        '6xl': '72rem',   // 1152px
        '7xl': '80rem',   // 1280px
      },
    },
  },

  plugins: [
    // Custom utilities plugin
    function({ addUtilities, theme }) {
      const glassUtilities = {
        '.glass': {
          background: 'rgba(255, 255, 255, 0.25)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          borderRadius: theme('borderRadius.lg'),
          border: '1px solid rgba(255, 255, 255, 0.18)',
          boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.08), inset 0 0 0 0.5px rgba(255, 255, 255, 0.5)',
          transition: 'all 0.3s ease',
          position: 'relative',
          overflow: 'hidden',
        },

        '.glass:hover': {
          background: 'rgba(255, 255, 255, 0.3)',
          boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.1), inset 0 0 0 0.5px rgba(255, 255, 255, 0.6)',
          transform: 'translateY(-2px)',
        },

        '.glass-modal': {
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.9) 100%)',
          backdropFilter: 'blur(20px) saturate(150%)',
          WebkitBackdropFilter: 'blur(20px) saturate(150%)',
          border: '1px solid rgba(255, 255, 255, 0.6)',
          borderRadius: theme('borderRadius.lg'),
          boxShadow: '0 8px 32px rgba(74, 144, 226, 0.2), 0 0 0 1px rgba(255, 255, 255, 0.5) inset, 0 2px 8px rgba(0, 0, 0, 0.1)',
          padding: theme('spacing.6'),
        },

        '.glass-light': {
          background: 'rgba(255, 255, 255, 0.25)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          border: '1px solid rgba(255, 255, 255, 0.18)',
          boxShadow: '0 4px 16px 0 rgba(0, 0, 0, 0.05)',
        },

        '.glass-heavy': {
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px) saturate(150%)',
          WebkitBackdropFilter: 'blur(20px) saturate(150%)',
          border: '1px solid rgba(255, 255, 255, 0.6)',
          boxShadow: '0 12px 48px 0 rgba(0, 0, 0, 0.12)',
        },

        '.glass-navbar': {
          background: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
        },

        '.glass-backdrop': {
          background: 'linear-gradient(135deg, rgba(74, 144, 226, 0.3), rgba(147, 51, 234, 0.2))',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
        },

        '.dev-minimal': {
          background: theme('colors.code-bg'),
          color: theme('colors.code-text'),
          fontFamily: theme('fontFamily.mono').join(', '),
          borderRadius: theme('borderRadius.DEFAULT'),
          padding: theme('spacing.4'),
        },

        '.custom-scrollbar::-webkit-scrollbar': {
          width: '6px',
        },

        '.custom-scrollbar::-webkit-scrollbar-track': {
          background: 'rgba(0, 0, 0, 0.05)',
          borderRadius: '3px',
        },

        '.custom-scrollbar::-webkit-scrollbar-thumb': {
          background: 'rgba(74, 144, 226, 0.3)',
          borderRadius: '3px',
        },

        '.custom-scrollbar::-webkit-scrollbar-thumb:hover': {
          background: 'rgba(74, 144, 226, 0.5)',
        },
      };

      addUtilities(glassUtilities);
    },
  ],
};
