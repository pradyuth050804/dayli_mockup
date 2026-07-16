/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        dayli: {
          red: '#E63329',
          'red-dark': '#C82A22',
          'red-light': '#FEE2E2',
          yellow: '#F5A623',
          'yellow-light': '#FEF3C7',
          orange: '#F26B3A',
          'orange-light': '#FFEDD5',
          blue: '#3B82F6',
          'blue-light': '#DBEAFE',
          teal: '#14B8A6',
          'teal-light': '#CCFBF1',
          pink: '#EC4899',
          'pink-light': '#FCE7F3',
          purple: '#7C3AED',
          'purple-light': '#EDE9FE',
          cream: '#FAF7F2',
          'warm-white': '#FEFCF9',
        },
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'system-ui', 'sans-serif'],
        display: ['Inter', 'sans-serif'],
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
    },
  },
  plugins: [],
};
