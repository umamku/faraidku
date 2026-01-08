/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // PENTING: Ini agar Tailwind membaca file di folder src
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require("tailwindcss-animate"), // Diperlukan untuk efek animasi di kode Anda
  ],
}