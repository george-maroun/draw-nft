import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        // 'image': "url('marwin-colinayo-beauty-of-the-countryside.jpg')",
      },
      fontFamily: {
        inter: ["Inter", "sans-serif"],
        kavoon: ["Kavoon", "serif"],
        fredoka: ["Fredoka", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
