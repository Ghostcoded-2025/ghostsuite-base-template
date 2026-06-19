/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Manrope', 'sans-serif'],
      },
      colors: {
        gc: {
          bg: 'rgb(var(--gc-bg) / <alpha-value>)',
          surface: 'rgb(var(--gc-surface) / <alpha-value>)',
          'surface-hover': 'rgb(var(--gc-surface-hover) / <alpha-value>)',
          border: 'rgb(var(--gc-border) / <alpha-value>)',
          text: 'rgb(var(--gc-text) / <alpha-value>)',
          muted: 'rgb(var(--gc-muted) / <alpha-value>)',
          accent: 'rgb(var(--gc-accent) / <alpha-value>)',
          'accent-muted': 'rgb(var(--gc-accent-muted) / <alpha-value>)',
          danger: 'rgb(var(--gc-danger) / <alpha-value>)',
          'danger-surface': 'rgb(var(--gc-danger) / 0.12)',
          'on-accent': 'rgb(var(--gc-on-accent) / <alpha-value>)',
        },
        brand: {
          primary: '#2dd4bf',
          'primary-dark': '#0d9488',
          dark: '#0a0a0b',
          light: '#fafafa',
        },
        gray: {
          cloud: '#EDEFF7',
          smoke: '#D3D6E0',
          steel: '#BCBFCC',
          space: '#9DA2B3',
          graphite: '#6E7180',
          arsenic: '#40424D',
          phantom: '#1E1E24',
        },
      },
    },
  },
  plugins: [],
}
