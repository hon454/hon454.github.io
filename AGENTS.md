# Repository Guidelines

## Project Structure & Module Organization

Firefly is an Astro 7 site with Svelte islands and TypeScript configuration. Main source code lives in `src/`: routes in `src/pages`, layouts in `src/layouts`, reusable UI in `src/components`, styles in `src/styles`, content in `src/content`, helpers in `src/utils`, and Markdown/HTML plugins in `src/plugins`. Site configuration is split across `src/config` with matching type definitions in `src/types`; prefer imports from `@/config` when available. Static files served directly belong in `public`, source-managed images in `src/assets`, docs in `docs` and `Firefly-Docs`, and automation in `scripts`.

## Build, Test, and Development Commands

Use `pnpm`; the `preinstall` script enforces it.

- `pnpm dev` or `pnpm start`: run the local Astro dev server.
- `pnpm check`: run Astro diagnostics.
- `pnpm type-check`: run TypeScript with `--noEmit`.
- `pnpm format`: format `src` with Biome.
- `pnpm lint`: run Biome checks and safe fixes on `src`.
- `pnpm build`: generate icons, LQIPs, the Astro build, font subsets, and Pagefind search output in `dist`.
- `pnpm preview`: preview the production build locally.
- `pnpm new-post`: scaffold a new content post.

## Coding Style & Naming Conventions

Biome is the formatter and linter. It uses tabs for indentation and double quotes for JavaScript/TypeScript strings. Keep Astro and Svelte components in `PascalCase` (`PostCard.astro`, `Search.svelte`), config modules in `camelCase` ending with `Config.ts`, and utilities in descriptive kebab case such as `date-utils.ts`. Keep `src/types` aligned with `src/config`. Avoid unrelated formatting churn.

## Testing Guidelines

There is no dedicated unit-test framework configured. Before submitting changes, run `pnpm check`, `pnpm type-check`, and `pnpm build` for rendering, content, or generated asset work. For visual or interactive changes, verify with `pnpm dev` or `pnpm preview` and include screenshots in the PR. Name future tests near the feature they cover, using the local file name as the stem.

## Git & GitHub Workflow

- Use Conventional Commits for every commit. Follow
  `type(optional-scope): imperative summary`, using focused types such as
  `feat`, `fix`, `docs`, `refactor`, `test`, `build`, `ci`, or
  `chore`.
- This repository uses `main` as its default branch. The
  `CuteLeaf/Firefly` upstream repository uses `master`. Always name the
  branch explicitly when fetching or integrating upstream changes; do not
  assume the branch names match. Treat `origin/main` as the PR base and
  `upstream/master` as the upstream source.
- Work on a focused feature branch and never push changes to `upstream`.
  Keep commits and PRs scoped to one concern.
- Write every PR title in Conventional Commit style, for example
  `feat: add archive filters` or `ci: target the main branch`.
- Use English Markdown section headings in PR descriptions and write the
  explanatory content under them in Korean. Use at least `## Summary`,
  `## Changes`, and `## Validation`; add `## Notes` or
  `## Breaking Changes` when relevant. Keep commands, paths, and identifiers
  in their original code form.
- Record the validation commands and results in the PR body. Include
  screenshots for visual or interactive changes, link related issues when
  available, and report known failures rather than omitting them.
- Discuss major features or design changes in an issue or discussion before
  implementation.

## Security & Configuration Tips

Do not commit secrets, tokens, or service keys in config files. Keep deployment-specific settings in the target platform environment, and review generated files such as `dist`, `src/constants/lqips.json`, and `src/constants/icons.ts` before committing them.
