// @ts-check

import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';

// GitHub Pages project sites serve the app under /<repo>; the deploy workflow
// passes SITE_URL and BASE_PATH so this config also works unchanged for user
// sites (<user>.github.io) and custom domains.
const site = process.env.SITE_URL || undefined;
const base = process.env.BASE_PATH || undefined;

// https://astro.build/config
export default defineConfig({
  site,
  base,
  i18n: {
    locales: ['de', 'en'],
    defaultLocale: 'de',
    routing: { prefixDefaultLocale: false },
  },
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [react()],
});