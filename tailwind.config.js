/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#2a313c',
        panel: '#333c48',
        line: '#3e4a5a',
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
