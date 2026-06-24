# AGENTS.md

## Project

This is the AstroWind-based source for the `hon454.github.io` personal blog.

## Commands

- Install: `npm ci`
- Develop: `npm run dev`
- Verify: `npm run check && npm run build`
- Audit: `npm audit --audit-level=low`

## Conventions

- Keep management docs, runbooks, setup notes, and agent instructions in English.
- Blog posts, notes, and reader-facing Korean content may be written in Korean.
- Use conventional commits.
- Do not commit generated or dependency directories such as `node_modules/`, `dist/`, or `.astro/`.

## Maintenance

Before updating AstroWind template dependencies, shared template components, routing, layouts, or `vendor/integration`, read `docs/maintenance/astrowind-upstream.md`.
