/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // 深空骨架
        void: {
          950: '#04050a',
          900: '#070910',
          850: '#0a0d16',
          800: '#0e121c',
          700: '#141927',
          600: '#1b2132',
          500: '#28303f',
        },
        ice: {
          300: '#a5e4fd',
          400: '#7dd3fc',
          500: '#38bdf8',
          600: '#0ea5e9',
        },
        // 霓虹点缀（取自目标站强调色，转译到暗色底上）
        neon: {
          lime: '#edff66',
          violet: '#7c5cff',
          pink: '#ff8fab',
          blue: '#4fb7dd',
          mint: '#90e8d6',
          gold: '#ffe7b8',
        },
      },
      fontFamily: {
        sans: ['Inter', '"PingFang SC"', '"Microsoft YaHei"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
        serif: ['"Noto Serif SC"', 'Georgia', '"Songti SC"', 'serif'],
      },
      maxWidth: {
        shell: '1700px',
      },
      letterSpacing: {
        tightest: '-0.045em',
      },
      transitionTimingFunction: {
        'expo-out': 'cubic-bezier(0.16, 1, 0.3, 1)',
        'expo-in-out': 'cubic-bezier(0.87, 0, 0.13, 1)',
        smooth: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        envelope: 'cubic-bezier(0.22, 0.61, 0.36, 1)',
      },
      boxShadow: {
        'glow-sm': '0 0 24px -6px rgba(56, 189, 248, 0.45)',
        glow: '0 0 60px -12px rgba(56, 189, 248, 0.5)',
        'glow-lime': '0 0 44px -10px rgba(237, 255, 102, 0.7)',
        'glow-violet': '0 0 60px -12px rgba(124, 92, 255, 0.65)',
        'inner-line': 'inset 0 1px 0 0 rgba(255, 255, 255, 0.06)',
        shelf: '0 18px 40px -18px rgba(0, 0, 0, 0.9)',
      },
      backgroundImage: {
        'grid-faint':
          'linear-gradient(rgba(255,255,255,0.028) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.028) 1px, transparent 1px)',
        noise:
          "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 220 220' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.82' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.42'/%3E%3C/svg%3E\")",
        'radial-fade':
          'radial-gradient(ellipse 70% 60% at 50% 50%, transparent 28%, #04050a 100%)',
      },
      keyframes: {
        drift: {
          '0%, 100%': { transform: 'translate3d(0,0,0) scale(1)' },
          '33%': { transform: 'translate3d(4%, -6%, 0) scale(1.08)' },
          '66%': { transform: 'translate3d(-5%, 3%, 0) scale(0.96)' },
        },
        breathe: {
          '0%, 100%': { opacity: '0.35' },
          '50%': { opacity: '0.75' },
        },
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(2000%)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '200% center' },
          '100%': { backgroundPosition: '-200% center' },
        },
        'intro-leave-left': {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-100%)' },
        },
        'intro-leave-right': {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(100%)' },
        },
        'arc-breath': {
          '0%, 100%': { opacity: '0.45', transform: 'scale(1)' },
          '50%': { opacity: '0.8', transform: 'scale(1.04)' },
        },
        'neon-flicker': {
          '0%, 100%': { opacity: '1' },
          '48%': { opacity: '1' },
          '50%': { opacity: '0.72' },
          '52%': { opacity: '1' },
          '86%': { opacity: '1' },
          '88%': { opacity: '0.8' },
          '90%': { opacity: '1' },
        },
        'fade-rise': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'drift-slow': 'drift 26s ease-in-out infinite',
        'drift-medium': 'drift 18s ease-in-out infinite alternate',
        'drift-fast': 'drift 12s ease-in-out infinite alternate-reverse',
        breathe: 'breathe 5s ease-in-out infinite',
        scanline: 'scanline 9s linear infinite',
        shimmer: 'shimmer 6s linear infinite',
        'arc-breath': 'arc-breath 8s ease-in-out 1.5s infinite',
        'neon-flicker': 'neon-flicker 7s linear infinite',
        'fade-rise': 'fade-rise 0.9s cubic-bezier(0.22, 0.61, 0.36, 1) both',
      },
    },
  },
  plugins: [],
}
