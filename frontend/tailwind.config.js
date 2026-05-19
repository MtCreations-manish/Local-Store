export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        ink: "#111827",
        brand: "#2563eb",
        fresh: "#16a34a",
        coral: "#f97316"
      },
      boxShadow: {
        soft: "0 12px 40px rgba(15, 23, 42, 0.10)"
      }
    }
  },
  plugins: []
};
