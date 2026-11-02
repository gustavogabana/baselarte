// Production build: a static site in dist/, ready for GitHub Pages.
//   1. Vite bundles the browser code (islands, enhancements) and the stylesheet.
//   2. Vite bundles the renderer for Node.
//   3. The renderer writes every page, sitemap.xml and llms.txt as plain files.
import { existsSync } from "node:fs";
import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { build, type Manifest } from "vite";
import { CLIENT_ENTRIES } from "../vite.config.ts";
import { SONG_PATH } from "../src/easter-egg/chorus.ts";
import type * as Renderer from "../src/server/render.tsx";

const OUT_DIR = "dist";
const RENDERER_DIR = ".ssr";

await build({ logLevel: "warn" });
await build({
  logLevel: "warn",
  build: { ssr: "src/server/render.tsx", outDir: RENDERER_DIR, emptyOutDir: true, copyPublicDir: false, manifest: false },
});

const manifestPath = path.join(OUT_DIR, ".vite", "manifest.json");
const manifest = JSON.parse(await readFile(manifestPath, "utf8")) as Manifest;
const builtFile = (source: string) => {
  const chunk = manifest[source];
  if (!chunk) throw new Error(`${source} is missing from the Vite manifest.`);
  return `/${chunk.file}`;
};
const assets = {
  scripts: [builtFile(CLIENT_ENTRIES.main)],
  styles: [builtFile(CLIENT_ENTRIES.styles)],
  // The player only appears when the song file is there.
  song: existsSync(path.join("public", SONG_PATH)) ? SONG_PATH : undefined,
};

const renderer = (await import(pathToFileURL(path.resolve(RENDERER_DIR, "render.js")).href)) as typeof Renderer;
const files = renderer.renderSite(assets);
for (const { file, contents } of files) {
  const destination = path.join(OUT_DIR, file);
  await mkdir(path.dirname(destination), { recursive: true });
  await writeFile(destination, contents);
}

await rm(RENDERER_DIR, { recursive: true });
await rm(path.dirname(manifestPath), { recursive: true });
console.log(`Built ${files.length} files into ${OUT_DIR}/.`);
