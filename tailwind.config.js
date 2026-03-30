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
          green: '#55FF55',
          darkgreen: '#2D7A2D',
          blue: '#5555FF',
          lightblue: '#55FFFF',
          bg: '#0a0a0a',
          card: '#1a1a1a',
          cardhover: '#222222',
          border: '#555555',
          borderdark: '#2a2a2a',
          surface: '#2a2a2a',
          text: '#FFFFFF',
          muted: '#AAAAAA',
          gold: '#FFAA00',
          red: '#FF5555',
          panel: 'rgba(0,0,0,0.75)',
        },
      },
      boxShadow: {
        mc: '2px 2px 0 #000',
        'mc-green': '2px 2px 0 #1a4a1a',
        'mc-blue': '2px 2px 0 #00003a',
        'mc-gold': '2px 2px 0 #7a4a00',
      },
    },
  },
  plugins: [],
}
