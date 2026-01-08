/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        // Custom color palette
        primary: {
          DEFAULT: '#19124B', // Deep navy blue
          50: '#F5F4FF',
          100: '#ECEAFF',
          200: '#D9D5FF',
          300: '#B8B0FF',
          400: '#8A7AFF',
          500: '#5C4AFF',
          600: '#3D2FCC',
          700: '#2A2099',
          800: '#19124B', // Main primary
          900: '#0F0A33',
        },
        accent: {
          DEFAULT: '#FEE2E7', // Soft pink
          50: '#FFF9FA',
          100: '#FEF5F7',
          200: '#FEE2E7', // Main accent
          300: '#FDC5D0',
          400: '#FCA8B9',
          500: '#FB8BA2',
          600: '#F96E8B',
          700: '#F75174',
          800: '#E63A63',
          900: '#C62D52',
        },
        // Semantic colors using the palette
        success: '#10B981',
        warning: '#F59E0B',
        error: '#EF4444',
        info: '#3B82F6',
      },
      animation: {
        // Fade animations
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'fade-in-up': 'fadeInUp 0.4s ease-out',
        'fade-in-down': 'fadeInDown 0.4s ease-out',
        'fade-out': 'fadeOut 0.3s ease-in-out',

        // Slide animations
        'slide-in-right': 'slideInRight 0.3s ease-out',
        'slide-in-left': 'slideInLeft 0.3s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',

        // Scale animations
        'scale-in': 'scaleIn 0.2s ease-out',
        'scale-out': 'scaleOut 0.2s ease-in',

        // Bounce and pulse
        'bounce-subtle': 'bounceSubtle 0.6s ease-in-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',

        // Shimmer effect
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInDown: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeOut: {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
        slideInRight: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        slideInLeft: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(100%)' },
          '100%': { transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        scaleOut: {
          '0%': { transform: 'scale(1)', opacity: '1' },
          '100%': { transform: 'scale(0.95)', opacity: '0' },
        },
        bounceSubtle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #19124B 0%, #2A2099 100%)',
        'gradient-accent': 'linear-gradient(135deg, #FEE2E7 0%, #FDC5D0 100%)',
        'gradient-radial': 'radial-gradient(circle, var(--tw-gradient-stops))',
      },
      boxShadow: {
        'primary': '0 4px 14px 0 rgba(25, 18, 75, 0.15)',
        'primary-lg': '0 10px 40px 0 rgba(25, 18, 75, 0.2)',
        'accent': '0 4px 14px 0 rgba(254, 226, 231, 0.4)',
        'glow': '0 0 20px rgba(25, 18, 75, 0.3)',
      },
    },
  },
  plugins: [],
}
