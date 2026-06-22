# ZVX Hub

Client-side developer swiss-army knife. 40 browser-based utilities — formatters, validators, encoders, decoders, generators, and converters. All processing stays in your browser; no data leaves your device.

**[zvx.is-a.dev](https://zvx.is-a.dev)** — Deployed on Vercel Edge.

## Features

- **40 tools** across formatting (JSON, YAML, SQL, CSS, HTML, JS, Markdown), encoding (Base64, URL, HTML entities, hex/ASCII), security (JWT decoder, certificate tools, K8s secret decoder), generation (UUID, hash, lorem ipsum, cron parser), and conversion (CSV↔JSON, PHP↔JSON, YAML↔JSON, cURL→code)
- **100% client-side** — no server, no accounts, no telemetry, no data transmission
- **macOS-style workspace** — sidebar with search, smart paste auto-detection (JWT, JSON, timestamps, Base64)
- **Full-page mode** — open any tool at `/tool/[id]` for distraction-free workspace
- **40+MB bundle** — all dependencies bundled at build time, zero runtime fetches

## Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS v4 |
| Icons | Lucide React |
| Fonts | Geist (Sans + Mono) |
| Hosting | Vercel Edge |

## Getting Started

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm run lint     # ESLint
```

## Project Structure

```
src/
  app/                  # Next.js App Router pages
    page.tsx            # Home page (navbar, terminal, dev utils)
    layout.tsx          # Root layout with Geist fonts
    privacy/page.tsx    # Privacy policy
    tool/[id]/          # Standalone tool pages (40 routes)
  components/
    DevUtils.tsx        # macOS-style workspace container
    ToolRenderer.tsx    # Routes toolId → component
    Navbar.tsx          # Sticky navigation
    TerminalUI.tsx      # CLI emulator
    utils/              # 10 core tools (customized)
    k8s/                # K8s secret decoder + shared utils
    30+ standalone      # Tools from community patterns
  types/                # Type declarations for CSS/HTML minifiers
  utils/                # Shared utilities (debounce, CSS processor)
```

## Tool Index

| Tool | Route |
|---|---|
| Markdown Preview | `/tool/markdown` |
| HTML Preview | `/tool/html` |
| JSON Formatter | `/tool/json` |
| JWT Decoder | `/tool/jwt` |
| Timestamp Converter | `/tool/timestamp` |
| UUID Generator | `/tool/uuid` |
| Base64 / URL | `/tool/base64` |
| Hash Generator | `/tool/hash` |
| Diff Checker | `/tool/diff` |
| Number Base Converter | `/tool/number-base` |
| Cron Job Parser | `/tool/cron-parser` |
| YAML ↔ JSON | `/tool/yaml-json` |
| YAML Formatter | `/tool/yaml-formatter` |
| SQL Formatter | `/tool/sql-formatter` |
| CSS Minify/Beautify | `/tool/css-minify-beautify` |
| JS Minify/Beautify | `/tool/js-minify-beautify` |
| HTML Minify/Beautify | `/tool/html-minify-beautify` |
| cURL to Code | `/tool/curl-code` |
| Certificate Decoder | `/tool/cert-decoder` |
| Certificate Generator | `/tool/cert-generator` |
| K8s Secret Decoder | `/tool/k8s-secret-decoder` |
| And 20 more… | Browse the sidebar |

## Security

All tools run sandboxed in the browser. No data is sent to any server. The privacy policy at `/privacy` provides full disclosure.

## Author

**Zulvikar Kharisma Nur Muhammad** — [zulvikar.is-a.dev](https://zulvikar.is-a.dev) — [@DycandX](https://github.com/DycandX)

## License

MIT
