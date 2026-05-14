/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        surface: {
          bg:     '#080D10',
          base:   '#0A1114',
          card:   '#0F1A1F',
          raised: '#131F25',
          border: '#1E2D35',
          hover:  '#182028',
        },
        ink: {
          primary:   '#E8EFF2',
          secondary: '#8FA3AE',
          tertiary:  '#566B76',
          disabled:  '#364F5A',
        },
        accent: {
          emerald: '#16C784',
          emeraldDim: '#0E9060',
        },
      },
      fontSize: {
        '2xs': ['11px', '16px'],
      },
      boxShadow: {
        card: '0 1px 3px rgba(0,0,0,0.4), 0 4px 12px rgba(0,0,0,0.2)',
        panel: '0 2px 8px rgba(0,0,0,0.5)',
        'inner-top': 'inset 0 1px 0 rgba(255,255,255,0.04)',
      },
      transitionDuration: {
        '150': '150ms',
      },
    },
  },
  plugins: [],
};
