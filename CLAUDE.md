# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is the **Go be Smart** company website, built with Astro 5.x and Tailwind CSS v4 (no React — plain Astro components only). The site showcases their heat pump intelligence platform, with bilingual support (English and Dutch) and pages for Home, Product, About, and Contact.

**Positioning (as of July 2026):** two audiences — (1) heat pump manufacturers, offered intelligence features over API (automated commissioning, agentic installation/diagnosis support for their installers, consumer smart control on prices/capacity tariffs/solar self-use, and product intelligence for their own sales/marketing/R&D teams); (2) large fleet owners and asset managers (housing corporations, building portfolio owners, and especially the technical asset-management companies they hire), offered the Platform or Full service. Copy should NOT target small installation companies directly.

## Development Commands

```bash
# Install dependencies
npm install

# Start development server (localhost:4321)
npm run dev

# Build for production (outputs to ./dist/)
npm run build

# Preview production build locally
npm run preview

# Run Astro CLI commands
npm run astro [command]
```

## Architecture & Key Patterns

### Tech Stack
- **Framework**: Astro 5.16.6 (pure SSG, zero client frameworks)
- **Styling**: Tailwind CSS v4 (via Vite plugin) with semantic tokens defined in a `@theme inline` block
- **TypeScript**: Strict mode enabled

### Design System

[src/styles/global.css](src/styles/global.css) is the single source of truth:

- **Brand anchors** (shared with the gbs-dashboard webapp): `--brand-navy: #062a44`, `--brand-coral: #f15c5b`, `--brand-sky: #3e8fcb`
- **Warm light theme**: cream shell (`--background`, oklch hue ~55), navy text/buttons (`--primary`), coral accents (`--highlight`), sky secondary. The webapp uses the cool (hue 240) mirror of this ladder.
- Tokens are promoted to Tailwind utilities via `@theme inline` — write `bg-background`, `text-foreground`, `text-muted-foreground`, `bg-card`, `border-border`, `text-highlight`, `bg-brand-navy`, etc. Never use `[var(--...)]` arbitrary values or hardcoded colors.
- **Font**: Manrope variable, self-hosted at `public/fonts/` (GDPR + the Netlify CSP is `'self'`-only — never add CDN assets). Preloaded in Layout.
- **Utilities**: `.glass-header` (translucent warm glass for the sticky header), `.bg-grid` + `.hero-gradient` (hero/CTA panel atmosphere), `.ambient-blob--{coral,sky,warm}` + `.blob-clip` (decorative motion), `[data-reveal]` (scroll-fade system, observed by IntersectionObserver in Layout).
- `prefers-reduced-motion` disables reveal + blob animation — keep it that way.

**Design rules (user-mandated):** no uppercase mono section labels with dots, no icons/arrows inside buttons, no "Go to platform" link on the marketing site. Headings + whitespace carry section structure.

### Internationalization (i18n)

- **Locales**: `en` (default, no prefix) and `nl` (prefix `/nl`); configured in [astro.config.mjs](astro.config.mjs)
- **Translation files**: [src/i18n/en.json](src/i18n/en.json) and [src/i18n/nl.json](src/i18n/nl.json), organized in per-page namespaces: `common` (nav/cta/closing/footer/contact/form), `home`, `product`, `about`, `notFound` — each page namespace has `meta.title` / `meta.description`
- **Utilities** in [src/utils/i18n.ts](src/utils/i18n.ts):
  - `getTranslation(locale)` → `t(key)` dot-path lookup with English fallback
  - `getListTranslation(locale)` → `tList(key)` for string-array values (e.g. feature bullets)
  - `getLocaleFromUrl(url)`, `localePath(locale, path)` (prefixes `/nl`), `switchLocalePath(pathname, target)` (same page, other locale — used by LanguageSwitcher)
- **Site constants** in [src/utils/site.ts](src/utils/site.ts): `BOOK_DEMO_URL` (mailto now; swap for a scheduling link here), `CONTACT_EMAIL`, LinkedIn URLs, and `NAV_ITEMS` (drives header + footer nav)

### Page Structure

Routes are thin (Layout + page body). Page bodies live in `src/components/pages/`, reusable sections in `src/components/sections/`, primitives in `src/components/ui/`.

```
src/pages/{index,product,about,contact,404}.astro   # English + 404
src/pages/nl/{index,product,about,contact}.astro    # Dutch twins (same body, deeper imports)
src/components/pages/{Home,Product,About,Contact}.astro
src/components/sections/home/{Hero,What,Why,Pricing}.astro
src/components/sections/product/FeatureRow.astro
src/components/sections/shared/ClosingCta.astro
src/components/{Header,Footer,TeamMember,LanguageSwitcher,EmailFormModal}.astro
src/components/ui/{Button,Section,Card}.astro
src/components/icons/LinkedInIcon.astro
```

- **[Layout.astro](src/layouts/Layout.astro)** takes `{ locale, title, description, ogImage? }` per page and renders canonical, hreflang, OG/Twitter tags, JSON-LD, font preload, and the reveal IntersectionObserver.
- **Header** is fixed glass with a mobile hamburger menu; **Footer** (navy) mounts `EmailFormModal` so the hidden Netlify form (`early-access`) ships on every page — don't remove that.
- **Images**: source assets in `src/assets/` (team photos, dashboard screenshot), rendered via `astro:assets` `<Image>` for webp/responsive output. `public/` holds only logos, fonts, favicon, og-image, PDFs.

## Adding New Translations

1. Add the key to both [src/i18n/en.json](src/i18n/en.json) and [src/i18n/nl.json](src/i18n/nl.json) inside the right page namespace
2. Access via `t('home.hero.title')`; arrays via `tList('product.features.ai.bullets')`

## Adding New Pages (e.g. the planned Blog)

1. Create `src/pages/[name].astro` + `src/pages/nl/[name].astro` (copy an existing route pair; NL twin only differs in import depth)
2. Add a page body under `src/components/pages/` composed of `Section`s, with `Header`/`Footer`
3. Add a `[name]` namespace (incl. `meta.*`) to both i18n files
4. Add an entry to `NAV_ITEMS` in [src/utils/site.ts](src/utils/site.ts) — header and footer nav update automatically

## Common Patterns

- **Locale detection**: `getLocaleFromUrl(Astro.url)` in routes; pass `locale` down as a prop
- **Internal links**: always `localePath(locale, '/path')`, never hardcoded `/nl/...`
- **Colors**: semantic Tailwind classes from the token system only
- **Motion**: add `data-reveal="up|left|right|fade"` (+ optional `--reveal-delay` inline style) — the observer in Layout handles the rest
