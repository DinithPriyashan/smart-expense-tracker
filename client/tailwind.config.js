/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["'Syne'", "sans-serif"],
        body: ["'DM Sans'", "sans-serif"],
      },
      colors: {
        obsidian: {
          900: "#0a0a0f",
          800: "#12121a",
          700: "#1a1a26",
          600: "#22222f",
        },
        violet: {
          accent: "#7c5cfc",
          glow: "#a78bfa",
          soft: "#c4b5fd",
        },
        emerald: {
          accent: "#10d9a0",
        },
        rose: {
          accent: "#f43f5e",
        },
      },
      backdropBlur: {
        xs: "2px",
      },
    },
  },
  plugins: [],
};
