# docs-site

Public documentation site for [komputer.ai](https://github.com/komputer-ai/komputer-ai), built with [Fumadocs](https://fumadocs.dev) (Next.js 16 + MDX, Mintlify-style aesthetic) and deployed to GitHub Pages on every push to `main`.

## Local dev

```bash
nvm use 22         # Node 22+ required
npm install
npm run dev        # http://localhost:3000/komputer-ai
```

## Source of truth: `../docs/`

To avoid duplicating markdown, this site **symlinks** the canonical files in the repo's `docs/` directory into `content/docs/`. Edit pages in `docs/` — the site picks them up.

| Path | Purpose |
|---|---|
| `../docs/*.md` | Source-of-truth markdown — also rendered on GitHub |
| `../docs/meta.json` | Sidebar order, separators, group titles (Fumadocs convention) |
| `../docs/index.mdx` | Landing page used by the docs route |
| `content/docs/` | Symlinks into `../docs/` (one per included file) |
| `src/app/(home)/page.tsx` | Marketing landing page (hero, feature cards) |
| `src/app/docs/` | Docs layout + catch-all MDX route |
| `src/app/layout.config.tsx` | Navbar/footer/links shared by all layouts |
| `next.config.mjs` | basePath, MDX, static export config |
| `source.config.ts` | Fumadocs MDX collection config |
| `../.github/workflows/docs-site.yaml` | CI: build + deploy to GitHub Pages |

## Adding a page

1. Add the `.md` (with frontmatter `title:`) to `../docs/`.
2. Add a symlink: `ln -s ../../../docs/my-page.md content/docs/my-page.md`
3. Add the slug to `../docs/meta.json` to position it in the sidebar.

## Deploy

A push to `main` that touches `docs-site/`, `docs/`, or the workflow triggers `.github/workflows/docs-site.yaml`. The workflow runs `npm run build` (Next.js static export to `out/`) and publishes to GitHub Pages at `https://komputer-ai.github.io/komputer-ai/`.

One-time setup: GitHub repo Settings → Pages → Source: **GitHub Actions**.
