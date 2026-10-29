import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        paper: {
          DEFAULT: "#FAF7EE",
          honey: "#F1E8C7",
        },
        matcha: {
          DEFAULT: "#9CA763",
          light: "#E4E8D2",
        },
        olive: {
          DEFAULT: "#4F5B32",
          dark: "#3B4425",
          light: "#7B8855",
        },
        ink: {
          DEFAULT: "#28291F",
          muted: "#555745",
        },
        brass: {
          DEFAULT: "#A38345",
          light: "#C7A664",
        },
        primary: {
          50: "#f3f5ea",
          100: "#e4e8d2",
          200: "#c8d0a7",
          300: "#9ca763",
          400: "#7b8855",
          500: "#5e6c3d",
          600: "#4f5b32",
          700: "#3b4425",
          800: "#2d351c",
          900: "#232915",
          DEFAULT: "#4F5B32",
        },
        accent: {
          50: "#fbf8ef",
          100: "#f5edd7",
          500: "#A38345",
          600: "#8c6e39",
          700: "#6e552d",
        },
        warm: {
          50: "#FAF7EE",
          100: "#F1E8C7",
          200: "#e4d9b0",
          300: "#d2c28c",
          400: "#b9a46a",
          500: "#A38345",
        }
      },
      fontFamily: {
        serif: ["Georgia", "Cambria", "Times New Roman", "serif"],
        sans: ["ui-sans-serif", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
} satisfies Config;
