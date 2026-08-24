import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const nativeFetch = globalThis.fetch;
globalThis.fetch = async (input, init) => {
	const url = input instanceof Request ? input.url : String(input);
	if (!url.startsWith("file:")) return nativeFetch(input, init);

	try {
		return new Response(await readFile(fileURLToPath(url)), { status: 200 });
	} catch (error) {
		if (error?.code === "ENOENT") return new Response(null, { status: 404 });
		throw error;
	}
};

const entryUrl = pathToFileURL(resolve("dist/pagefind/pagefind.js")).href;
const pagefind = await import(entryUrl);

try {
	const filters = await pagefind.filters();
	for (const name of ["category", "tag"]) {
		assert.ok(Object.hasOwn(filters, name), `Missing Pagefind filter: ${name}`);
		assert.ok(
			Object.keys(filters[name]).length > 0,
			`Empty Pagefind filter: ${name}`,
		);
	}
	process.stdout.write(
		`Verified Pagefind filters: ${Object.keys(filters).sort().join(", ")}\n`,
	);
} finally {
	await pagefind.destroy();
	globalThis.fetch = nativeFetch;
}
