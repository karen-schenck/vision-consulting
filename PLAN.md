# Vision Human Consulting — Website rebuild plan

Source site audited on 2026-10-11: https://visionhumanconsulting.com/ (WordPress +
WoodMart, hosted on OVH). Code base: copied from `../website` (Karen Schenck —
psychopraticienne), a production-ready Next.js 16 static-export site with FR/EN
i18n, JSON-driven content, markdown blog, JSON-LD, sitemap, cookie consent and
GitHub Pages deployment.

---

## 1. Audit of the current site

| Page | URL | What it says | Problems |
|---|---|---|---|
| Accueil | `/` | Tagline "Révéler l'invisible. Créer l'impact.", two expertises (Conseil / Formations), ODC teaser, 3 "why us" points | No H1, no hero copy, no value proposition, no CTA above the fold, no proof |
| Conseil | `/conseil/` | Global reading of the company before acting; ODC structures the mission; 3 levels of support | Thin (≈220 words), no examples, no "who is it for" |
| Offres | `/offres/` | Vision = Audit stratégique, Impact = Transformation ciblée (2 weeks), Signature = Alignement exécutif durable | No deliverables, no process, no duration (except Impact), no pricing logic, single page for 3 offers → poor SEO |
| Méthode | `/methodes/` | ODC = Observer, Décoder, Consolider; 3 sourced figures (BCG, Martin Newman, Deloitte, Fujitsu) | The 3 steps are never actually explained |
| Formations | `/formations/` | 3 trainings: Immobilier neuf (1 day, 7h, intra), Agences immobilières (1 day, 7h, inter/intra), Enseignement supérieur (BTS → Master, custom format) | No programme, no objectives, no audience detail, one page for 3 products |
| Contact | `/contact/` | Form (name, email, phone, message), email, phone, LinkedIn | OK, but no booking link, no qualifying fields |
| Mentions légales | `/mentions-legales/` | VEORA REAL ESTATE EURL, Antibes, SIREN 107 361 677, director Karen Schenck, OVH | Fine — kept verbatim |
| EN | `/en/` | **Empty** (WordPress "Nothing Found") | Broken language version indexed by Google |
| Blog | — | Only the WordPress "Bonjour tout le monde" post | No content marketing at all |

Brand assets found: navy + gold (#C5A649) palette, flowing gold line motif, gold
diamond, serif "VHC" monogram, Lato wordmark, 4 photographs.

Facts available (and the only facts used — nothing invented):
- +20 years: commercial strategy, marketing, management, customer experience
- Founder / director: Karen Schenck (VEORA REAL ESTATE EURL, Antibes 06600)
- Phone 06 84 37 60 62 · contact@visionhumanconsulting.com · LinkedIn company page
- Discovery-call Calendly already exists: `calendly.com/karenschenck/echange-decouverte-vhc`

---

## 2. Positioning

**Who:** a boutique consulting & training firm on the Côte d'Azur that links
strategy, organisation and the human factor to commercial performance.

**For whom:** SME leaders and executive teams; real-estate developers
(promoteurs) and their sales teams; real-estate agencies; higher-education
schools (BTS → Master).

**Promise:** *Révéler l'invisible. Créer l'impact.* — find the friction points
nobody sees from inside, and turn them into measurable levers.

**Differentiator:** the ODC method + a transversal reading (strategy ×
organisation × people × customer) instead of treating each symptom separately.

---

## 3. Information architecture

Existing URLs are **kept** so any indexed page keeps its ranking.

```
/                         Accueil
/conseil                  Le conseil (approach, who it is for, symptoms)
/offres                   3 levels of intervention (comparison)
/offres/audit-strategique         Vision
/offres/transformation-ciblee     Impact
/offres/alignement-executif       Signature
/methodes                 La méthode ODC (Observer · Décoder · Consolider) + figures
/formations               Training catalogue
/formations/immobilier-neuf
/formations/agences-immobilieres
/formations/enseignement-superieur
/a-propos                 Karen Schenck & the firm (new)
/blog                     Insights (new) — 4 launch articles
/contact                  Form + Calendly discovery call + coordinates
/mentions-legales, /confidentialite
/en/...                   Full English mirror (fixes the broken /en/)
```

Navigation: Conseil ▾ (Approche, Offres ×3, Méthode) · Formations ▾ (×3) ·
À propos · Blog · [Réserver un échange] CTA.

---

## 4. UI direction — "Navy & Gold editorial"

Deliberately different from the template's soft, rounded, framed therapy look:

| | Template (Karen Schenck) | Vision Human Consulting |
|---|---|---|
| Mood | warm, soft, organic | architectural, confident, premium |
| Ground | beige sand + framed ivory shell | full-bleed ivory/white bands, navy feature bands |
| Colours | ivory, sand, slate, bordeaux | ink navy `#0F1B33`, navy `#1B2A4A`, gold `#C5A649`, ivory `#FAF8F3`, stone `#E9E4DA` |
| Shapes | large radii, petals | near-square corners (2–6px), gold hairlines, diamond accent |
| Display font | Libre Baskerville | Cormorant Garamond (echoes the VHC monogram) |
| Body font | Lato | Lato (matches the existing wordmark) |
| Motif | petal bloom | flowing gold lines (from the logo) drawn in on scroll |

Accessibility: gold is only used on navy (AA for large text) or as decoration;
body text on ivory uses ink navy. `prefers-reduced-motion` respected.

---

## 5. Home page — section by section

1. **Hero (navy, full-bleed)** — eyebrow "Conseil & formation · Antibes ·
   Côte d'Azur"; H1 "Révéler l'invisible. Créer l'impact."; sub-line stating
   who / what / outcome; CTAs *Réserver un échange découverte* (Calendly) +
   *Découvrir la méthode ODC*; trust row (+20 ans · Conseil & Formation ·
   Présentiel ou distanciel); VHC façade photograph; animated gold lines.
2. **Hook — "Les symptômes ne sont pas toujours le problème"** — 4 recognisable
   pain points (sales slowing, teams misaligned, decisions not applied, customer
   experience eroding) → leads to the transversal reading.
3. **Deux expertises** — Conseil / Formations split cards with photos.
4. **Méthode ODC** — 3 numbered steps on a gold connecting line.
5. **Offres** — Vision · Impact · Signature tiers.
6. **Chiffres** — 3 sourced figures on navy band (sources shown).
7. **Pourquoi nous choisir** — the 3 existing pillars.
8. **Secteurs** — Promotion immobilière, Agences, Enseignement supérieur, PME & directions.
9. **Fondatrice** — Karen Schenck teaser → /a-propos.
10. **FAQ** — 6 questions (FAQPage JSON-LD; also feeds LLM answers).
11. **Blog** — latest 3 insights.
12. **Closing CTA** — discovery call + phone + email.

---

## 6. SEO & LLM

- Per-page `<title>`/description written for intent ("audit stratégique
  entreprise", "formation performance commerciale immobilier neuf", etc.).
- JSON-LD: `ProfessionalService` (+ founder, areaServed, sameAs LinkedIn),
  `WebSite`, `WebPage`, `BreadcrumbList`, `Service` per offer, `Course` per
  training, `FAQPage`, `Article` per post.
- hreflang FR/EN + x-default, canonical, sitemap, robots, manifest.
- `public/llms.txt` + `public/llms-full.txt` rewritten for VHC.
- OG image from the brand façade photograph.

---

## 7. Blog — launch editorial line

1. *Ventes qui ralentissent sur un programme neuf : 6 leviers avant de baisser les prix*
2. *Audit stratégique : les écarts invisibles entre la stratégie et le terrain*
3. *Agence immobilière : pourquoi la prospection traditionnelle ne suffit plus*
4. *Le facteur humain, levier de performance mesurable (ce que disent les études)*

---

## 8. To validate with the client before go-live

- [ ] Karen's bio on `/a-propos` (written only from published facts — enrich with real career milestones)
- [ ] Audit duration and Signature duration (only "2 semaines" for Impact is published)
- [ ] Training programmes detail (modules written from the published descriptions — confirm)
- [ ] Qualiopi / OPCO funding status (not mentioned anywhere — **not claimed** on the site)
- [ ] Client references / testimonials (none published — **none invented**; slot ready)
- [ ] Web3Forms key (`NEXT_PUBLIC_API_KEY_WEB3FORMS`) and GA id (`NEXT_PUBLIC_G_ANALYTICS`)
- [ ] English copy review
- [ ] DNS: point visionhumanconsulting.com to GitHub Pages (or keep OVH and upload `out/`)

## 9. Build steps

1. Copy template, strip therapy-specific pages/components/assets ✅
2. Theme tokens, fonts, brand mark
3. FR content JSON (single source of truth) + EN overlay
4. Shared sections (page header, section heading, CTA, FAQ, figures, ODC diagram)
5. Pages + localized routes
6. Blog articles
7. SEO: seo.ts, schema, sitemap, robots, manifest, llms files
8. Contact form (Web3Forms, honeypot) + Calendly
9. `pnpm build` static export, check every route renders
