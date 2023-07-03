import plugin from "tailwindcss/plugin"
import {
  themeColors,
  themePlugin,
  darkMode,
} from "tailwindcss-dark-mode-plugin"

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode,
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./content/**/*.{md,mdx}",
  ],
  theme: {
    colors: themeColors,
  },
  plugins: [plugin(themePlugin), require("@tailwindcss/typography")],
}
