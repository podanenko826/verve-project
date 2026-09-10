/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'gradient-sidebar': 'linear-gradient(0deg, rgba(39,149,66,1) 0%, rgba(0,102,175,1) 100%)',
        'gradient-sidebar-dark': 'linear-gradient(0deg, rgba(0,32,8,1) 0%, rgba(0,20,34,1) 100%)',
        'gradient-home-navbar': 'linear-gradient(343deg, rgba(39,149,66,1) 0%, rgba(0,102,175,1) 100%)',
        'gradient-home-content1': 'linear-gradient(343deg, rgba(34,193,195,1) 0%, rgba(253,187,45,1) 100%)',
      },
      boxShadow: {
        'shadow-sidebar': 'rgba(50, 50, 93, 0.25) 0px 30px 60px -12px inset, rgba(0, 0, 0, 0.3) 0px 18px 36px -18px inset',
        'dynamic-search': 'rgba(50, 50, 93, 0.075) 0px 30px 60px -12px inset, rgba(0, 0, 0, 0.1) 0px 18px 36px -18px inset',
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
    },
  },
  plugins: [],
}
