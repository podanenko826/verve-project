import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'gradient-sidebar':
          'linear-gradient(0deg, rgba(39,149,66,1) 0%, rgba(0,102,175,1) 100%)',
        'gradient-sidebar-dark':
          'linear-gradient(0deg, rgba(0,32,8,1) 0%, rgba(0,20,34,1) 100%)',
        // 'linear-gradient(0deg, rgba(0,29,8,1) 0%, rgba(0,20,34,1) 100%)',
        'gradient-home-navbar':
          'linear-gradient(343deg, rgba(39,149,66,1) 0%, rgba(0,102,175,1) 100%)',
        'gradient-home-content1':
          'linear-gradient(343deg, rgba(34,193,195,1) 0%, rgba(253,187,45,1) 100%)',
      },
    },
  },
  plugins: [],
};
export default config;
