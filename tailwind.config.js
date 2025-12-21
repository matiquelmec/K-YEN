/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // RÚSTICO/ELEGANTE - Colores Centrales 
        ink: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0a0a0a', // Negro Tinta
        },
        bone: {
          50: '#fefefe', // Blanco Hueso
          100: '#fdfdfd',
          200: '#faf9f7',
          300: '#f5f4f2',
          400: '#edeae6',
          500: '#e0ddd7',
          600: '#c9c4bc',
          700: '#a8a096',
          800: '#6f6b61',
          900: '#4a453d',
        },
        terra: {
          50: '#fdf8f3',
          100: '#f9ede0',
          200: '#f1d9c0',
          300: '#e7bf95',
          400: '#d49d68',
          500: '#c68047', // Terracota
          600: '#a0623a',
          700: '#7d4a2f',
          800: '#5c3426',
          900: '#3d1f16',
        },
        // LUNAR/EXPRESIVO - Colores Místicos
        lunar: {
          50: '#f8fafc',
          100: '#f0f4f8',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8', // Plata Lunar
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
        },
        mystic: {
          50: '#faf5ff',
          100: '#f3e8ff',
          200: '#e9d5ff',
          300: '#d8b4fe',
          400: '#c084fc',
          500: '#a855f7', // Púrpura Místico
          600: '#9333ea',
          700: '#7c2d12',
          800: '#581c87',
          900: '#3b0764',
        },
        blood: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626', // Rojo Sangre/Vino
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
        },
        // Verde natural para elementos tierra
        earth: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },
        spring: {
          50: '#fdf2f8',
          100: '#fce7f3',
          200: '#fbcfe8',
          300: '#f9a8d4',
          400: '#f472b6',
          500: '#ec4899', // Pink/Magenta Floral
          600: '#db2777',
          700: '#be185d',
          800: '#9d174d',
          900: '#831843',
        }
      },
      fontFamily: {
        'display': ['Playfair Display', 'serif'],
        'body': ['Inter', 'sans-serif'],
        'cursive': ['Dancing Script', 'cursive'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'earth-pulse': 'earthPulse 4s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        glow: {
          'from': { boxShadow: '0 0 20px rgba(238, 107, 106, 0.5)' },
          'to': { boxShadow: '0 0 30px rgba(238, 107, 106, 0.8)' },
        },
        earthPulse: {
          '0%, 100%': { transform: 'scale(1)', opacity: '0.8' },
          '50%': { transform: 'scale(1.05)', opacity: '1' },
        }
      }
    },
  },
  plugins: [],
}