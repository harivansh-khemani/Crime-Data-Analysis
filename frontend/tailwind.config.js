/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#0B0F1A',
        surface: '#161B29',
        border: 'rgba(255, 255, 255, 0.1)',
        accent: {
          blue: '#3B82F6',
          purple: '#8B5CF6',
          red: '#EF4444',
          green: '#10B981',
        }
      },
      backdropBlur: {
        glass: '12px',
      },
      backgroundImage: {
        'glass-gradient': 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0) 100%)',
      }
    },
  },
  plugins: [],
}
