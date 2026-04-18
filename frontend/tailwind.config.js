/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cyber: {
          bg: '#050a0f',
          surface: '#0c1622',
          border: '#162b42',
          primary: '#00ff41',
          danger: '#ff2a2a',
          warning: '#ffb300',
          text: '#e2f1ff',
          muted: '#819db8',
        }
      },
      fontFamily: {
        mono: ['"Fira Code"', 'Consolas', 'Monaco', 'monospace'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'neon': '0 0 10px rgba(0, 255, 65, 0.4), 0 0 20px rgba(0, 255, 65, 0.2)',
        'neon-danger': '0 0 10px rgba(255, 42, 42, 0.4)',
      }
    },
  },
  plugins: [],
}
