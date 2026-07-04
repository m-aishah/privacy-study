import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        adult: {
          bg: "#FFFFFF",
          navy: "#1F4E79",
          green: "#00573F",
          text: "#1A1A1A",
        },
        kids: {
          bg: "#FFFDF7",
          yellow: "#FFB800",
          coral: "#FF6B6B",
          teal: "#00B4D8",
        },
      },
      fontFamily: {
        adult: ["var(--font-adult)", "sans-serif"],
        kids: ["var(--font-kids)", "sans-serif"],
      },
      keyframes: {
        "bounce-in": {
          "0%": { transform: "scale(0.9)", opacity: "0" },
          "60%": { transform: "scale(1.03)", opacity: "1" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "stand-up-wiggle": {
          "0%, 100%": { transform: "translateY(0) rotate(-6deg)" },
          "50%": { transform: "translateY(-14px) rotate(6deg)" },
        },
        drift: {
          "0%, 100%": { transform: "translateX(0)" },
          "50%": { transform: "translateX(14px)" },
        },
      },
      animation: {
        "bounce-in": "bounce-in 0.4s ease-out",
        "fade-in": "fade-in 0.35s ease-in",
        "stand-up-wiggle": "stand-up-wiggle 1s ease-in-out infinite",
        drift: "drift 6s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
