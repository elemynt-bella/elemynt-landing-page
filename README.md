# Elemynt Landing Page

A single-page marketing site for Elemynt, built with **Astro** and **Tailwind CSS v4**.
The hero features an animated multi-orb mesh-gradient background with mouse parallax.

Astro renders the page to static HTML at build time and ships **zero framework JS** — the
only client script is the small parallax loop for the orb background.

## Tech stack

- **Astro 5** — static site generation
- **Tailwind CSS v4** (via `@tailwindcss/vite`) with `tw-animate-css`
- **TypeScript**

## Getting started

**Toolchain:** Node 26 and pnpm 11 (pnpm 11 requires Node ≥ 22.13). The versions are
pinned in `package.json` — Node via the `volta` field and pnpm via `packageManager`. With
[Volta](https://volta.sh) installed, the correct Node is selected automatically on `cd`;
otherwise install Node 26 yourself.

This project uses [pnpm](https://pnpm.io):

```bash
pnpm install
pnpm dev
```

## Scripts

| Command        | Description                          |
| -------------- | ------------------------------------ |
| `pnpm dev`     | Start the Astro dev server           |
| `pnpm build`   | Build the static site into `dist/`   |
| `pnpm preview` | Preview the production build locally |

## Project structure

```
src/
  pages/
    index.astro     # The landing page (nav, hero, feature pills, footer, orb bg + parallax script)
  styles/
    index.css       # Imports fonts, tailwind, and theme
    fonts.css       # Web fonts + keyframe animations
    tailwind.css    # Tailwind entry (@source globs)
    theme.css       # Design tokens (CSS variables)
public/
  favicon.svg       # Violet mark, legible on light & dark tabs (served via base)
  logo.svg          # Nav logo (served from the site root via base)
astro.config.mjs    # Site/base config (per deploy target) + Tailwind Vite plugin
```

## Deployment

Two GitHub Actions pipelines cover staging and production. The Astro `base` switches by
build target (see `astro.config.mjs`): staging is served from a Pages project path, so it
needs a `/elemynt-landing-page/` prefix (matching the repo name); production is served at
the Plesk domain root.

### Staging → GitHub Pages

- **Workflow:** `.github/workflows/staging.yml`
- **Trigger:** automatically on every push to `main` (also runnable manually).
- **URL:** `https://elemynt-bella.github.io/elemynt-landing-page/`
- **One-time setup (already done for this repo):**
  1. Repo must be public, or on a plan that allows Pages for private repos.
  2. Repo **Settings → Pages → Source → GitHub Actions**.

### Production → Plesk (FTP)

- **Workflow:** `.github/workflows/production.yml`
- **Trigger:** **manual only** — Actions tab → *Deploy production (Plesk FTP)* → *Run workflow*.
- **Serves at:** the domain root (`base: '/'`).
- **Required repo secrets** (Settings → Secrets and variables → Actions):
  | Secret            | Description                                  |
  | ----------------- | -------------------------------------------- |
  | `FTP_HOST`        | FTP server hostname                          |
  | `FTP_USERNAME`    | FTP account username                         |
  | `FTP_PASSWORD`    | FTP account password                         |
  | `FTP_REMOTE_DIR`  | Target web root, e.g. `httpdocs/`            |

> **Note:** the page currently sets `robots: noindex, nofollow`. Remove that meta tag in
> `src/pages/index.astro` when you want the production site indexed by search engines.
