# Strata Cost Consulting

Marketing website for Strata Cost Consulting (SCC), plus the master brand
assets and business plan.

- `site/` - Next.js 16 application (App Router, React 19, TypeScript,
  Tailwind CSS v4, Sanity CMS, GSAP + Lenis motion)
- `Screen use/`, `CMYK/`, `Pantone/` - master logo artwork (#002924, PMS 5467C)
- `Stratacc Business Plan.pptx` - source business plan

## Development

```powershell
cd site
npm install
npm run dev        # http://localhost:3000
```

Environment lives in `site/.env.local` (see `site/.env.example`). The Sanity
project (`yc474fiz`, dataset `production`) is already provisioned with read
and write tokens.

## Content

All copy is managed in Sanity Studio at `/studio` (log in with the Google
account used to create the project). Documents: site settings (singleton),
pages, services, sectors, projects, people, articles.

- `npm run seed` resets the dataset to the business-plan-derived seed state
  (idempotent; deterministic ids)
- `npm run typegen` regenerates `src/sanity/types.ts` after schema or query
  changes

## Scripts

| Command | Purpose |
|---|---|
| `npm run dev` | Dev server |
| `npm run build` | Production build (all routes prerender) |
| `npm run lint` | ESLint |
| `npm run seed` | Seed/reset Sanity content |
| `npm run typegen` | Extract schema + generate GROQ types |

## Outstanding user steps before launch

1. **Resend**: create an API key, set `RESEND_API_KEY` and a real
   `CONTACT_TO_EMAIL` in `.env.local` (the form logs and succeeds without
   them); verify the sending domain to replace `onboarding@resend.dev`.
2. **Vercel**: create the project, set the env vars from `.env.local`,
   enable Web Analytics, add the production domain and set
   `NEXT_PUBLIC_SITE_URL` accordingly; add the production URL to Sanity CORS
   (`npx sanity cors add https://<domain> --credentials`).
3. **Content**: replace the five placeholder people profiles (bios are
   flagged), add real project photography (placeholders swap out per image,
   no code changes), and confirm the public claims (10 year MAG
   relationship, £32bn loan figures) before launch.
4. **LinkedIn URL**: set the real company page in Site settings.

## Standards enforced

WCAG 2.2 AA (axe-clean on all templates), LCP < 2.5s / CLS < 0.1 budgets,
`prefers-reduced-motion` static fallbacks throughout, UK English, no
em-dashes in copy, cookieless analytics (no consent banner required).
