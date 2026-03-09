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
        myf: {
          blue: "#13AFF0",
          deep: "#0B6FA4",
          soft: "#79BDE9",
          bright: "#A7D8F4",
          gold: "#F6C453",
          bg: "#F8FBFF",
          text: "#1F2933",
          muted: "#5B6B73"
        }
      },
      fontFamily: {
        sans: ['var(--font-inter)'],
        heading: ['var(--font-sora)'],
      },
    },
  },
  plugins: [],
};
export default config;
