import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      colors: {
        brand: {
          DEFAULT: "#0E2C5C",
          dark: "#091F44",
          light: "#3A5DB0",
        },
      },
    },
  },
  plugins: [],
};

export default config;
