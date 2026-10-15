/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  theme: {
    extend: {
      colors: {
        darkbg: "#0d1117",
        cardbg: "#161b22",
        borderline: "#30363d",
        cyanbrand: "#06b6d4",
        greenbrand: "#10b981",
      },
    },
  },
  plugins: [],
};
