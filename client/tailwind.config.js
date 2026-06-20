/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: "#12172B",
          light: "#1F2A44",
        },
        paper: "#FAF8F4",
        coral: {
          DEFAULT: "#FF6B4A",
          dark: "#E5523A",
        },
        gold: "#E8B86D",
      },
      fontFamily: {
        display: ["Fraunces", "serif"],
        sans: ["Inter", "sans-serif"],
      },
      borderRadius: {
        ticket: "9999px",
      },
    },
  },
  plugins: [],
};
