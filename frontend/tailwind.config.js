// tailwind.config.js
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: '#3B71CA',
        Secondary: '#9FA6B2',
        Success :'#14A44D',
        danger: '#DC4C64',
        Warning :'#E4A11B'
      },
    },
  },
  plugins: [],
}
