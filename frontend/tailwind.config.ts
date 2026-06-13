import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "var(--font-inter)",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
      },
      colors: {
        brand: {
          50: "#FCEEEE",
          700: "#DC362E",
          800: "#BF0909",
        },
        surface: {
          page: "#F6F9FC",
          card: "#FFFFFF",
          muted: "#EEF3FB",
        },
        ink: {
          primary: "#0D1028",
          secondary: "#3D4053",
          muted: "#555869",
        },
        line: {
          DEFAULT: "#DEE3EA",
        },
        accent: {
          user: "#0056AC",
          userHover: "#184397",
        },
        state: {
          successFg: "#126B49",
          successBg: "#E3F3EC",
          warningFg: "#D75600",
          warningBg: "#FFF3EA",
          infoFg: "#184397",
          infoBg: "#EEF3FB",
          dangerFg: "#BF0909",
          dangerBg: "#FCEEEE",
        },
      },
      borderRadius: {
        bubble: "1rem",
      },
      ringColor: {
        focus: "#1363D0",
      },
    },
  },
  plugins: [],
};

export default config;
