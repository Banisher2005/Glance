import type { Config } from 'tailwindcss';

// Glance design tokens.
// Palette: near-black base (#0A0A0C), elevated surface (#141417), hairline (#26262B),
// muted text (#8B8B93), accent is user-configurable (default electric indigo #6E6BFF).
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        base: {
          DEFAULT: '#0A0A0C',
          surface: '#121215',
          elevated: '#17171B',
          hairline: '#232328',
        },
        ink: {
          DEFAULT: '#F3F3F5',
          muted: '#9B9BA3',
          faint: '#5C5C64',
        },
        accent: {
          DEFAULT: 'var(--accent)',
          soft: 'var(--accent-soft)',
        },
      },
      fontFamily: {
        display: ['"SF Pro Display"', 'Inter', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"SF Mono"', '"JetBrains Mono"', 'monospace'],
      },
      fontSize: {
        clock: ['min(22vw, 260px)', { lineHeight: '0.95', letterSpacing: '-0.03em' }],
        'clock-md': ['min(12vw, 140px)', { lineHeight: '0.95', letterSpacing: '-0.02em' }],
      },
      spacing: {
        18: '4.5rem',
      },
      borderRadius: {
        xl2: '1.75rem',
        xl3: '2.25rem',
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        soft: '0 8px 40px -12px rgba(0,0,0,0.55)',
        glow: '0 0 60px -10px var(--accent-soft)',
      },
      transitionTimingFunction: {
        glance: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.6s cubic-bezier(0.22, 1, 0.36, 1) both',
        shimmer: 'shimmer 2.5s linear infinite',
      },
    },
  },
  plugins: [],
} satisfies Config;
