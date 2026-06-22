# ZVX Hub

**Client-side developer swiss-army knife** — 40 browser-based utilities for formatting, validating, encoding, decoding, generating, and converting data. All processing stays in your browser; zero data leaves your device.

<div align="center">

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat&logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat&logo=typescript)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-06B6D4?style=flat&logo=tailwindcss)](https://tailwindcss.com)
[![Vercel](https://img.shields.io/badge/Vercel-Deployed-black?style=flat&logo=vercel)](https://zvx-devutils-hub.vercel.app)

</div>

---

## Table of Contents

- [Stack](#stack)
- [Getting Started](#getting-started)
- [Scripts](#scripts)
- [Architecture](#architecture)
- [Tool Index](#tool-index)
- [Performance](#performance)
- [Deployment](#deployment)
- [Security](#security)
- [Contributing](#contributing)
- [License](#license)

---

## Stack

| Layer       | Choice                        |
| ----------- | ----------------------------- |
| Framework   | Next.js 16 (App Router)       |
| Language    | TypeScript 5 (strict)         |
| Styling     | Tailwind CSS v4               |
| Icons       | Lucide React (tree-shaken)    |
| Fonts       | Geist Sans + Mono (next/font) |
| Animation   | Framer Motion v12             |
| Hosting     | Vercel Edge (static export)   |

**Key dependencies:** `js-yaml`, `papaparse`, `sql-formatter`, `terser`, `prettier`, `diff`, `cronstrue`, `colord`, `uuid`, `ulid`, `dompurify`, `he`, `change-case`

---

## Getting Started

```bash
# Prerequisites: Node.js >= 18, npm >= 9
npm install
npm run dev        # → http://localhost:3000
```

The app is fully client-side. No database, no environment variables, no API keys required.

---

## Scripts

| Command             | Description                         |
| ------------------- | ----------------------------------- |
| `npm run dev`       | Start development server (Turbopack)|
| `npm run build`     | Production build                    |
| `npm run start`     | Start production server             |
| `npm run lint`      | Run ESLint                          |

---

## Architecture

```
src/
  app/                        # Next.js App Router
    layout.tsx                # Root layout (Geist fonts, metadata)
    page.tsx                  # Landing page (lazy-loaded sections)
    globals.css               # Tailwind base + custom utilities
    privacy/page.tsx          # Privacy policy
    tool/[id]/page.tsx        # Standalone tool page with full DevUtils
    tool/[id]/layout.tsx      # Minimal layout + watermark footer

  components/
    DevUtils.tsx              # macOS-style workspace container
    ToolRenderer.tsx          # Lazy-loads tool component by toolId
    Navbar.tsx                # Sticky nav with GPU-accelerated scroll
    TerminalUI.tsx            # CLI emulator with autocomplete
    NeofetchBanner.tsx        # Colored ASCII art system info
    htmlArt.ts               # Colored pixel art generator
    utils/                    # 10 core tools (custom dark theme)
    k8s/                      # K8s secret decoder + shared utilities
    30+ standalone            # Community-pattern tools

  types/                      # Type declarations (csso, html-minifier, etc.)
  utils/                      # Shared hooks & processors
```

### Key Design Decisions

- **`next/dynamic` code splitting** — Each of the 40 tools is a separate chunk loaded only when activated. Initial bundle is ~120KB (gzip), not ~400KB.
- **`key={activeTool}` unmount** — Switching tools fully unmounts the previous component, preventing memory leaks from large state objects (code blocks, file contents).
- **No SSR for tools** — All tool components use `{ ssr: false }` to avoid hydrating heavy DOM trees that immediately get replaced by client state.
- **SVG dot grid** — Background uses an SVG data URI instead of `radial-gradient` CSS to eliminate repaint cost on scroll.
- **backdrop-filter: blur(8px)** — Single blur layer on terminal only. DevUtils container uses opaque background instead of blur.

---

## Tool Index

| Tool                    | Route                          |
| ----------------------- | ------------------------------ |
| Markdown Preview        | `/tool/markdown`               |
| HTML Preview            | `/tool/html`                   |
| JSON Formatter          | `/tool/json`                   |
| JWT Decoder             | `/tool/jwt`                    |
| Timestamp Converter     | `/tool/timestamp`              |
| UUID Generator          | `/tool/uuid`                   |
| Base64 / URL            | `/tool/base64`                 |
| Hash Generator          | `/tool/hash`                   |
| Diff Checker            | `/tool/diff`                   |
| Number Base Converter   | `/tool/number-base`            |
| Cron Job Parser         | `/tool/cron-parser`            |
| YAML ↔ JSON             | `/tool/yaml-json`              |
| YAML Formatter          | `/tool/yaml-formatter`         |
| SQL Formatter           | `/tool/sql-formatter`          |
| CSS Minify/Beautify     | `/tool/css-minify-beautify`    |
| JS Minify/Beautify      | `/tool/js-minify-beautify`     |
| HTML Minify/Beautify    | `/tool/html-minify-beautify`   |
| cURL → Code             | `/tool/curl-code`              |
| Certificate Decoder     | `/tool/cert-decoder`           |
| Certificate Generator   | `/tool/cert-generator`         |
| K8s Secret Decoder      | `/tool/k8s-secret-decoder`     |
| … and 19 more           | Browse the sidebar             |

Each tool page is accessible directly: `https://zvx-devutils-hub.vercel.app/tool/json`

---

## Performance

### Core Web Vitals Strategy

| Metric | Target | Strategy |
| ------ | ------ | -------- |
| **LCP** | < 2.5s | Static prerendering, no server data fetching, preloaded fonts |
| **FID** | < 100ms | All JS split by route; event handlers registered after hydration |
| **CLS** | < 0.1  | Fixed dimensions on terminal (520px) and DevUtils (700px) containers |

### Bundle Breakdown

| Chunk          | Size (gzip) | Loaded              |
| -------------- | ----------- | ------------------- |
| Shell + Navbar | ~35KB       | On page load        |
| Terminal       | ~25KB       | On scroll to section |
| DevUtils       | ~15KB       | On scroll to section |
| Per tool       | ~2-15KB     | On tool activation   |

### CSS Budget

- All animations use `transform` / `opacity` only (GPU-composited)
- Reduced motion respected via `@media (prefers-reduced-motion: reduce)`
- Background uses SVG data URI (single composite layer, zero repaint)

---

## Deployment

The app deploys to Vercel with zero configuration:

```bash
npm run build
vercel --prod
```

No environment variables, no database migrations, no build secrets. The output is purely static HTML + JS + CSS.

---

## Security

All processing is client-side. Tools run in isolated React component trees. No data is transmitted to any server. See the full [Privacy Policy](/privacy) for legal disclosure.

---

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feat/my-tool`)
3. Commit changes (`git commit -m "feat: add my tool"`)
4. Push (`git push origin feat/my-tool`)
5. Open a pull request

**Guidelines:**
- All tools must be fully client-side (no server API calls)
- Use `next/dynamic` with `{ ssr: false }` for new tool components
- Match the existing dark zinc/emerald theme
- Include a "Load Example" button with sample data
- Run `npm run lint` and `npm run build` before submitting

---

## License

MIT © [Zulvikar Kharisma Nur Muhammad](https://zulvikar.is-a.dev)

---

<div align="center">
  <sub>Built with ❤️ by <a href="https://zulvikar.is-a.dev">Zulvikar</a> · <a href="https://github.com/DycandX">@DycandX</a></sub>
</div>
