// Downloads the latest Miniblox bundle from the website.
// Boring and I basically just pressed TAB to the AI completions because I don't care.

import init, { format } from "@fmt/biome-fmt";
import remap from "./remap.ts";

const startDate = new Date();

await init();

export default async function getBundle() {
	const page = await fetch("https://miniblox.io/");
	const text = await page.text();
	// <script type="module" crossorigin="" src="/assets/index-{randomCharacters}.js"></script>
	// example: <script type="module" crossorigin src="/assets/index-CqJGkZPn.js"></script>
	const regex = /\/assets\/index-([a-zA-Z0-9]+).js/gm;
	const match = regex.exec(text);
	if (!match) {
		throw new Error("Couldn't find the latest bundle!");
	}
	const latestBundle = match[1];

	// Download the latest bundle.
	const bundle = await fetch(`https://miniblox.io/assets/index-${latestBundle}.js`);
	const bundleText = await bundle.text();
	console.info("Downloaded bundle! Formatting... (may take a while)");
	console.time("Formatting");
	const formattedText = format(bundleText, "bundle.js");
	console.timeEnd("Formatting");
	return [formattedText, latestBundle];
}

if (import.meta.main) {
	const [bundle, id] = await getBundle();
	await Deno.writeTextFile(`bundle.js`, bundle);
	await Deno.writeTextFile(`bundle-remapped.js`, remap(bundle));
	console.info("Wrote bundle!");
	console.info(`Committing bundle to git...`);
	const sg = (await import("simple-git")).simpleGit();
	sg.add("bundle.js").commit(`chore: update bundle to ${id}`);
	const timePrefix = [
		startDate.getUTCMonth() + 1,
		startDate.getUTCDate(),
		startDate.getUTCFullYear(),
		"_",
		startDate.getUTCHours(),
		startDate.getUTCMinutes()
	].join("-");
	sg.addTag(`${timePrefix}-${id}`);
	console.info("Pushing bundle...");
	sg.push();
}
