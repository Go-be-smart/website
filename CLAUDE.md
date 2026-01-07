# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is the **Go be Smart** company website, built with Astro 5.x, React 19, and Tailwind CSS v4. The site showcases their heat pump management dashboard for installers, featuring bilingual support (English and Dutch).

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
- **Framework**: Astro 5.16.6 (SSG with partial hydration)
- **UI Library**: React 19 (for interactive components)
- **Styling**: Tailwind CSS v4 (via Vite plugin)
- **TypeScript**: Strict mode enabled

### Internationalization (i18n)

The site uses Astro's built-in i18n routing with custom translation utilities:

- **Locales**: `en` (default, no prefix) and `nl` (prefix `/nl`)
- **Config**: [astro.config.mjs:10-16](astro.config.mjs#L10-L16) defines routing with `prefixDefaultLocale: false`
- **Translation Files**: [src/i18n/en.json](src/i18n/en.json) and [src/i18n/nl.json](src/i18n/nl.json) contain nested JSON structures
- **Translation Utility**: [src/utils/i18n.ts](src/utils/i18n.ts) provides:
  - `getTranslation(locale)`: Returns a `t(key)` function for nested key lookups (e.g., `t('nav.about')`)
  - `getLocaleFromUrl(url)`: Extracts locale from URL pathname
  - `LANGUAGE_NAMES` and `LOCALES` constants
  - Automatic fallback to English if translation key not found

### Page Structure

The site uses file-based routing with locale-specific pages:

```
src/pages/
├── index.astro           # English homepage (/)
└── nl/
    └── index.astro       # Dutch homepage (/nl)
```

Each page imports [Layout.astro](src/layouts/Layout.astro) (base HTML structure) and [HomePage.astro](src/components/HomePage.astro) (main content component).

### Component Organization

- **[src/layouts/Layout.astro](src/layouts/Layout.astro)**: Base HTML layout with meta tags, favicon, and global styles
- **[src/components/HomePage.astro](src/components/HomePage.astro)**: Main landing page component (accepts `url` prop for locale detection)
- **[src/components/LanguageSwitcher.astro](src/components/LanguageSwitcher.astro)**: Bilingual navigation component
- **[src/components/Welcome.astro](src/components/Welcome.astro)**: Legacy example component (likely unused)

### Styling System

- **Global Styles**: [src/styles/global.css](src/styles/global.css) defines CSS custom properties for the dark theme:
  - Background colors: `--color-bg-primary`, `--color-bg-secondary`, `--color-bg-dark`, `--color-bg-card`
  - Primary colors (cyan): `--color-primary`, `--color-primary-dark`, `--color-primary-light`
  - Secondary colors (blue): `--color-secondary`, `--color-secondary-dark`
  - Text colors: `--color-text-primary`, `--color-text-secondary`, `--color-text-muted`
  - Gradient colors for effects
- Tailwind CSS v4 is imported via `@import "tailwindcss"` and integrated through Vite plugin
- Theme uses a dark blue palette with cyan/blue accents

### TypeScript Configuration

[tsconfig.json](tsconfig.json) extends Astro's strict config and configures React:
- `jsx: "react-jsx"` with `jsxImportSource: "react"`
- Strict type checking enabled

## Adding New Translations

1. Add the key-value pair to both [src/i18n/en.json](src/i18n/en.json) and [src/i18n/nl.json](src/i18n/nl.json)
2. Use nested object structure for organization (e.g., `"nav": { "about": "About" }`)
3. Access via `t('nav.about')` in components

## Adding New Pages

1. Create `src/pages/[pagename].astro` for English
2. Create `src/pages/nl/[pagename].astro` for Dutch
3. Each page should import Layout and pass locale-aware content
4. Use `getLocaleFromUrl(Astro.url)` to determine current locale
5. Use `getTranslation(locale)` to get translation function

## Common Patterns

- **Locale detection**: Always extract locale from `Astro.url` using `getLocaleFromUrl()`
- **Translation usage**: Get `t` function via `getTranslation(locale)`, then call `t('key.path')`
- **Color usage**: Reference CSS custom properties defined in [global.css](src/styles/global.css) rather than hardcoding colors
- **Component hydration**: Use `client:*` directives on React components only when interactivity is needed
