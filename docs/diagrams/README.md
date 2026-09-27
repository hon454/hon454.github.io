# Blog Diagrams with Archify

These guidelines apply to Archify SVGs embedded in this blog.

- Create diagrams where they help explain the content. Keep JSON sources, export steps, and post-processing scripts in `docs/diagrams/<topic>/`.
- Use Export → SVG from validated HTML. Preserve content and arrow semantics during post-processing.
- Default to Pretendard for Korean text and embed the required WOFF2 character ranges. Retain the version, source, hashes, and license; check for missing glyphs.
- Validate the final SVG separately from the original HTML in the actual post. Check text size, contrast, clipping, and overlap on desktop and mobile, in both themes and the image viewer. Run the repository's content checks.

Regeneration example: [Replication and RPC ordering diagrams](replication-rpc-ordering/README.md).
