import { defineConfig } from 'vite';

export default defineConfig({
  root: '.',
  publicDir: 'public',
  base: '/TrimurtiJyotishalay/',
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: 'index.html',
        booking: 'booking.html',
        admin: 'admin.html',
        login: 'login.html',
        register: 'register.html',
        dashboard: 'dashboard.html',
        janmaKundali: 'janma-kundali.html',
        janmaLagna: 'janma-lagna-kundali.html',
        vadhuVar: 'vadhu-var-milan.html',
        notFound: '404.html',
      },
    },
  },
});
