/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Playfair Display', 'Georgia', 'serif'],
        body: ['Inter', 'ui-sans-serif', 'system-ui']
      },
      boxShadow: {
        luxury: '0 28px 90px rgba(0, 0, 0, 0.32)',
        gold: '0 18px 55px rgba(245, 158, 11, 0.28)',
        soft: '0 18px 50px rgba(15, 23, 42, 0.18)'
      },
      backgroundImage: {
        'luxury-gradient': 'linear-gradient(135deg, #020617 0%, #0f172a 40%, #064e3b 72%, #0f172a 100%)',
        'gold-gradient': 'linear-gradient(135deg, #fde68a 0%, #f59e0b 46%, #fbbf24 100%)'
      },
      animation: {
        float: 'float 7s ease-in-out infinite',
        shimmer: 'shimmer 3s linear infinite'
      },
      keyframes: {
        float: { '0%, 100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-14px)' } },
        shimmer: { '0%': { backgroundPosition: '-200% center' }, '100%': { backgroundPosition: '200% center' } }
      }
    }
  },
  plugins: []
};
