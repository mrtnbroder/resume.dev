# resume.dev

A resume builder with a live A4 preview. Fill in personal details, work
experience, education and skills; drag to reorder entries; download the result
as a PDF. Resumes are saved locally in SQLite (via
[LiveStore](https://livestore.dev)) — keep a library of named resumes, switch
between them, no account or backend needed.

## Stack

- [Astro 7](https://astro.build) with the React integration — one interactive
  island, static everywhere else
- [LiveStore](https://docs.livestore.dev) — event-sourced state persisted to
  SQLite in the browser (OPFS), one row per saved resume
- [shadcn/ui](https://ui.shadcn.com) components on **Base UI** primitives
  (`--base base`), **not** Radix
- TypeScript (strict), [Bun](https://bun.sh) as the package manager
- Zero drag-and-drop / PDF dependencies: pointer events + `window.print()`
  with a print stylesheet

## Commands

```sh
bun install        # install dependencies
bun run dev        # dev server at http://localhost:4321
bun run build      # production build to ./dist
bun run preview    # preview the production build
bunx astro check   # typecheck
```

## Languages

German is the default locale at `/`, English lives under `/en/`. UI strings
live side by side in `src/i18n/ui.ts`; each Astro page resolves the locale from
the URL and hands it to the client island as props. Dates are formatted per
locale with `Intl.DateTimeFormat`.

## Deployment

GitHub Pages deploys automatically on every push to `main`
(see `.github/workflows/deploy.yml`). One-time setup after creating the repo:

1. Settings → Pages → Build and deployment → Source: **GitHub Actions**
2. Push to `main`; the site goes live at `https://<owner>.github.io/<repo>/`

The workflow derives `site` and `base` from the repository name, so user sites
(`<owner>.github.io`) and custom domains need no config changes.

## How the PDF export works

`Download PDF` calls `window.print()`. A dedicated print-only copy of the
resume replaces the app UI under `@media print` (A4 page setup), so the
browser's native print-to-PDF produces the file — no client-side PDF library.

## Project structure

```
src/
  components/
    builder/       # form sections, sortable list, scaled sheet, root island
    preview/       # print-faithful resume rendering
    ui/            # shadcn components (Base UI)
  hooks/
    use-resume.ts  # editor state + debounced autosave over the LiveStore store
  livestore/       # LiveStore schema, queries, OPFS adapter + worker wiring
  lib/
    resume.ts      # domain model, factories, formatting helpers
  i18n/
    ui.ts          # locales, dictionaries, translator
  pages/ layouts/ styles/
