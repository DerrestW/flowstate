import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["'Bebas Neue'", "cursive"],
        body: ["'DM Sans'", "sans-serif"],
        mono: ["'DM Mono'", "monospace"],
      },
      colors: {
        teal: { 400: "#4ECBA0", 500: "#2BB885", 600: "#1A9E6E" },
        ink: { 950: "#060708", 900: "#0D0F11", 800: "#141618", 700: "#1E2124", 600: "#282C30" },
        sand: { 50: "#F9F7F3", 100: "#F2EFE8", 200: "#E5E0D5" },
      },
      letterSpacing: { widest: "0.2em" },
    },
  },
  plugins: [],
};
export default config;
