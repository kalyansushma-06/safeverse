import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Industrial-safety palette: deep control-room navy + hazard amber,
        // NOT the generic cream/terracotta AI-default palette.
        void: "#0B1220",      // near-black navy background
        steel: "#131C2E",     // panel background
        steelLine: "#22304A", // hairline borders on panels
        signal: "#FF7A1A",    // hazard amber - primary accent, used sparingly
        safe: "#1FA97C",      // compliant / green status
        caution: "#E8B93B",   // caution / amber-yellow status
        danger: "#E5484D",    // critical / red status
        mist: "#AEB9CF",      // secondary text on dark bg
        paper: "#F4F6FA"      // light-mode surfaces (public verification page)
      },
      fontFamily: {
        display: ["'Space Grotesk'", "sans-serif"],
        body: ["'IBM Plex Sans'", "sans-serif"],
        mono: ["'IBM Plex Mono'", "monospace"]
      },
      borderRadius: {
        panel: "10px"
      }
    }
  },
  plugins: []
};

export default config;
