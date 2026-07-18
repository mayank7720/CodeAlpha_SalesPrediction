/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          bg: "#0B1220",
          primary: "#4F8CFF",
          secondary: "#7C3AED",
          accent: "#22C55E",
          warning: "#F59E0B",
          error: "#EF4444",
          card: "rgba(17, 24, 39, 0.7)",
          border: "rgba(255, 255, 255, 0.08)",
        }
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
      boxShadow: {
        glow: "0 0 20px rgba(79, 140, 255, 0.15)",
        "glow-purple": "0 0 20px rgba(124, 58, 237, 0.15)",
        "glow-green": "0 0 20px rgba(34, 197, 94, 0.15)",
      }
    },
  },
  plugins: [],
}
