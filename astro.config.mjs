// @ts-check
import { defineConfig } from 'astro/config';

import sitemap from '@astrojs/sitemap';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://www.gobesmart.io',
  i18n: {
    defaultLocale: "en",
    locales: ["en", "nl"],
    routing: {
      prefixDefaultLocale: false
    }
  },
  redirects: {
    '/privacy': '/privacy-policy-en.pdf',
    '/nl/privacy': '/privacy-policy-nl.pdf'
  },
  integrations: [sitemap()],

  vite: {
    plugins: [tailwindcss()],
    server: {
      // Allow tunneling the dev server through any ngrok free domain
      allowedHosts: ['.ngrok-free.dev', '.ngrok-free.app']
    }
  }
});