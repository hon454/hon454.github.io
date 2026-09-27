# Replication and RPC ordering diagrams

Archify sequence sources for `src/content/posts/unreal-engine-replication-rpc-ordering.md`.

- `lost-update.json`: a lost update, early OnRep return, and subsequent state recovery without replaying the animation.
- `inventory-ready.json`: reference-first and slot-count-first cases, shown separately from top to bottom.

Generate with Archify 2.17:

```sh
node <archify>/bin/archify.mjs validate sequence <source.json> --quality showcase --json
node <archify>/bin/archify.mjs deliver sequence <source.json> <output.html> --quality showcase --json
node <archify>/bin/archify.mjs visual-check <output.html> --json
```

Use the generated viewer's **Export → SVG** action. The canonical SVG includes detailed notes and supports both system color schemes. Save the exports to `src/assets/images/posts/replication-rpc-lost-update.svg` and `replication-rpc-inventory-ready.svg`.

Keep the assumption that update #3 arrives before update #2 is repaired. The inventory diagram shows local callbacks and UI updates; its arrows are not network RPCs. The two bordered cases are alternatives, not consecutive phases of one execution.

The legend is hidden because each arrow has an explicit action label. This avoids adding unrelated protocol or security interpretations. The Korean content uses Archify's default English viewer UI and HTML language; the blog's static SVGs have Korean alternative text.

For Korean blog typography, run from the repository root after exporting:

```sh
node docs/diagrams/replication-rpc-ordering/prepare-svg.mjs
```

This post-processing step embeds official Pretendard v1.3.9 WOFF2 subsets selected by visible Unicode coverage. It uses labels at 16px/500, participant names at 18px/600, and notes at 12px/400, and raises note contrast in both themes. Font files are unmodified official subsets; their source URLs and SHA-256 hashes are in `../fonts/pretendard-manifest.json`. The SIL OFL license is retained next to the fonts and inside each SVG. No font network requests or locally installed Pretendard copy are required. It preserves all text and diagram geometry. These blog SVGs are presentation derivatives of the canonical Archify exports; the HTML delivery receipts apply to the original HTML, not the post-processed SVGs. Inspect both SVGs in the blog after regenerating them.

Follow the repository-wide [blog diagram guidance](../README.md). If new text needs missing codepoints, fetch the matching official v1.3.9 subsets and update the manifest before rerunning the script; do not silently fall back to a different font.
