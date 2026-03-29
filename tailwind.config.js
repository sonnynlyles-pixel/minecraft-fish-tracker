/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        minecraft: ['"Press Start 2P"', 'monospace'],
        ui: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        mc: {
          green: '#4ade80',
          darkgreen: '#14532d',
          blue: '#38bdf8',
          bg: '#0d1117',
          card: '#161b22',
          border: '#30363d',
          surface: '#21262d',
          text: '#e6edf3',
          muted: '#8b949e',
          gold: '#fbbf24',
        },
      },
      boxShadow: {
        mc: '0 0 0 2px #4ade80, 4px 4px 0 0 #14532d',
        'mc-blue': '0 0 0 2px #38bdf8, 4px 4px 0 0 #0369a1',
        'mc-gold': '0 0 0 2px #fbbf24, 4px 4px 0 0 #92400e',
      },
    },
  },
  plugins: [],
}
