// Downloads the latest Miniblox bundle from the website.
// Boring and I basically just pressed TAB to the AI completions because I don't care.

export default async function getBundle() {
	const page = await fetch("https://miniblox.io/");
	const text = await page.text();
	console.log(`Page text: ${text}`);
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
	return [bundleText, latestBundle];
}

if (import.meta.main) {
	const [bundle, id] = await getBundle();
	await Deno.writeTextFile(`bundle.js`, bundle);
	console.info("Wrote bundle!");
	console.info(`Committing bundle to git...`);
	const sg = (await import("simple-git")).simpleGit()
	sg.add("bundle.js").commit(`chore: update bundle to ${id}`);
	console.info("Pushing bundle...");
	sg.push();
}
