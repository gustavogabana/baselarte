import react from "@vitejs/plugin-react";
import { defineConfig, type Plugin } from "vite";
import type * as Renderer from "./src/server/render.tsx";

/** The browser bundle: one script for behaviour and one stylesheet, linked from every page. */
export const CLIENT_ENTRIES = {
  main: "src/client/main.ts",
  styles: "src/styles/index.css",
};

const CONTENT_TYPES: Record<string, string> = {
  html: "text/html; charset=utf-8",
  xml: "application/xml; charset=utf-8",
  txt: "text/plain; charset=utf-8",
};

/**
 * In development there are no HTML files: each request is rendered on the fly from the same
 * React components the build uses, so `npm run dev` shows exactly what will be published.
 */
function renderPagesOnRequest(): Plugin {
  return {
    name: "baselarte:render-pages-on-request",
    apply: "serve",
    configureServer(server) {
      server.middlewares.use(async (request, response, next) => {
        const path = new URL(request.url ?? "/", "http://localhost").pathname;
        try {
          const renderer = (await server.ssrLoadModule("/src/server/render.tsx")) as typeof Renderer;
          const assets = { scripts: [`/${CLIENT_ENTRIES.main}`], styles: [`/${CLIENT_ENTRIES.styles}`] };
          const file = renderer.findFile(path, assets);
          if (!file) return next();
          const contents = file.file.endsWith(".html") ? await server.transformIndexHtml(path, file.contents) : file.contents;
          const extension = file.file.split(".").at(-1) ?? "";
          response.setHeader("Content-Type", CONTENT_TYPES[extension] ?? "application/octet-stream");
          response.end(contents);
        } catch (renderError) {
          server.ssrFixStacktrace(renderError as Error);
          next(renderError);
        }
      });
    },
  };
}

export default defineConfig({
  // Multi-page: every URL is its own HTML file, like on GitHub Pages (also how `vite preview` serves dist/).
  appType: "mpa",
  plugins: [react(), renderPagesOnRequest()],
  build: {
    manifest: true,
    rolldownOptions: { input: CLIENT_ENTRIES },
  },
});
