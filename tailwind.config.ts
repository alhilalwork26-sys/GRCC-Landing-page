import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg:      "#F4F3EE",
        dark:    "#0A0A0A",
        muted:   "#666560",
        border:  "#E0DFD8",
        surface: "#EDECE6",
      },
      fontFamily: {
        sans: ["var(--font-jakarta)", "system-ui", "sans-serif"],
      },
      fontSize: {
        "hero": ["clamp(3rem, 7vw, 7rem)", { lineHeight: "1.0", letterSpacing: "-0.03em" }],
        "display": ["clamp(2rem, 4vw, 3.2rem)", { lineHeight: "1.12", letterSpacing: "-0.025em" }],
      },
      keyframes: {
        marquee: {
          from: { transform: "translateX(0)" },
          to:   { transform: "translateX(-50%)" },
        },
      },
      animation: {
        marquee: "marquee 30s linear infinite",
        "marquee-slow": "marquee 40s linear infinite",
      },
    },
  },
  plugins: [],
};
export default config;
