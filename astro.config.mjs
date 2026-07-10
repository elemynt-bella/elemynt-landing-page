import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'astro/config';
import path from 'node:path';

// Staging is served from a GitHub Pages project path (…/landing-page/), so it
// needs a base prefix. Production (Plesk) is served at the domain root.
// The staging workflow sets DEPLOY_TARGET=staging; production leaves it unset.
const isStaging = process.env.DEPLOY_TARGET === 'staging';

export default defineConfig({
  site: isStaging ? 'https://elemynt.github.io' : 'https://elemynt.ai',
  // Must match the GitHub repo name (Pages serves the project at /<repo>/).
  base: isStaging ? '/elemynt-landing-page/' : '/',
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve('./src'),
      },
    },
  },
});
