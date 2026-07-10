/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        coral: {
          50: "#fff4f1",
          100: "#ffe5df",
          200: "#ffccc0",
          300: "#ffa694",
          400: "#ff7259",
          500: "#f5492c",
          600: "#e0331a",
          700: "#bb2513",
          800: "#992216",
          900: "#7e2118"
        },
        lagoon: {
          50: "#effdfb",
          100: "#c9faf4",
          200: "#96f2e9",
          300: "#5be3d8",
          400: "#28c8bf",
          500: "#0ea5a3",
          600: "#0c8380",
          700: "#116967",
          800: "#135353",
          900: "#144545"
        },
        honey: {
          50: "#fffaeb",
          100: "#fef0c7",
          200: "#fde189",
          300: "#fccb4b",
          400: "#fbb422",
          500: "#f59e0b",
          600: "#d97706",
          700: "#b45309",
          800: "#92400e",
          900: "#78350f"
        }
      },
      fontFamily: {
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "sans-serif"
        ]
      },
      borderRadius: {
        xl2: "1.25rem",
        "3xl": "1.75rem"
      },
      boxShadow: {
        soft: "0 1px 2px rgba(15, 23, 42, 0.04), 0 14px 40px -12px rgba(15, 23, 42, 0.12)",
        card: "0 1px 3px rgba(15, 23, 42, 0.05), 0 22px 48px -20px rgba(15, 23, 42, 0.18)",
        lift: "0 2px 6px rgba(15, 23, 42, 0.06), 0 30px 60px -24px rgba(15, 23, 42, 0.28)",
        glow: "0 10px 30px -8px rgba(245, 73, 44, 0.45)"
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(6px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        }
      },
      animation: {
        "fade-in": "fade-in 0.35s ease-out both"
      }
    }
  },
  plugins: []
};

