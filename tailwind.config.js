/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        coral: {
          50: "#fff1ee",
          100: "#ffe0da",
          500: "#ff5548",
          600: "#ee3d33"
        },
        lagoon: {
          50: "#ecfeff",
          100: "#cffafe",
          500: "#0ea5a3",
          600: "#0c8f8b"
        },
        honey: {
          100: "#fef3c7",
          500: "#f59e0b",
          600: "#d97706"
        }
      },
      boxShadow: {
        soft: "0 16px 50px rgba(15, 23, 42, 0.08)"
      }
    }
  },
  plugins: []
};

