import { createHash } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

// Blog presentation derivative; canonical Archify HTML stays unchanged.
const here = path.dirname(fileURLToPath(import.meta.url));
const assets = path.resolve(here, "../../../src/assets/images/posts");
const fonts = path.resolve(here, "../fonts");
const manifest = JSON.parse(fs.readFileSync(path.join(fonts, "pretendard-manifest.json"), "utf8"));
const license = fs.readFileSync(path.join(fonts, manifest.license), "utf8");
const escapeXml = (s) => s.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
const decodeXml = (s) => s.replace(/&#(x[\da-f]+|\d+);/gi, (_, n) => String.fromCodePoint(n[0].toLowerCase() === "x" ? parseInt(n.slice(1), 16) : Number(n))).replaceAll("&lt;", "<").replaceAll("&gt;", ">").replaceAll("&quot;", '"').replaceAll("&apos;", "'").replaceAll("&amp;", "&");
const includes = (range, cp) => range.split(",").some((r) => {
 const [a, b = a] = r.trim().replace(/^U\+/i, "").split("-").map((v) => parseInt(v, 16));
 return cp >= a && cp <= b;
});

for (const name of ["lost-update", "inventory-ready"]) {
 const file = path.join(assets, `replication-rpc-${name}.svg`);
 let svg = fs.readFileSync(file, "utf8");
 const text = [...svg.matchAll(/<text\b[^>]*>([\s\S]*?)<\/text>/g)].map((m) => decodeXml(m[1].replace(/<[^>]+>/g, ""))).join("");
 const codepoints = [...new Set([...text].map((c) => c.codePointAt(0)))];
 const faces = manifest.faces.filter((face) => codepoints.some((cp) => includes(face.unicodeRange, cp)));
 const missing = codepoints.filter((cp) => !faces.some((face) => includes(face.unicodeRange, cp)));
 if (missing.length) throw new Error(`Missing font coverage: ${missing.map((cp) => String.fromCodePoint(cp)).join("")}`);
 const fontCss = faces.map((face) => {
  const data = fs.readFileSync(path.join(fonts, face.file));
  if (createHash("sha256").update(data).digest("hex") !== face.sha256) throw new Error(`Font checksum mismatch: ${face.file}`);
  return `@font-face { font-family: 'Pretendard Diagram'; font-style: normal; font-weight: 45 920; src: url(data:font/woff2;base64,${data.toString("base64")}) format('woff2'); unicode-range: ${face.unicodeRange}; }`;
 }).join("\n");
 // Remove prior post-processing and the export's unused JetBrains font bundle.
 svg = svg.replace(/<style id="blog-diagram-type">[\s\S]*?<\/style>/g, "").replace(/<metadata id="blog-diagram-font-license">[\s\S]*?<\/metadata>/g, "");
 svg = svg.replace(/<style>[\s\S]*?(?=svg \{ font-family:)/, "<style>\n");
 svg = svg.replace(/svg \{ font-family:[^}]+\}/, "svg { font-family: 'Pretendard Diagram', sans-serif; }");
 svg = svg.replace(/(<svg\b[^>]*\blang=)"[^"]*"/, '$1"ko"');
 svg = svg.replace(/<text\b[^>]*>/g, (tag) => {
  const title = tag.includes("data-node-label=");
  const note = /class="t-(dim|muted)"/.test(tag);
  const size = title ? 18 : note ? 12 : 16;
  const weight = title ? 600 : note ? 400 : 500;
  return tag.replace(/font-size="[\d.]+"/, `font-size="${size}"`).replace(/\sfont-weight="[^"]*"/g, "").replace(/>$/, ` font-weight="${weight}">`);
 });
 const typography = `<style id="blog-diagram-type">${fontCss}\nsvg text { font-family: 'Pretendard Diagram', sans-serif; }\nsvg .t-dim, svg .t-muted { fill: var(--text); opacity: 0.75; }</style><metadata id="blog-diagram-font-license">${escapeXml(license)}</metadata>`;
 svg = svg.replace(/<\/svg>\s*$/, `${typography}</svg>`);
 svg = svg.replace(/[ \t]+$/gm, "");
 fs.writeFileSync(file, svg);
 console.log(`${name}: ${faces.length} font subsets, ${codepoints.length} codepoints, ${Buffer.byteLength(svg)} bytes`);
}
