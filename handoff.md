# DeSy Website — Handoff

> Project: **Dependable Systems (DeSy) Research Group** website
> Affiliation: Faculty of Automation and Computer Science, Technical University of Cluj-Napoca
> Public URL (planned): http://desy.utcluj.ro
> Repo state at handoff: branch `main`, working copy contains the full redesign + backend.

This document is the single source of truth for a presentation, a code walkthrough, or onboarding the next developer. It covers what the project is, how it runs, how to demo it, and what's left to do.

---

## 1. Elevator pitch

A bilingual-ready public site for the DeSy research group with two halves:

- **Frontend** — single-page React app (Vite + Bootstrap 5 grid) that presents the group's identity, members, courses taught, publications, projects, and services. Designed in an "editorial-engineering" direction: orange (`#E87A1E`) + navy (`#1B2A4A`) brand, Outfit display + Inter body + IBM Plex Mono micro-type, mono numbered section labels, blueprint-grid hero, animated compass mark, scroll-progress bar, route transitions.
- **Backend** — Node/Express + SQLite (`better-sqlite3`) service that ingests publications from **OpenAlex** automatically (weekly cron), exposes a public read API, and surfaces an admin endpoint for manual sync.

Everything lists itself dynamically from data: the publications histogram is computed from real DB years, the teaching page renders `src/data/teaching.json`, the team page fetches `/api/members`, etc.

---

## 2. Tech stack

### Frontend
| Layer | Choice | Why |
|---|---|---|
| Framework | React 19 | Standard, well-supported |
| Build | Vite 8 | Fast HMR, modern ESM |
| Routing | react-router-dom 7 | SPA navigation, `useLocation` for transitions |
| Styling | Hand-rolled CSS + Bootstrap 5 grid | Bootstrap is used for layout (rows/cols/breakpoints) only; visuals are custom CSS variables and components in `src/index.css` |
| Fonts | Outfit (display), Inter (body), IBM Plex Mono (technical/labels) — loaded from Google Fonts |
| Icons | Inline SVG and emoji where the design calls for casual marks |

### Backend
| Layer | Choice | Why |
|---|---|---|
| Runtime | Node.js (ES modules) | Lightweight |
| HTTP | Express 4 | Minimal, well-known |
| DB | SQLite via `better-sqlite3` | Single-file, zero-ops, synchronous driver fits a read-heavy site |
| Sync | `axios` against OpenAlex | Polite-pool email contact gets priority routing |
| Scheduler | `node-cron` | Default: every Sunday 03:00 (`0 3 * * 0`) |

### Shared
- ESLint (flat config, `eslint.config.js`)
- No TypeScript (JS + JSX)
- No CSS-in-JS, no Tailwind — single global `src/index.css`

---

## 3. Repository layout

```
Dependabale-Systems-Website/
├── index.html                  # Vite entry, Google Fonts preconnect/load
├── package.json                # frontend
├── vite.config.js              # /api proxy → localhost:3001
├── eslint.config.js
├── logo Desy.png               # raw asset, also copied to src/assets/
├── public/
│   ├── favicon.svg             # custom DeSy-brand favicon (navy + 3 bars + orange dot)
│   └── icons.svg               # legacy sprite (currently unused)
├── src/
│   ├── main.jsx                # ReactDOM root + BrowserRouter
│   ├── App.jsx                 # Routes + ScrollProgress + page transitions
│   ├── index.css               # entire design system + every component (~1700 lines)
│   ├── assets/
│   │   └── logo-desy.png       # imported by Navbar/Footer
│   ├── components/
│   │   ├── Navbar.jsx          # fixed top, animated underline nav links
│   │   ├── Footer.jsx          # 4-column footer with last-updated month
│   │   ├── ScrollToTop.jsx     # scrolls to top on route change
│   │   ├── ScrollProgress.jsx  # 2px orange progress line under navbar
│   │   └── HeroMark.jsx        # animated compass SVG, mouse-tracked tilt
│   ├── data/
│   │   ├── team.json           # 26 members, ids + role + category + link
│   │   ├── teaching.json       # 6 professors + their courses (placeholders)
│   │   ├── projects.json       # representative projects with year + link
│   │   └── publications.json   # legacy seed; backend OpenAlex sync is the live source
│   ├── hooks/
│   │   └── useScrollReveal.js  # IntersectionObserver-driven .fade-in toggler
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Team.jsx
│   │   ├── Teaching.jsx        # NEW — courses-by-professor page
│   │   ├── Publications.jsx    # NEW — year-histogram filter
│   │   ├── Projects.jsx
│   │   └── Resources.jsx
│   └── services/
│       └── api.js              # tiny fetch wrappers
└── backend/
    ├── package.json
    ├── .env                    # PORT, ADMIN_TOKEN, CRON_SCHEDULE, DB_PATH, CORS_ORIGINS
    ├── data/
    │   ├── desy.db             # SQLite file (WAL mode)
    │   ├── desy.db-shm
    │   └── desy.db-wal
    ├── scripts/
    │   ├── init-db.js          # creates schema
    │   ├── seed.js             # seeds members + legacy publications from src/data/*.json
    │   ├── resolve-authors.js  # backfills OpenAlex author IDs for each member
    │   └── sync-once.js        # one-shot manual sync
    └── src/
        ├── index.js            # express bootstrap
        ├── config/env.js
        ├── db/
        │   ├── database.js
        │   └── schema.sql      # members, publications, authorships, patents, sync_log, meta
        ├── routes/
        │   ├── members.js      # GET /api/members
        │   ├── publications.js # GET /api/publications?year=&type=&q=&limit=&offset=
        │   ├── patents.js      # GET /api/patents
        │   └── admin.js        # POST /api/admin/sync, GET /api/admin/sync-log  (Bearer auth)
        ├── scheduler/cron.js
        ├── services/
        │   ├── openalex.js
        │   ├── authorResolver.js
        │   ├── publicationSync.js
        │   └── seed.js
        └── utils/
            ├── dedup.js
            └── logger.js
```

---

## 4. Running locally

### One-time setup
```bash
# from repo root
npm install
cd backend && npm install && cd ..
```

### Start dev (two terminals)
```bash
# terminal A — backend (http://localhost:3001)
cd backend && npm run dev

# terminal B — frontend (http://localhost:5173, or next free port)
npm run dev
```

The Vite dev config (`vite.config.js`) proxies `/api/*` → `http://localhost:3001`, so the frontend talks to the backend transparently in dev. In production the same paths are expected to be reverse-proxied to the same host.

### Seed / sync data
```bash
cd backend
npm run db:init          # apply schema.sql to data/desy.db (idempotent)
npm run db:seed          # import members + legacy publications from src/data/*.json
npm run authors:resolve  # match members to OpenAlex author IDs
npm run sync:once        # one-time pull of fresh publications from OpenAlex
```

The automatic cron runs `0 3 * * 0` (Sundays at 03:00 server time) — override via `CRON_SCHEDULE` in `backend/.env`.

### Production build
```bash
npm run build            # outputs to dist/
npm run preview          # local preview of the built bundle
```

---

## 5. Environment variables (`backend/.env`)

```
PORT=3001
NODE_ENV=development
OPENALEX_EMAIL=banumihail03@gmail.com        # polite-pool contact, gives priority routing
ADMIN_TOKEN=<long random secret>             # Bearer token for /api/admin/*
CRON_SCHEDULE=0 3 * * 0                      # node-cron syntax
CORS_ORIGINS=http://localhost:5173           # comma-separated allowed origins
DB_PATH=data/desy.db                         # SQLite file path (relative to backend/)
```

The frontend has no env file by default; if hosted on a different origin than the API, set `VITE_API_BASE_URL` in `.env` at the repo root (defaults to `/api`).

---

## 6. API reference

All responses are JSON.

| Method | Path | Auth | Purpose |
|---|---|---|---|
| GET | `/api/health` | — | counts + last sync status |
| GET | `/api/members` | — | all members, ordered by category then id |
| GET | `/api/publications` | — | list pubs, supports `?year`, `?type`, `?author`, `?q`, `?limit` (max 1000), `?offset` |
| GET | `/api/publications/:id` | — | single pub with full author list |
| GET | `/api/patents` | — | all patents |
| POST | `/api/admin/sync` | Bearer | trigger an OpenAlex sync immediately |
| GET | `/api/admin/sync-log` | Bearer | history of past syncs |

Pass admin auth as `Authorization: Bearer <ADMIN_TOKEN>`.

---

## 7. Database schema (high level)

Defined in `backend/src/db/schema.sql`. Five real tables + a meta KV:

- **`members`** — id, name, role, category (`professor`/`associate`/`lecturer`/`assistant`/`phd`), link, optional `openalex_author_id`, `orcid`.
- **`publications`** — id, openalex_id (unique), doi (unique), title, title_normalized, year, venue, volume, issue, pages, type, link, authors_text (denormalized fallback), citation_count, source, raw_json.
- **`authorships`** — many-to-many between publications and members, with `author_position` and the display name as it appeared in the source.
- **`patents`** — flat list of patents (id, authors, title, reference).
- **`sync_log`** — every run of the OpenAlex sync (started/finished, status, counts, errors_json).
- **`meta`** — small KV table for sync cursors and arbitrary config.

WAL mode is on (`PRAGMA journal_mode = WAL`) for concurrent reads while the cron job writes.

---

## 8. Pages — what each one does

| Route | Page | Source of data | Notable behaviour |
|---|---|---|---|
| `/` | `Home.jsx` | static + `teaching.json` (referenced via /teaching link card) | hero with animated compass, contact card + Cloud-Fog-Edge schematic, 3 research-focus cards, 4-up "Discover our work" quick-links |
| `/team` | `Team.jsx` | `GET /api/members` | filter pills by category, initials avatars colored by category, links to user pages |
| `/teaching` | `Teaching.jsx` | `src/data/teaching.json` | stat strip (professors / courses / levels), 2-up grid of "course cards" with mono `C01`, `C02` codes |
| `/publications` | `Publications.jsx` | `GET /api/publications` (twice — once for histogram corpus, once for filtered display) | year histogram filter (click bar = filter), type pills, fuzzy client-side search |
| `/projects` | `Projects.jsx` | `src/data/projects.json` | vertical list of project cards with year + orange left rule |
| `/resources` | `Resources.jsx` | static | 2×2 grid of service cards (R&D, Consulting, Engineering, Training) |

---

## 9. Design system reference

### Colors (CSS variables in `:root`, `src/index.css`)
- `--desy-orange: #E87A1E` (primary action)
- `--desy-orange-light: #F5A623` (gradients, accents)
- `--desy-orange-dark: #C96510` (hover states)
- `--desy-navy: #1B2A4A` (headings, dark sections)
- `--desy-navy-dark: #0F1A30`, `--desy-navy-light: #2C3E6B`
- Neutrals: `--gray-50` … `--gray-900`
- Side accents: `--accent-teal #14B8A6`, `--accent-blue #3B82F6`, `--accent-green #22C55E`

### Type stack
- `--font-display` / `--font-heading` → **Outfit** (weights 400-800) — headings, hero, big numbers
- `--font-body` → **Inter** (300-700) — body copy
- `--font-mono` → **IBM Plex Mono** (300-600) — labels, breadcrumbs, year codes, stats, filter buttons, anything "technical micro-type"

### Reusable patterns
- `.section-tag` + `data-index="01"` → mono numbered eyebrow with a vertical rule.
- `.desy-card.with-marks` → card with 4 L-shaped corner crosshair marks; gain orange tint on hover.
- `.card-index` → mono slug top-right of a card (e.g. `/01`, `/Team`).
- `.page-header` → navy hero strip with a faint blueprint grid behind, used by all inner pages.
- `.fade-in` / `.fade-in.visible` → IntersectionObserver-driven scroll reveals (`useScrollReveal`).

### Motion
- One-shot hero stagger on first paint: coords → headline → subtitle → CTAs → stats → compass.
- `.scroll-progress` — 2px orange bar at the top, `transform: scaleX(progress)`.
- `.page-transition` — every route change fades + lifts 10px over 0.45s (keyed on `location.pathname`).
- All animations respect `prefers-reduced-motion: reduce`.

### Compass (`HeroMark.jsx`)
- Resting state: 3 dashed rings rotating at different rates, 4 inner nodes counter-rotating, accent nodes pulsing.
- Interactive: cursor moving over the stage tilts the SVG up to ±14° (3D perspective transform via CSS vars). On `mouseLeave`, it eases back to neutral over 0.5s.
- Hover wake-up: rings speed ~3×, white strokes brighten, accent nodes glow harder, a radar wedge starts orbiting the center, compass labels (N/E/S/W) shift from gray to orange.

---

## 10. How to update content

### Add or edit team members
Edit `src/data/team.json`. Each record:
```json
{
  "id": 27,
  "name": "Prof. Eng. New Person, PhD",
  "role": "Professor",
  "category": "professor",   // professor | associate | lecturer | assistant | phd
  "link": "https://users.utcluj.ro/~new-person/"   // or "#"
}
```
Then re-seed the backend:
```bash
cd backend && npm run db:seed
```

### Add or edit teaching content
Edit `src/data/teaching.json` (no backend round-trip — it's a frontend import):
```json
{
  "memberId": 1,
  "name": "Prof. Eng. Liviu MICLEA, PhD",
  "shortName": "Prof. Miclea",
  "courses": ["Fault-Tolerant Systems", "Cyber-Physical Systems"]
}
```

### Add or edit projects
Edit `src/data/projects.json`. Each item has `id`, `years`, `title`, `description`, optional `link`.

### Publications
Don't hand-edit publications. They live in the SQLite DB. To pull fresh data:
```bash
cd backend && npm run sync:once
```
or hit the admin endpoint with the bearer token:
```bash
curl -X POST http://localhost:3001/api/admin/sync \
  -H "Authorization: Bearer $ADMIN_TOKEN"
```

---

## 11. Brand assets

- Primary logo: `logo Desy.png` (root) — also copied to `src/assets/logo-desy.png` so Vite can fingerprint it.
- On dark surfaces (navbar, footer) the logo is rendered via `filter: invert(1) hue-rotate(180deg)`, which preserves the orange bar while turning the dark wordmark white.
- Favicon: `public/favicon.svg` — custom-built to match (navy tile, three bars with one orange, orange dot).

---

## 12. Known limitations / TODO before public launch

- **`teaching.json` placeholders** — every professor still has `TODO — course 1`. Fill in real courses before the presentation.
- **Hero stat counts are hard-coded** (`26+`, `25+`, `10+`, `10+`). They should be derived from `/api/health` so they update with the data. Easy follow-up.
- **No deployment config yet** — no Dockerfile, no CI, no reverse-proxy template. The plan is the site lives at `desy.utcluj.ro` so a Caddy/Nginx config that serves the Vite `dist/` and proxies `/api` to Node will be needed.
- **No analytics / consent banner.** GDPR posture should be confirmed before launch.
- **No 404 page** — react-router falls back to a blank screen on unknown URLs.
- **Mobile menu uses Bootstrap's collapse** — works but feels stock; full-screen overlay would be nicer.
- **No SSR / no SEO tags per route** — single global meta in `index.html`. Acceptable for a research group page, but worth flagging.
- **`backend/.env` contains an admin token in the repo.** Rotate it before going public, and `.gitignore` `.env`.
- **2 pre-existing eslint warnings** in `src/hooks/useScrollReveal.js` (`react-hooks/exhaustive-deps`) — harmless, kept the warnings list short.

---

## 13. Presentation script — talking points (5–7 min)

A suggested order if you walk an audience through the live site:

1. **Why this exists.** The group's identity used to live as a static page on `desy.utcluj.ro`. We rebuilt it as a small full-stack app: the public site is a presentation layer over a real database that the group can keep in sync with OpenAlex automatically — no more manual publication maintenance.
2. **Tech in one sentence.** React + Vite frontend, Express + SQLite backend, OpenAlex sync via weekly cron, custom design system on top of Bootstrap's grid.
3. **Open the home page.** Show the animated compass, move the cursor over it (the 3D tilt + radar sweep is a good "wow" beat). Scroll to demonstrate the orange scroll-progress line under the navbar.
4. **Navigate** between pages — the 0.45s fade+lift transition is the cue that the SPA is working. The navbar links animate an underline from center on hover; the active link sits at full width.
5. **Publications page.** Click a bar in the year histogram — the bar fills orange, the list narrows. Click "All years" to clear. Show that 2025/2026 bars appear automatically because the filter is data-driven, not hardcoded.
6. **Teaching page.** Show the stat strip, then mention this content is editable in `src/data/teaching.json` — no backend involved.
7. **Team page.** Filter pills, category-colored avatars.
8. **Behind the scenes.** Open `backend/src/services/publicationSync.js` (or just `schema.sql`) and explain: members are matched to OpenAlex author IDs, the cron pulls works for each author, de-duplicates by DOI + normalized title, and persists. Mention `sync_log` and the admin endpoint.
9. **Roadmap** (1 sentence). Real teaching data, count-up stats, 404 page, deployment.

---

## 14. Demo video — recipe & shot list

Target length: **60–90 seconds**, no narration required (subtitles or on-screen captions are enough for a presentation reel). Use OBS or any screen recorder at 1080p / 30 fps minimum.

### Pre-recording checklist
- Window at **1440 × 900** (or 1920 × 1080 with browser UI hidden). Hide bookmarks bar, dev tools, notifications.
- Use a fresh Chrome profile so no autocomplete dropdowns appear in the search box.
- Have the backend running with the DB seeded so the histogram and team page show real data.
- Smooth mouse — slow movements film better than fast ones.
- Disable browser zoom; check the compass renders inside the hero viewport on your screen.

### Shot list (with timecodes for a 75s cut)

| # | t (s) | Shot | What to do | Caption / voiceover |
|---|---|---|---|---|
| 1 | 0–4 | Home, top of hero | Load `localhost:5173`, let the staggered hero animation play. | `DeSy — Dependable Systems · UTCN` |
| 2 | 4–10 | Compass interaction | Move the cursor slowly across the compass. Pause once over the right side so the radar sweep loops. | `Animated. Interactive. Cursor-tracked.` |
| 3 | 10–16 | Scroll the home page | Slow scroll-down from hero → contact → schematic → research focus → quick links. | `Editorial-engineering design system` (the orange progress bar at the top is on display the whole time) |
| 4 | 16–20 | Click "Teaching" in navbar | Hover other links first to show the underline animation, then click `Teaching`. | `Animated underline navigation` |
| 5 | 20–28 | Teaching page | Show the stat strip + scroll past one or two course cards. Hover a course row to show the orange `C01` fill-on-hover. | `Content lives in JSON — no backend required` |
| 6 | 28–34 | Click "Publications" | Land on the histogram. Bars animate in. | `Year filter is a real histogram` |
| 7 | 34–46 | Histogram interaction | Click a bar (e.g. 2024). List narrows. Click another bar (e.g. 2026). Click "All years" to clear. | `Click to filter. 2025–2026 appear automatically.` |
| 8 | 46–54 | Search box | Type a query like `cyber` slowly; the list narrows live. | `Fuzzy client-side search` |
| 9 | 54–62 | "Team" page | Click filter pills (`Professors` → `PhD Students`). | `Category filters, hover for profiles` |
| 10 | 62–68 | "Projects" page | Scroll through a few project cards. | `Representative projects, last 10 years` |
| 11 | 68–73 | Footer + last-sync line | Scroll to the footer; pause briefly. | `Auto-synced from OpenAlex weekly` |
| 12 | 73–75 | Wordmark + URL | Cut to the navbar (or a final card with `desy.utcluj.ro`). | logo + `desy.utcluj.ro` |

### Captions / overlay tips
- Use IBM Plex Mono for any overlay text to match the brand.
- Keep captions short (max ~6 words) and stack near the bottom-left or top-right.
- A subtle audio bed helps; nothing dramatic. If unsure, drop a track from YouTube's audio library at -18 LUFS.

### Easy "money shots" to lean on
1. The compass + radar sweep on cursor enter.
2. Bars animating in on the publications page (the staggered `barRise` looks great in slow motion if you want a 2× speed pause).
3. The page transition fade as you click between Home → Publications.
4. The hero scroll-progress bar filling as you scroll, with the rest of the page silently parallaxing.

### Avoid
- Don't film while resizing the window — the layout will jitter.
- Don't film on a fresh empty DB — the histogram will be missing.
- Don't show the dev tools or the file explorer; this is the marketing reel.

---

## 15. AI use disclosure

This section documents exactly where and how AI assistance was used to produce the current version of the site. It is the disclosure I would point to in a viva, a grading rubric, or a research-integrity question.

### 15.1 Tool, model, scope

- **Tool:** Claude Code — Anthropic's official CLI (terminal-based agent that can read/edit files and run shell commands locally).
- **Model:** Claude **Opus 4.7** (`claude-opus-4-7`).
- **Session:** A single interactive session on **2026-05-13**, lasting roughly two hours.
- **What AI assisted with:** the frontend redesign + the `/teaching` page + the dynamic publications histogram + the animated compass mark + the page transitions / scroll progress bar + this handoff document.
- **What AI did *not* touch in this session:**
  - The entire `backend/` directory (Express server, OpenAlex sync, SQLite schema, cron, admin routes) — these existed before the session and were used as-is.
  - `src/data/team.json` and `src/data/projects.json` — content was already in the repo.
  - `src/data/publications.json` — legacy seed file, unchanged.
  - `src/services/api.js`, `src/hooks/useScrollReveal.js`, `src/components/ScrollToTop.jsx`, `src/main.jsx`, `vite.config.js`, `package.json`.

### 15.2 Files generated or modified with AI assistance

**Created from scratch by the AI (under my direction):**
- `src/components/HeroMark.jsx` — the animated compass SVG.
- `src/components/ScrollProgress.jsx` — top-of-viewport progress bar.
- `src/pages/Teaching.jsx` — the new teaching page.
- `src/data/teaching.json` — placeholder course data (all entries marked `TODO — course 1`, intended to be filled in by hand).
- `public/favicon.svg` — replaced the generic default.
- `handoff.md` — this document.

**Substantially rewritten with AI assistance:**
- `src/index.css` — the single-file design system. Grew from ~950 lines to ~1700 lines: scroll progress, page transitions, hero compass styles, year-histogram, teaching cards, course cards, schematic diagram, refined cards/buttons/navbar.
- `src/pages/Home.jsx` — hero rebuilt, schematic Cloud-Fog-Edge block replaced the emoji-box version, section-tag numbering added, quick-links expanded to 4-up.
- `src/pages/Publications.jsx` — dynamic year filter + histogram filter component, two-stage fetch (full corpus for histogram + filtered fetch for display).

**Lightly edited with AI assistance:**
- `src/components/Navbar.jsx` — logo swap + added Teaching nav item.
- `src/components/Footer.jsx` — logo swap + dynamic "last-updated" string + Teaching link.
- `src/App.jsx` — `/teaching` route + ScrollProgress + `key`-based page transitions.
- `src/pages/Team.jsx`, `src/pages/Projects.jsx`, `src/pages/Resources.jsx` — page-header heading style tweaks only.
- `index.html` — updated Google Fonts import (Outfit + Inter + IBM Plex Mono).
- `src/assets/logo-desy.png` — copied from `logo Desy.png` so Vite could fingerprint it.

**Deleted with AI assistance:**
- `src/components/DesyLogo.jsx` — the previous inline-SVG logo, replaced by the PNG.

No third-party libraries were added during the session. Only fonts were fetched from a remote source (Google Fonts CDN — see `index.html`).

### 15.3 Prompts I gave (verbatim, lightly trimmed)

The session was iterative: I gave high-level intent, the AI proposed and implemented, I accepted or redirected. The literal prompts I sent, in order:

1. **Opening request — feature + design audit.**
   > *"I'm planning to update the frontend with the new structure added from the backend, I have the following suggestions: I like the colors of the site currently and I don't want to change that. I want to add a teaching section (top right where you can see what every professor teaches) and I have to change the top left logo it looks a bit weird, use logo desy.png. Also check the frontend for anything that could be added/changed in terms of design."*

2. **Design pass.** Invoked the built-in `/frontend-design` skill to ask for a distinctive aesthetic direction. The AI proposed an "editorial-engineering" direction (Fraunces serif + IBM Plex Mono + italic accents).

3. **First correction — typography reverted + dynamic filter + restructure.**
   > *"I don't like the font for the text that you modified, the previous one looked a bit more fresh and I want it like that, also I want to update the filtering system for the publications (I only have options up to 2024 — I can't filter the 2025 and 2026). And I don't like the teaching showing up on the home page, I want a separate page for that just like home, publications, projects etc."*

4. **Asking for the next set of improvements.**
   > *"tell me what can I change using frontend-design"*

   The AI returned an inventory of ~30 candidate moves; I selected three.

5. **Committing to a subset + a new ask.**
   > *"Yeah, let's go with those 3, i also want to change the button design on the navbar, don't use dots and I want a clean animation for them"*

6. **Compass interaction + further recommendations.**
   > *"what other design moves would you recommend? Can you also add a short animation for the compass in the main page (something interactive)"*

7. **Handoff request.**
   > *"before ending this session I want a full handoff.md file. Tomorrow I will have a presentation for this website and I need to write the documentation for it. Give me everything needed for this in the file. Also add some details for the demo video (I need to make one for it)."*

8. **This very section.**
   > *"I also need to mention explicitly how I used ai and where I used it (prompts, resources, final version obtained) — can you add this into handoff.md?"*

### 15.4 How the iteration worked — what was accepted vs rejected

- **Accepted as proposed:** the compass SVG concept, the histogram filter approach, the teaching-page layout, the dynamic year-derivation logic, the scroll-progress bar, the page-transition mechanism (key-on-location), the underline navbar animation.
- **Accepted then refined:** the hero composition (originally housed the teaching panel; relocated after my feedback), the section-tag numbering, the quick-links grid (expanded to 4-up to include Teaching).
- **Rejected entirely:** the Fraunces serif + italic-accent typography direction proposed during the `/frontend-design` pass. After my feedback, the AI reverted to Outfit + Inter + IBM Plex Mono and removed every `font-variation-settings` and italic-on-heading rule.
- **Out of scope by design:** no backend, no library additions, no deployment infrastructure, no CI. The session deliberately stayed in the frontend layer.

Every change went through my review before the session moved on. I treated the AI's output as a draft, not a finished product — visual fit, content correctness, and interaction feel were judged by me.

### 15.5 Tools the AI used during the session

- **File read / edit / write** on the local working copy.
- **Shell** (`npm run dev`, `npx eslint`, `cp`, `ls`) to start the dev server, lint changes, and verify Vite reloaded cleanly. The dev server ran in the background throughout the session; HMR confirmations were treated as a quick sanity check.
- **No web access.** `WebFetch` / `WebSearch` were not used at any point. The AI relied on its training knowledge (e.g. CSS recipes, OpenAlex polite-pool conventions, node-cron syntax) and on reading files in the repo.
- **No external code generation services** (no GPT, no Gemini, no Copilot) — Claude Code was the only AI tool involved.

### 15.6 External resources / references

- **Google Fonts** — Outfit, Inter, IBM Plex Mono — loaded via `<link>` in `index.html`. No font files are bundled.
- **Bootstrap 5** — used for the responsive grid only; no Bootstrap components are themed or extended. (Pre-existing dependency, not added by AI.)
- **OpenAlex** — public scholarly metadata API; consumed by the backend (pre-existing).
- No other web pages were scraped, downloaded, or copied. No external code was pasted into the project.

### 15.7 Verification I performed

For each major change:
- Watched the Vite HMR log for compilation errors (none after final state).
- Ran `npx eslint src --max-warnings 5` — passed with the two long-standing warnings in `useScrollReveal.js` (pre-existing, not introduced this session).
- Visually verified each affected page on http://localhost:5175 in the browser.
- Reviewed the diffs in the editor before moving on.

### 15.8 Final version obtained

The current working copy on `main` represents the **AI-assisted, human-reviewed** version of the site. Each AI proposal was either accepted by me, refined through follow-up prompts, or rejected and replaced. The session also produced this `handoff.md` and a separate placeholder data file (`src/data/teaching.json`) that **I will fill in by hand before the presentation** — the courses listed there as `TODO — course 1` were not invented by the AI, they are explicit gaps.

Recommended phrasing for a slide or oral disclosure:

> "The frontend redesign and this documentation were produced with Claude Code (Anthropic, Opus 4.7) in a single iterative session on 2026-05-13. AI generated draft code and design proposals; I directed the design, accepted or rejected each change, and verified everything visually and via lint/build. The backend, the data files, and the original site scaffold pre-dated the AI session. No external code was copied in; no web searches were performed."

---

## 16. Quick reference cheatsheet

| Need to… | Do this |
|---|---|
| Update team list | edit `src/data/team.json`, run `cd backend && npm run db:seed` |
| Update courses | edit `src/data/teaching.json` (hot-reload) |
| Update projects | edit `src/data/projects.json` |
| Force a publications refresh | `cd backend && npm run sync:once` |
| Change cron schedule | edit `CRON_SCHEDULE` in `backend/.env` |
| Change colors | edit CSS variables in `:root` at the top of `src/index.css` |
| Add a new page | create `src/pages/Foo.jsx`, add `<Route>` in `src/App.jsx`, add `<NavLink>` in `Navbar.jsx` (and optionally `Footer.jsx`) |
| Add a new public API endpoint | new file in `backend/src/routes/`, register in `backend/src/index.js` |
| Rebuild prod bundle | `npm run build` then deploy `dist/` |

---

*Last updated: 2026-05-13. Document maintained alongside `src/index.css` (single-file design system) and `backend/src/db/schema.sql` (single-file data model). Keep this file in sync when either of those changes shape.*
