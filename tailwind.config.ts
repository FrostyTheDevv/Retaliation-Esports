import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#FF4655',
          secondary: '#00D9FF',
          accent: '#FFA500',
          dark: '#0A0E27',
          light: '#FFFFFF',
        },
      },
    },
  },
  plugins: [],
};
export default config;
