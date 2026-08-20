/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: "#3525cd",
        "primary-hover": "#2d1fb3",
        "primary-container": "#4f46e5",
        "primary-fixed": "#e2dfff",
        "primary-fixed-dim": "#c3c0ff",
        "on-primary": "#ffffff",
        "on-primary-container": "#dad7ff",
        "on-primary-fixed": "#0f0069",
        
        secondary: "#575e70",
        "secondary-container": "#d9dff5",
        "secondary-fixed": "#dce2f7",
        "on-secondary": "#ffffff",
        "on-secondary-container": "#5c6274",
        
        background: "#f7f9fb",
        "on-background": "#191c1e",
        
        surface: "#f7f9fb",
        "surface-bright": "#ffffff",
        "surface-container-lowest": "#ffffff",
        "surface-container-low": "#f2f4f6",
        "surface-container": "#eceef0",
        "surface-container-high": "#e6e8ea",
        "surface-container-highest": "#e0e3e5",
        "on-surface": "#191c1e",
        "on-surface-variant": "#464555",
        
        outline: "#777587",
        "outline-variant": "#c7c4d8",
        
        error: "#ba1a1a",
        "error-container": "#ffdad6",
        "on-error": "#ffffff",
        "on-error-container": "#93000a",

        tertiary: "#414855",
        "tertiary-container": "#59606e"
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['"Plus Jakarta Sans"', 'sans-serif']
      },
      borderRadius: {
        'xl': '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem'
      },
      boxShadow: {
        'soft': '0 2px 8px -2px rgba(17, 24, 39, 0.06), 0 1px 4px -1px rgba(17, 24, 39, 0.04)',
        'card': '0 4px 20px -4px rgba(17, 24, 39, 0.08)',
        'elevated': '0 20px 25px -5px rgba(17, 24, 39, 0.1), 0 8px 10px -6px rgba(17, 24, 39, 0.05)'
      }
    },
  },
  plugins: [],
}
