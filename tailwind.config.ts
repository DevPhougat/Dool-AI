import type { Config } from "tailwindcss";

const c = (name: string) => `rgb(var(--${name}) / <alpha-value>)`;

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: c("ink"),
        cream: c("cream"),
        paper: c("paper"),
        violet: { DEFAULT: c("violet"), soft: c("violet-soft") },
        sky: { DEFAULT: c("sky"), soft: c("sky-soft") },
        peach: { DEFAULT: c("peach"), soft: c("peach-soft") },
        mint: { DEFAULT: c("mint"), soft: c("mint-soft") },
        pink: { DEFAULT: c("pink"), soft: c("pink-soft") },
        sun: { DEFAULT: c("sun"), soft: c("sun-soft") },
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
      },
      borderRadius: { card: "24px", tile: "18px" },
      boxShadow: {
        pop: "0 4px 0 0 rgb(var(--ink))",
        "pop-lg": "0 7px 0 0 rgb(var(--ink))",
        soft: "0 10px 30px -12px rgb(var(--ink) / 0.25)",
      },
      keyframes: {
        float: { "0%,100%": { transform: "translateY(0)" }, "50%": { transform: "translateY(-10px)" } },
        spin: { to: { transform: "rotate(360deg)" } },
        twinkle: { "0%,100%": { opacity: "1", transform: "scale(1)" }, "50%": { opacity: ".5", transform: "scale(.8)" } },
      },
      animation: {
        float: "float 5s ease-in-out infinite",
        "spin-slow": "spin 14s linear infinite",
        twinkle: "twinkle 3s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
