/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // We can define a premium color palette here later
        primary: "#2563EB", 
        secondary: "#1E293B",
        accent: "#38BDF8",
      }
    },
  },
  plugins: [],
}