import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      keyframes: {
        marquee: { "0%": { transform: "translateX(0%)" }, "100%": { transform: "translateX(-50%)" } },
        glow: { "0%,100%": { opacity: "0.25" }, "50%": { opacity: "0.55" } },
        floaty: { "0%,100%": { transform: "translateY(0px)" }, "50%": { transform: "translateY(-6px)" } },
      },
      animation: {
        marquee: "marquee 22s linear infinite",
        glow: "glow 2.8s ease-in-out infinite",
        floaty: "floaty 5.5s ease-in-out infinite",
      },
      boxShadow: { "vv-soft": "0 18px 60px rgba(0,0,0,0.55)" },
    },
  },
  plugins: [],
};
export default config;
