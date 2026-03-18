import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class", '[data-theme="dark"]'],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          green: "#0f7a3a",
          "green-dark": "#0a5c2c",
          black: "#111111",
          white: "#ffffff",
          cream: "#f8f5f0",
          "green-light": "#e8f5ee",
        },
      },
      fontFamily: {
        display: ["var(--font-playfair)", "Georgia", "serif"],
        body: ["var(--font-dm-sans)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      boxShadow: {
        soft: "0 2px 20px rgba(15, 122, 58, 0.08)",
        card: "0 4px 24px rgba(0, 0, 0, 0.06)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
