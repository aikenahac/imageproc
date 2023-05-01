/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      spacing: {
        128: '32rem',
        '80w': '80vw',
        '100h': '100vh',
        '100w': '100vw',
      },
    },
  },
  plugins: [require('daisyui')],
};
