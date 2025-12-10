export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: '1rem',
    },
    fontFamily: {
      sans: ['Inter', 'ui-sans-serif', 'system-ui'],
    },
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2563EB',
          700: '#1D4ED8'
        },
        secondary: '#0EA5A4',
        accent: '#F59E0B',
        neutral: '#374151'
      },
      borderRadius: {
        lg: '12px'
      }
    },
  },
  plugins: [],
}
