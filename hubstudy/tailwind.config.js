/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        heading: ['"Space Grotesk"', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        mono: ['"DM Mono"', 'monospace'],
      },
      colors: {
        ink: '#101223',
        midnight: '#1F2337',
        fog: '#F8F9FF',
        cloud: '#E6E8F2',
        primary: '#3D5AFE',
        secondary: '#FF5ED6',
        accent: '#00D791',
        warning: '#FFB347',
        danger: '#FF4D4F',
      },
      boxShadow: {
        glow: '0 20px 40px rgba(61, 90, 254, 0.35)',
        card: '0 25px 60px rgba(16, 18, 35, 0.45)',
      },
      borderRadius: {
        '4xl': '2rem',
      },
      backgroundImage: {
        'hero-grid': 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.08) 1px, transparent 0)',
      },
    },
  },
  plugins: [],
};
