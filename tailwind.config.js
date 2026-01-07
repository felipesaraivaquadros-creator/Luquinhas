/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/react-app/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        luquinhas: {
          blue: {
            light: '#4FC3F7',
            DEFAULT: '#2196F3',
            dark: '#1976D2'
          },
          green: {
            light: '#81C784',
            DEFAULT: '#4CAF50',
            dark: '#388E3C'
          },
          yellow: {
            light: '#FFD54F',
            DEFAULT: '#FFC107',
            dark: '#FFA000'
          },
          pink: {
            light: '#F48FB1',
            DEFAULT: '#EC407A',
            dark: '#C2185B'
          }
        }
      },
      fontFamily: {
        'fredoka': ['Fredoka', 'sans-serif']
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem'
      }
    },
  },
  plugins: [],
};
