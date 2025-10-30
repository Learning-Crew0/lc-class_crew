/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}", // Adjust this path to match your project structure
  ],
  theme: {
    extend: {
      colors: {
        pink: {
          600: "#db2777",
        },
        blue: {
          600: "#2563eb", // Matches text-blue-600 and bg-blue-600
        },
        green: {
          600: "#16a34a", // Matches text-green-600 and bg-green-600
        },
        orange: {
          600: "#ea580c", // Matches text-orange-600 and bg-orange-600
        },
      },
    },
  },
  plugins: [],
};
