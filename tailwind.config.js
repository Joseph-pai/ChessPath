/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#0d1117',
        panel: '#141b22',
        line: '#233040',
        sand: '#e9dfc8',
        brass: '#d8b06a',
        mint: '#7fd3b4',
      },
      fontFamily: {
        sans: ['Inter', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 'sans-serif'],
        serif: ['Georgia', 'Songti SC', 'serif'],
      },
    },
  },
  plugins: [],
}
