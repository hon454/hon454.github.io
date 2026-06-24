# AstroWind Upstream Maintenance

This repository imported AstroWind as a template and does not preserve AstroWind's upstream Git history. Treat upstream updates as a manual comparison task, not as a normal Git merge from a shared ancestor.

## Default Strategy

Use a temporary clone comparison.

```bash
git ls-remote https://github.com/arthelokyo/astrowind.git HEAD

tmpdir=$(mktemp -d)
git clone --depth 1 https://github.com/arthelokyo/astrowind.git "$tmpdir/astrowind"
```

Compare the temporary upstream checkout against this repository, then remove the temporary directory when finished.

```bash
rm -rf "$tmpdir"
```

## Compare First

Start with files and directories that carry framework, build, routing, or shared template behavior:

- `package.json`
- `astro.config.ts`
- `src/content.config.ts`
- `vendor/integration`
- `src/utils`
- `src/components`
- `src/layouts`
- Blog route files under `src/pages/[...blog]`

## Protect Local Customizations

Do not overwrite these local customizations with upstream defaults without reviewing the exact diff and preserving blog-specific behavior:

- `src/config.yaml`
- `src/navigation.ts`
- `src/pages/index.astro`
- `src/pages/about.astro`
- `src/data/post`
- `.github/workflows/deploy.yml`
- Personalized `Logo` behavior
- Personalized `PageLayout` behavior, including the removed default announcement banner

## Update Rules

- Never wholesale overwrite local files from upstream without reviewing diffs.
- Apply only relevant upstream changes.
- Update dependencies through `package.json`, then run `npm install` to refresh `package-lock.json`.
- Keep the repo's GitHub Pages deployment behavior intact.
- Do not adopt an Astro major version upgrade unless AstroWind upstream has adopted it or the user explicitly requests it.
- Keep management docs, runbooks, setup notes, and agent instructions in English.

## Required Verification

Run these checks after applying upstream maintenance changes:

```bash
npm ci
npm run check
npm run build
npm audit --audit-level=low
```

Also run a browser smoke check for:

- `/`
- `/blog`
- At least one post page

Confirm that Korean blog content, site metadata, GitHub Pages deployment, RSS output, and local navigation still reflect this repository rather than upstream AstroWind defaults.
