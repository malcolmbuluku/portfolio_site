/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./index.html",
    "./blog.html",
    "./app.js",
    "./src/**/*.{js,ts,jsx,tsx,html}"
  ],
  theme: {
    extend: {
      typography: (theme) => ({
        dark: {
          css: {
            color: theme("colors.gray.200"),
            a: { color: theme("colors.blue.400") },
            strong: { color: theme("colors.gray.100") },
            code: { color: theme("colors.yellow.300") },
            h1: { color: theme("colors.gray.100") },
            h2: { color: theme("colors.gray.100") },
            h3: { color: theme("colors.gray.100") },
            blockquote: { color: theme("colors.gray.300") }
          }
        }
      })
    }
  },
  plugins: [require("@tailwindcss/typography")]
};
