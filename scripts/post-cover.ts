// 블로그 커버 후보를 받아 저장하고 글에 적용하는 도구. 사용 흐름은 .claude/skills/post-cover/SKILL.md 참고.
//
//   npx tsx scripts/post-cover.ts receive <slug> [--name chatgpt.png] [--port 47321]
//   npx tsx scripts/post-cover.ts collect <slug> --since <epoch-ms> [--name gemini.png]
//   npx tsx scripts/post-cover.ts apply <slug> <png> [--force]

import { execFileSync } from "node:child_process";
import fs from "node:fs";
import http from "node:http";
import os from "node:os";
import path from "node:path";
import sharp from "sharp";

const POSTS_DIR = "src/content/posts";
const COVERS_DIR = "src/assets/images/posts";
const CANDIDATES_DIR = ".cache/post-cover";
const DEFAULT_PORT = 47321;
const GEMINI_DOWNLOAD = /^Gemini_Generated_Image_.*\.png$/;
const COVER_WIDTH = 1600;
const COVER_HEIGHT = 900;
const WEBP_QUALITY = "85";

// chatgpt.com의 CSP는 localhost로의 fetch를 막는다. 대신 이 페이지를 팝업으로 열고
// opener가 postMessage로 넘긴 Blob을 같은 출처로 POST해 저장한다.
const RECEIVER_PAGE = `<!doctype html><meta charset="utf-8"><title>post-cover receiver</title><p id="s">ready</p><script>
window.addEventListener("message", async (e) => {
	const { blob } = e.data || {};
	if (!(blob instanceof Blob)) return;
	const r = await fetch("/save", { method: "POST", body: blob });
	const saved = await r.json();
	document.getElementById("s").textContent = JSON.stringify(saved);
	e.source && e.source.postMessage({ saved }, e.origin);
});
if (window.opener) window.opener.postMessage({ receiverReady: true }, "*");
</script>`;

function fail(message: string): never {
	console.error(`post-cover: ${message}`);
	process.exit(1);
}

function findPost(slug: string): string {
	for (const ext of [".md", ".mdx"]) {
		const file = path.join(POSTS_DIR, `${slug}${ext}`);
		if (fs.existsSync(file)) return file;
	}
	return fail(`${POSTS_DIR}/${slug}.md(x)를 찾을 수 없습니다.`);
}

function parseFlag(args: string[], name: string): string | undefined {
	const index = args.indexOf(name);
	return index === -1 ? undefined : args[index + 1];
}

function candidatesDir(slug: string): string {
	const dir = path.join(CANDIDATES_DIR, slug);
	fs.mkdirSync(dir, { recursive: true });
	return dir;
}

// 팝업 페이지로 이미지 한 장을 받아 저장한 뒤 종료한다.
function receive(args: string[]): void {
	const [slug] = args;
	if (!slug) fail("사용법: receive <slug> [--name chatgpt.png] [--port 47321]");
	findPost(slug);
	const file = path.join(
		candidatesDir(slug),
		path.basename(parseFlag(args, "--name") ?? "chatgpt.png"),
	);
	const port = Number(parseFlag(args, "--port") ?? DEFAULT_PORT);

	const server = http.createServer((req, res) => {
		if (req.method === "GET") {
			res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
			res.end(RECEIVER_PAGE);
			return;
		}
		const chunks: Buffer[] = [];
		req.on("data", (chunk: Buffer) => chunks.push(chunk));
		req.on("end", () => {
			const data = Buffer.concat(chunks);
			fs.writeFileSync(file, data);
			res.writeHead(200, { "Content-Type": "application/json" });
			res.end(JSON.stringify({ file, bytes: data.length }));
			console.log(path.resolve(file));
			server.close();
		});
	});
	server.listen(port, "127.0.0.1", () => {
		console.error(`post-cover: http://127.0.0.1:${port}/ 에서 기다립니다.`);
	});
}

// Gemini의 원본 크기 다운로드는 ~/Downloads로 저장된다. since 이후에 생긴 가장 최근 파일을 옮긴다.
function collect(args: string[]): void {
	const [slug] = args;
	const since = Number(parseFlag(args, "--since"));
	if (!slug || !since) {
		fail("사용법: collect <slug> --since <epoch-ms> [--name gemini.png]");
	}
	findPost(slug);
	const downloads = path.join(os.homedir(), "Downloads");
	const latest = fs
		.readdirSync(downloads)
		.filter((name) => GEMINI_DOWNLOAD.test(name))
		.map((name) => path.join(downloads, name))
		.filter((file) => fs.statSync(file).mtimeMs >= since)
		.sort((a, b) => fs.statSync(b).mtimeMs - fs.statSync(a).mtimeMs)[0];
	if (!latest) fail(`${downloads}에서 새 Gemini 이미지를 찾지 못했습니다.`);

	const target = path.join(
		candidatesDir(slug),
		path.basename(parseFlag(args, "--name") ?? "gemini.png"),
	);
	fs.renameSync(latest, target);
	console.log(path.resolve(target));
}

async function apply(args: string[]): Promise<void> {
	const [slug, png] = args;
	if (!slug || !png) fail("사용법: apply <slug> <png> [--force]");
	const postFile = findPost(slug);
	if (!fs.existsSync(png)) fail(`이미지가 없습니다: ${png}`);

	const source = fs.readFileSync(postFile, "utf8");
	const frontmatter = /^---\n([\s\S]*?)\n---\n/.exec(source);
	if (!frontmatter) fail(`${postFile}에서 프런트매터를 찾지 못했습니다.`);
	const imageLine = `image: ../../assets/images/posts/${slug}-cover.webp`;
	const hasImage = /^image:/m.test(frontmatter[1]);
	if (hasImage && !args.includes("--force")) {
		fail(`${postFile}에 이미 image가 있습니다. 교체하려면 --force를 붙이세요.`);
	}

	// 16:9가 아니면 중앙을 16:9로 잘라낸 뒤 축소한다. 비율이 다른 채 늘리지 않는다.
	const { width, height } = await sharp(png).metadata();
	if (!width || !height) fail(`이미지 크기를 읽지 못했습니다: ${png}`);
	const cropWidth = Math.min(
		width,
		Math.round((height * COVER_WIDTH) / COVER_HEIGHT),
	);
	const cropHeight = Math.min(
		height,
		Math.round((width * COVER_HEIGHT) / COVER_WIDTH),
	);
	const cropArgs =
		cropWidth === width && cropHeight === height
			? []
			: [
					"-crop",
					String(Math.floor((width - cropWidth) / 2)),
					String(Math.floor((height - cropHeight) / 2)),
					String(cropWidth),
					String(cropHeight),
				];

	const cover = path.join(COVERS_DIR, `${slug}-cover.webp`);
	execFileSync(
		"cwebp",
		[
			"-quiet",
			"-q",
			WEBP_QUALITY,
			...cropArgs,
			"-resize",
			String(COVER_WIDTH),
			String(COVER_HEIGHT),
			png,
			"-o",
			cover,
		],
		{ stdio: "inherit" },
	);
	console.error(
		`post-cover: ${width}×${height} → ${cover} (${Math.round(fs.statSync(cover).size / 1024)}KB)`,
	);

	// image 줄은 published 바로 뒤에 둔다. 기존 글들의 배치와 같다.
	const body = hasImage
		? frontmatter[1].replace(/^image:.*$/m, imageLine)
		: frontmatter[1].replace(/^(published:.*)$/m, `$1\n${imageLine}`);
	if (!body.includes(imageLine)) {
		fail(`${postFile} 프런트매터에 published가 없어 image를 넣지 못했습니다.`);
	}
	fs.writeFileSync(
		postFile,
		source.replace(frontmatter[0], `---\n${body}\n---\n`),
	);
	console.error(`post-cover: ${postFile}에 ${imageLine}을 넣었습니다.`);

	execFileSync("pnpm", ["lqips"], { stdio: "inherit" });
}

const [command, ...rest] = process.argv.slice(2);
if (command === "receive") {
	receive(rest);
} else if (command === "collect") {
	collect(rest);
} else if (command === "apply") {
	await apply(rest);
} else {
	fail(
		"사용법: receive <slug> | collect <slug> --since <ms> | apply <slug> <png>",
	);
}
