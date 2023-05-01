import plugin from "tailwindcss/plugin";
import {
  themeColors,
  themePlugin,
  darkMode,
} from "tailwindcss-dark-mode-plugin";

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode,
  content: ["./components/**/*.tsx", "./pages/**/*.tsx"],
  theme: {
    colors: themeColors,
    extend: {
      spacing: {
        28: "7rem",
      },
      letterSpacing: {
        tighter: "-.04em",
      },
      lineHeight: {
        tight: 1.2,
      },
      fontSize: {
        "5xl": "2.5rem",
        "6xl": "2.75rem",
        "7xl": "4.5rem",
        "8xl": "6.25rem",
      },
      boxShadow: {
        sm: "0 5px 10px rgba(0, 0, 0, 0.12)",
        md: "0 8px 30px rgba(0, 0, 0, 0.12)",
      },
    },
  },
  plugins: [plugin(themePlugin)],
};
