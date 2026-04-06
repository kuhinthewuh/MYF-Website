import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Updated vibrant theme for MYF Redesign, preserving old colors for strict v1 widget rollback
        myf: {
          teal: "rgb(var(--theme-primary-rgb) / <alpha-value>)",
          tealDeep: "rgb(var(--theme-primary-deep-rgb) / <alpha-value>)",
          coral: "rgb(var(--theme-secondary-rgb) / <alpha-value>)",
          coralDeep: "rgb(var(--theme-secondary-deep-rgb) / <alpha-value>)",
          gold: "rgb(var(--theme-accent-rgb) / <alpha-value>)",
          goldDeep: "rgb(var(--theme-accent-rgb) / <alpha-value>)",
          charcoal: "rgb(var(--theme-text-main-rgb) / <alpha-value>)",
          muted: "rgb(var(--theme-text-muted-rgb) / <alpha-value>)",
          bg: "rgb(var(--theme-bg-rgb) / <alpha-value>)",
          white: "rgb(var(--theme-surface-rgb) / <alpha-value>)",
          surface: "rgb(var(--theme-surface-rgb) / <alpha-value>)",
          'dark-blue': "rgb(var(--theme-secondary-deep-rgb) / <alpha-value>)",
          // Old colors needed for v1 Current Events rollback
          blue: "#1CA0E3",
          deep: "#0B5C92",
          soft: "#8DC6DF",
        }
      },
      fontFamily: {
        sans: ['var(--font-inter)'],
        heading: ['var(--font-poppins)'],
      },
      maxWidth: {
        '5xl': '1280px',
        '6xl': '90%',
        '7xl': '96%',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'fade-in-up': 'fadeInUp 0.8s ease-out forwards',
        'wiggle-arrow': 'wiggleArrow 1s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        wiggleArrow: {
          '0%, 100%': { transform: 'translateX(0)' },
          '50%': { transform: 'translateX(4px)' },
        }
      }
    },
  },
  plugins: [],
};
export default config;
