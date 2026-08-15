import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./context/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: "#D9A441",
        vaultbg: "#0A0A0B",
        surface: "#141416",
        surface2: "#1B1B1E",
        vborder: "#26262A",
      },
    },
  },
  plugins: [],
};

export default config;
