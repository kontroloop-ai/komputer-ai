# docs-site

Public documentation site for [komputer.ai](https://github.com/komputer-ai/komputer-ai), built with [Astro Starlight](https://starlight.astro.build/) and deployed to GitHub Pages on every push to `main`.

## Local dev

```bash
nvm use 22         # Node 22+ required
npm install
npm run dev        # http://localhost:4321/komputer-ai
```

## Where things live

| Path | Purpose |
|---|---|
| `src/content/docs/` | Markdown/MDX pages — sidebar groups map to subdirs (see `astro.config.mjs`) |
| `src/assets/` | Images, logo |
| `src/styles/custom.css` | Brand palette + small visual tweaks |
| `astro.config.mjs` | Site config: title, sidebar, base path |
| `../.github/workflows/docs-site.yaml` | CI: build + deploy to GitHub Pages |

## Adding a page

1. Drop the `.md` under the right subdir of `src/content/docs/`.
2. Make sure it has frontmatter: `---\ntitle: My Page\n---`.
3. Add it to the sidebar in `astro.config.mjs` (or move to an `autogenerate` group).
