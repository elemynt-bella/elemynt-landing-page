import { defineConfig } from 'astro/config';
import path from 'node:path';
import tailwindcss from '@tailwindcss/vite';

// Staging is served from a GitHub Pages project path (…/landing-page/), so it
// needs a base prefix. Production (Plesk) is served at the domain root.
// The staging workflow sets DEPLOY_TARGET=staging; production leaves it unset.
const isStaging = process.env.DEPLOY_TARGET === 'staging';

export default defineConfig({
  // TODO: replace `your-username` with the GitHub account/org that hosts this
  // repo, and confirm the production domain below.
  site: isStaging ? 'https://your-username.github.io' : 'https://elemynt.ai',
  base: isStaging ? '/landing-page/' : '/',
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve('./src'),
      },
    },
  },
});
