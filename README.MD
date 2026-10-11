# Vision Human Consulting — website

Next.js 16 static export (FR default, EN under `/en/`) for
https://visionhumanconsulting.com. Built from the `../website` template.
See `PLAN.md` for the audit, positioning, IA, design direction and the
client-validation checklist.

## Commands

```bash
pnpm install
pnpm dev     # http://localhost:3000
pnpm build   # static site in ./out
```

## Where things live

| What | Where |
|---|---|
| All page copy, SEO titles/descriptions, JSON-LD organisation | `data/site-content-fr.json` (source of truth) |
| English overlay (arrays replace FR arrays wholesale) | `data/site-content-en.json` |
| Blog posts (JSON frontmatter, FR body, then `<!-- locale:en -->` and the EN body) | `data/blogs/*.md` |
| Blog UI labels | `data/blog-ui.json` |
| Theme tokens, buttons, motion | `app/globals.css` |
| Brand lockup, flowing lines, diamond | `components/brand/vhc-mark.tsx` |
| Reusable sections (ODC, offers, figures, FAQ…) | `components/sections/` |
| Per-page structured data | `lib/page-schema.ts` |
| AI-assistant summaries | `public/llms.txt`, `public/llms-full.txt` (regenerate the full file when content changes) |

## Environment

- `NEXT_PUBLIC_API_KEY_WEB3FORMS` — contact form delivery (without it the form opens the visitor's mail client)
- `NEXT_PUBLIC_G_ANALYTICS` — GA4 id, loaded only after cookie consent

## Deploy

`.github/workflows/nextjs.yml` deploys `./out` to GitHub Pages on push to
`master` (CNAME: visionhumanconsulting.com). Alternatively upload `out/` to
the existing OVH hosting. If hosting moves off OVH, update section 2 of the
legal notice in both content files.
