# Elemynt Landing Page

A single-page marketing site for Elemynt, built with React, Vite, and Tailwind CSS v4.
The hero features an animated multi-orb mesh-gradient background with mouse parallax.

## Tech stack

- **React 18** + **TypeScript**
- **Vite 6** for dev server and bundling
- **Tailwind CSS v4** (via `@tailwindcss/vite`) with `tw-animate-css`

## Getting started

Install dependencies (this project uses [pnpm](https://pnpm.io)):

```bash
pnpm install
```

Start the dev server:

```bash
pnpm dev
```

## Scripts

| Command        | Description                                    |
| -------------- | ---------------------------------------------- |
| `pnpm dev`     | Start the Vite dev server                      |
| `pnpm build`   | Type-check (`tsc -b`) and build for production |
| `pnpm preview` | Preview the production build locally           |

## Project structure

```
src/
  main.tsx          # App entry point
  app/App.tsx       # Landing page (nav, hero, feature pills, footer)
  styles/
    index.css       # Imports fonts, tailwind, and theme
    fonts.css       # Web fonts + keyframe animations
    tailwind.css    # Tailwind entry
    theme.css       # Design tokens (CSS variables)
```
