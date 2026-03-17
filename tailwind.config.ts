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
          teal: "#2DD4BF",      // Vibrant primary accent
          tealDeep: "#0F766E",  // Darker teal for hover states
          coral: "#FB7185",     // Energetic red/coral
          coralDeep: "#E11D48", // Darker coral for hover states
          gold: "#FBBF24",      // Premium gold accent
          goldDeep: "#D97706",  // Darker gold for hover states
          charcoal: "#1E293B",  // Deep grey/almost black for text and footer
          muted: "#64748B",     // Secondary text color
          bg: "#F8FAFC",        // Crisp, cool off-white background
          white: "#FFFFFF",
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
