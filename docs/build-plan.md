# Strata Cost Consulting (SCC) Marketing Website: Implementation Plan

## Context

William has commissioned a best-in-class marketing website for Strata Cost Consulting (SCC), a new UK commercial and cost consultancy (quantity surveying practice), based on a completed research report (Opera PM as design north star, Cast for authority architecture, Corefive for case-study patterns). The working directory d:\Strata contains the finished brand assets and the business plan PPTX; no code exists yet.

### Findings from brand assets (these override the research report's assumptions)

- Brand colour is **#002924** (PMS 5467C, deep teal-green), not the report's #071A15 / graduated blues.
- Logo wordmark reads **"Strata Cost Consulting"** (not "Consultants"). SCC remains the abbreviation.
- The logo mark is **three wavy horizontal strata bands** forming a hexagonal silhouette; the signature motion system derives from these wave forms.
- Assets available: dark + white logo SVGs, PNG/JPG variants, square avatar (white mark on #002924), EPS print masters.
- Business plan PPTX confirms: five market clusters (Social Housing, Social Housing Claims, Infrastructure, Contracting, Bank Monitoring), four service lines (Pre-Contract, Post-Contract, Claims, Bank Monitoring), 10-year Manchester Airport Group relationship, £32bn UK development loans + £25bn undrawn, QS-shortage evidence (constructionenquirer.com, 50% of 2025 projects impacted), £11.7bn London Social and Affordable Homes Programme 2026-2036, Labour 1.5m homes pledge, roadmap to 20+ staff / £2m+ revenue in 12-24 months, future fire engineering + PM service lines.

### Decisions confirmed with William

1. **Palette:** graduated teal-greens derived from #002924 (not blues), paper-white ground.
2. **Name:** "Strata Cost Consulting" sitewide.
3. **Typography:** grotesque display headings (Space Grotesk) + humanist sans body; all-caps display, tracked eyebrows, Opera PM register.
4. **CMS:** Sanity wired from the start (embedded Studio, typed GROQ + TypeGen, seed script). External dependency: William authenticates/creates the Sanity project during implementation.

### Stack (locked)

Next.js 16 App Router + React 19 + TypeScript strict; Tailwind CSS v4 (CSS-first @theme); Sanity; GSAP + ScrollTrigger + SplitText + Lenis (single ticker, reduced-motion gated); Resend + React Email + Zod via Server Actions; cookieless analytics; Vercel deploy target. App lives at d:\Strata\site; git repo initialised at d:\Strata (default branch main).

### Standards

WCAG 2.2 AA; LCP < 2.5s, INP < 200ms, CLS < 0.1; UK English; no em-dashes anywhere in site copy; server components by default; no user-scalable=no; no scroll-jacking.

## Plan

### Part A: Design system and motion (verified against current docs)

**Colour tokens (Tailwind v4 `@theme` in `site/src/app/globals.css`, no tailwind.config for tokens).** Twelve-step teal ramp derived from #002924 (which sits untouched at step 900); contrast ratios computed, not estimated:

- `paper #FAFAF7` (ground), `strata-50 #ECF5F1`, `100 #DCEEE6`, `200 #BFDFD2`, `300 #99CBB8`, `400 #66AD96`, `500 #3D8A72`, `600 #1F6B55`, `700 #0E4F3F`, `800 #063A31`, `900 #002924` (anchor), `950 #001A16` (ink).
- Verified AA pairings: ink on paper 17.3:1; 900 headings 15.0:1; 700 secondary 9.1:1; 600 links 6.1:1. On #002924: white 15.6:1, strata-300 eyebrows 8.6:1, strata-400 accent 6.0:1. Rule: `strata-500` (3.96:1) only for large text / focus rings / non-text; `strata-400` decorative only on light.
- Semantic aliases: ink, anchor, accent, accent-ink, mist, line. `--color-*: initial` wipes Tailwind defaults so the site can only use brand colours.
- Fluid type scale via clamp() (`--text-sm` to `--text-display` 3-5rem, line-height 1.05 display / 1.55 body); `--tracking-eyebrow: 0.14em`; spacing tokens incl. fluid `--spacing-section`; radius 0/2px/4px max; minimal teal-tinted shadows; custom eases.

**Typography.** `site/src/lib/fonts.ts`: Space Grotesk (display, variable) + Inter (body, variable) via next/font/google (self-hosted at build, auto fallback metrics = near-zero font CLS), exposed as `--font-space-grotesk`/`--font-inter` consumed in an `@theme inline` block. `lang="en-GB"`. Heading classes: `.h-display`/`.h-1`/`.h-2` all-caps grotesque, `.h-3` sentence case, `.eyebrow` uppercase tracked with strata tick; stat numerals `tabular-nums`.

**Wave geometry.** `site/src/components/waves/paths.ts` is the single geometry source: four layered hero wave paths + divider wave, amplitude/thickness ratios measured from the actual logo SVG (band thickness ~16% of mark width, arch amplitude ~0.155). Hero bands fill strata-800/700/600/500 on the 900 ground (light pages: 200/100/50 on paper).

**Motion system (GSAP 3.13+ all-free, @gsap/react useGSAP, Lenis):**
- `site/src/lib/gsap.ts`: the ONLY plugin registration point (gsap, ScrollTrigger, SplitText, useGSAP); all motion components import from it (code-split boundary; no GSAP in layout/header/footer).
- `SmoothScrollProvider`: `<ReactLenis root options={{ autoRaf: false, anchors: true }}>` driven by `gsap.ticker.add(t => lenis.raf(t*1000))`, `lenis.on('scroll', ScrollTrigger.update)`, `lagSmoothing(0)`. Single rAF loop.
- `StrataHero`: bands settle (`yPercent` stagger, rear first, 1.2s), headline via `SplitText.create({ type:'lines', mask:'lines', autoSplit:true, aria:'auto' })` line-mask reveal, eyebrow/lede/CTA follow; optional slow sine idle drift (desktop only, paused offscreen).
- `SectionReveal`: `data-reveal` children, one once-only ScrollTrigger per section, `y:48 autoAlpha:0` stagger 0.08, transform/opacity only.
- `ParallaxMedia`: scrub parallax, inner media 116% height so edges never show, strength capped 10, hero media only.
- `CredentialsBand`: layered stat reveal + Intl.NumberFormat count-up on a proxy object; final value rendered in SSR HTML, `ch`-reserved tabular-nums box (zero CLS, correct for AT/reduced-motion).
- `WaveDivider` (static SVG) and `WaveMarquee` (pure CSS loop, aria-hidden, reduced-motion gated).
- Reduced-motion pattern (mandatory): all tweens are `from` tweens inside `gsap.matchMedia('(prefers-reduced-motion: no-preference)')`; markup default state IS the final state, so no-JS/SSR/reduced-motion are identical and correct.

**Component inventory** (`site/src/components/`): SiteHeader (transparent-to-solid #002924 at 24px via Lenis callback, persistent CTA), OverlayMenu (full-viewport dialog, focus trap, inert background, lenis.stop()), SiteFooter (inverted wave band top edge, sitemap, accreditations, newsletter with unticked consent), Button/Eyebrow/StatNumeral, ServiceCard, SectorCard (scrim over image for contrast), ProjectCard (tight metadata line: SECTOR · LOCATION · £Xm), PersonCard (teal duotone portraits), ArticleCard, ServiceSectorMatrix (real `<table>`, accordion under 768px), FilterBar (aria-pressed buttons, URL-synced), Quote, CTASection, EnquiryForm (visible labels, unticked marketing consent, honeypot + time-trap, aria-describedby errors), Prose (Portable Text renderer). Dev-only `/styleguide` route rendering every variant/state.

**Imagery (no photography yet).** `StrataPlaceholder`: deterministic seeded inline SVG of brand wave bands with subtle gradients, all aspect tokens (3:2, 4:5, 16:9, 21:9); identical box to future photography so swapping is data-only. Guidance doc for future architectural photography.

**Performance/accessibility baked in:** LCP element is the H1 (text + inline SVG hero, no hero image request); root First Load JS < 130KB; degradation ladder if budgets fail (drop drift, drop parallax, simplify SplitText, CSS-only reveals, remove Lenis); `scroll-padding-top` for the sticky header; focus-visible ring everywhere; target sizes 24px+.

### Part B: Architecture and data layer (versions verified against npm/docs on 08 July 2026)

**Version pins (mutually compatible, verified):** next 16.2.10, react/react-dom 19.2.7, typescript **5.9.3 pinned** (npm latest is now TS 7.0.2 Go-native; Sanity tooling not certified on it), tailwindcss 4.3.2 + @tailwindcss/postcss, sanity 6.4.0 + styled-components 6.4.3 (hard peer of embedded Studio), next-sanity 13.1.1, @sanity/client 7.23.0, @sanity/vision 6.4.0, @sanity/image-url 2.1.1, @portabletext/react 6.2.0, gsap 3.15.0, @gsap/react 2.1.2, lenis 1.3.25, resend 6.17.2, @react-email/components 1.0.12, zod 4.4.3 (Zod 4 API: top-level `z.email()`), @vercel/analytics 2.0.1, tsx (dev). Sanity apiVersion `2026-05-19`. Node 22 LTS.

**Scaffold (PowerShell):**
```powershell
cd D:\Strata; git init; git config core.longpaths true
npx create-next-app@16.2.10 site --ts --eslint --tailwind --app --src-dir --import-alias "@/*" --use-npm --disable-git --yes
```
Root `.gitignore` (node_modules, .next, .env*.local, schema.json, .sanity) and `.gitattributes` (`* text=auto eol=lf`). Turbopack is default (no --turbopack flag; no custom webpack). Copy brand SVGs/avatar into `site/public/brand/`; avatar also becomes `app/icon.png`.

**File tree (merged from both plans):**
```
site/
├─ sanity.config.ts  sanity.cli.ts  (TypeGen config lives in cli config)
├─ scripts/seed.ts   emails/EnquiryEmail.tsx
├─ public/brand/{logo-dark.svg, logo-white.svg, avatar.png}  public/og-default.png
└─ src/
   ├─ app/
   │  ├─ layout.tsx (fonts + metadataBase only)  globals.css  sitemap.ts  robots.ts  icon.png  not-found.tsx
   │  ├─ (site)/layout.tsx   ← SiteHeader, SiteFooter, SkipLink, SmoothScrollProvider, SanityLive, VisualEditing, Analytics
   │  ├─ (site)/{page, about, services, services/[slug], sectors, sectors/[slug], projects, projects/[slug],
   │  │          people, people/[slug], insights, insights/[slug], careers, contact(+actions.ts), privacy}
   │  ├─ studio/[[...tool]]/page.tsx (NextStudio; no Lenis/analytics here)
   │  └─ api/draft-mode/enable/route.ts
   ├─ sanity/{env.ts, types.ts (generated, committed), structure.ts, lib/{client,live,image}.ts, queries/*.ts, schemaTypes/**}
   ├─ components/{layout, sections, motion, waves, media, projects, forms, ui, seo}
   └─ lib/{gsap.ts, motion.ts, fonts.ts, rate-limit.ts, jsonld.ts, routes.ts}
```

**Sanity (wired from the start).** External user step first: `npx sanity@6.4.0 login` then `npx sanity@6.4.0 init --env .env.local` (creates project "Strata Cost Consulting", dataset production, writes NEXT_PUBLIC_SANITY_PROJECT_ID/DATASET), `sanity cors add http://localhost:3000 --credentials`, then create Viewer token (SANITY_API_READ_TOKEN, needed by defineLive) and Editor token (SANITY_API_WRITE_TOKEN, seed script only) at sanity.io/manage.
- Embedded Studio at `/studio` via `NextStudio` (metadata/viewport re-exported from next-sanity/studio); structureTool with siteSettings singleton pinned; presentationTool + `defineEnableDraftMode` route + `<SanityLive/>`/`<VisualEditing/>` in (site) layout for visual editing; visionTool dev-only.
- Data path: `defineLive` from next-sanity/live → `sanityFetch` everywhere (live revalidation, no manual revalidate exports); `generateStaticParams` on all detail routes with slugs-only queries.
- TypeGen: config in sanity.cli.ts (forward-slash globs for Windows); scripts `"typegen": "sanity schema extract && sanity typegen generate"` wired into predev/prebuild; `overloadClientMethods: true` gives typed sanityFetch results; commit types.ts, gitignore schema.json.
- Images: `@sanity/image-url` custom next/image loader (w/q/auto=format/fit=max) + LQIP blur placeholders from GROQ-projected metadata; explicit dimensions everywhere (CLS 0).

**Schemas (7 documents + shared objects).** Objects: seo (metaTitle 60, metaDescription 160, ogImage, noIndex), link (internal ref | external), stat (value/label/source/sourceUrl), quote (text + required attributionName/Role, optional person ref), cta, blockContent (h2/h3/blockquote, figure with required alt, pullQuote, statGroup). Documents:
- `siteSettings` (singleton): title "Strata Cost Consulting", shortName SCC, tagline, contact, primaryNav/footerNav, credentialsStats[] (reusable band), defaultSeo.
- `page` (10 docs: home, about, hub intros, careers, contact, privacy): hero + `sections[]` page-builder array (heroSection, richTextSection, statsBand with useGlobalStats, quoteBand, ctaBand, featureGrid, projectGrid, peopleGrid, serviceMatrix, logoStrip) rendered by SectionRenderer.
- `service` (4): order, strapline, summary, intro, engagementModel, deliverables[], featuredProjects, quote, cta, seo.
- `sector` (5): marketContext blockContent, keyStats[], `serviceOfferings[]` {service ref + summary} — this array IS the Service x Sector matrix, authored sector-side, reverse-queried on service pages.
- `project` (8 seeded): client, location, value, servicesProvided[] (min 1), sectors[] (min 1), summary, body, heroImage, gallery, featured, order; metadata line rendered from discrete fields by ProjectMetaLine.
- `person` (5): role, qualifications, headshot, bio, specialisms, isSenior, order. `article` (4): excerpt, body, author ref, publishedAt, topics, related.

**Seed script** (`npm run seed`, tsx + write token, useCdn false): idempotent via deterministic `_id`s + one `createOrReplace` transaction; re-run resets to seed state; Portable Text helper with deterministic keys. Content derived from the business plan: QS-shortage home proposition, dual-perspective About, four services with commercial models, five sectors with keyStats (1.5m homes, £11.7bn GLA programme, 10-year MAG, £32bn/£25bn dev loans, 50% of 2025 projects impacted), 8 matrix-spanning projects (4 featured), 5 placeholder people (avatar as interim headshot, flagged TODO real bios), 4 articles, named-senior quotes. UK English, no em-dashes.

**Routing/SEO.** Next 16: params/searchParams are Promises (typed `PageProps<'/route'>`); middleware.ts is now proxy.ts (not needed). Metadata API per page from seo fields with fallbacks; canonicals everywhere; filtered /projects canonicalises to /projects; sitemap.ts from a single slugs+_updatedAt query; robots.ts disallows /studio and /api; static og-default.png at launch (dynamic next/og for articles/projects phase 2); JSON-LD via lib/jsonld.ts: Organization (NOT deprecated ProfessionalService), Service (provider ref, areaServed GB), BreadcrumbList, Article, Person; `<` escaped in JSON.stringify.

**Projects filter (zero client JS).** Server component filter chips as `<Link>`s recomputing the query string; GROQ handles null params (`!defined($sector) || $sector in sectors[]->slug.current`); aria-current on active chip, clear-filters link, result count in aria-live region; unfiltered page static, filtered renders dynamic.

**Contact form.** Server Action + Zod 4 (name, email via z.email(), phone/organisation optional, enquiry, honeypot `website: z.literal('')`, startedAt time-trap < 3s reject-as-success); in-memory sliding-window rate limit (5/10min, hashed x-forwarded-for; documented @upstash upgrade path); React Email template; Resend with replyTo enquirer, `onboarding@resend.dev` from-address until domain verified; **graceful when RESEND_API_KEY absent** (log + success in dev); client side uses React 19 `useActionState`, inline aria-described errors, works without JS.

**Analytics: Vercel Web Analytics** (cookieless, zero-config on the deploy target, no consent banner; mounted in (site) layout so /studio is excluded; no-op locally until enabled in the dashboard). Plausible only if vendor-independent export becomes a requirement.

### Conflict resolutions between the two plans

- **Display font: Space Grotesk** (William's confirmed choice; architecture agent's Fraunces suggestion discarded).
- **Design tokens**: Part A's full 12-step verified ramp wins; tokens live in `src/app/globals.css` (create-next-app default location).
- **Lenis/SmoothScrollProvider mounts in `(site)/layout.tsx`**, not the root layout, so /studio scrolls natively; header scroll state via Lenis callback, no GSAP in the shell.
- **Design components map onto section types**: StrataHero ← heroSection, CredentialsBand ← statsBand, CTASection ← ctaBand, Quote ← quoteBand, ServiceSectorMatrix ← serviceMatrix; SectionRenderer dispatches.
- **CONTACT_TO_EMAIL is a placeholder env var** until William confirms the real enquiries address/domain.

### Build order (each step gated by its acceptance criteria)

1. **Repo + scaffold + pins.** AC: dev server serves, `npm run build` and `tsc --noEmit` clean.
2. **Design tokens + fonts + shell** (@theme ramp, fonts.ts, heading classes, Button/Eyebrow, SkipLink, static header/footer, styled 404). AC: token sheet passes axe; fonts from /_next/static/media; visible focus everywhere.
3. **Sanity project (USER STEP: browser login)** + CORS + two tokens. AC: .env.local populated.
4. **Schemas + Studio + structure.** AC: /studio loads with all types, validation fires.
5. **TypeGen + clients + queries.** AC: types.ts generates; typed sanityFetch works.
6. **Seed script.** AC: idempotent, full dataset in Studio, no broken refs.
7. **Wave assets + motion infrastructure** (paths.ts, StrataPlaceholder, lib/gsap.ts, SmoothScrollProvider). AC: single rAF loop; reduced-motion yields zero tweens; anchors land under sticky header.
8. **StrataHero + SectionReveal + ParallaxMedia + CredentialsBand.** AC: no-JS shows composed hero; LCP element is H1; CLS 0 on 6-section test page; triggers self-dispose.
9. **Home page** (SectionRenderer, global stats, matrix, featured projects, Organization JSON-LD). AC: full per-page DoD.
10. **Hubs + detail templates** (services x4, sectors x5 with matrix both directions, project detail + ProjectMetaLine, people, insights + Prose). AC: DoD on all routes; generateStaticParams counts correct in build log.
11. **Projects filtered index.** AC: state survives refresh/share; works with JS disabled.
12. **Contact form + careers + about + privacy.** AC: all form paths verified (errors, honeypot, time-trap, rate limit, missing-key grace).
13. **SEO layer** (sitemap, robots, canonicals, OG, remaining JSON-LD) **+ draft mode/Presentation.** AC: sitemap lists all public routes; JSON-LD passes Rich Results; Presentation live-updates.
14. **Analytics + full audit pass** (Lighthouse mobile-throttled + axe on all ~20 pages; budgets LCP<2.5s INP<200ms CLS<0.1; root First Load JS <130KB; reduced-motion audit per component; degradation ladder applied on any failure). AC: zero console errors, zero critical a11y issues, build green.
15. **Commit history at D:\Strata** (main branch); Vercel deploy + Resend domain verification flagged as follow-up user steps.

Per-page definition of done: renders entirely from Sanity (no hard-coded copy); AA contrast; keyboard navigable; reduced-motion static variant; performance budgets met; metadata + canonical + JSON-LD; UK English, no em-dashes.

### External dependencies (user actions)

1. Step 3: Sanity login/project creation (browser) + two API tokens.
2. Step 12: Resend API key (form degrades gracefully without it) + real enquiries email address.
3. Post-build: Vercel project, Web Analytics toggle, Resend domain verification, production domain.

### Verification

- `npm run build` + `tsc --noEmit` + ESLint clean at every gated step.
- `npm run seed` twice: second run produces zero diff.
- Manual: keyboard-only walkthrough; OS reduced-motion pass; JS-disabled pass (hero composed, filters and form functional); NVDA spot-check on matrix table and form errors.
- Lighthouse (mobile throttled) on home, one service, one sector, projects index, one project, one article, contact: Performance ≥ 90, CLS < 0.1, LCP < 2.5s; INP via manual interaction trace.
- Rich Results test on Organization, Service, Article, Person, BreadcrumbList.
- /studio: loads, all types editable, Presentation preview live-updates, unaffected by Lenis.
- Playwright + Lighthouse CI can be added as a follow-up; not blocking v1.

### Out of scope for this build

Vercel deployment, custom domain/DNS, Resend domain verification, real photography, real people bios, dynamic OG images (phase 2), cacheComponents/'use cache' optimisation (documented upgrade path), Plausible.
