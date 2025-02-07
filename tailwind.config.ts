import type { Config } from "tailwindcss";
import formsPlugin from "@tailwindcss/forms";
import daisyui from "daisyui";
import { PluginAPI } from "tailwindcss/types/config";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      /* customize */
      fontFamily:{
        pretendard: ['var(--font-pretendard)'],
        RubikPuddles: 'var(--font-rubik-text)',
      },
      keyframes: {
        appear: {
          "0%": {transform: "scale(0)", transformOrigin: "center center"},
          "100%": {transform: "scale(1)", transformOrigin: "center center"}
        }
      },
      animation: {
        appear: "appear 0.3s cubic-bezier(.31,1.76,.72,.76) 1"
      },
    },
  },
  plugins: [
    formsPlugin,
    daisyui,
    function({addUtilities}: PluginAPI){
      addUtilities ({
        '.scrollbar-hidden':{
          'scrollbar-width': 'none',
          '-ms-overflow-style': 'none',
        }
      });
    }
  ],
  daisyui: {
    themes: ["light", "dracula", "business", "retro", "cmyk"],
  }
} satisfies Config;