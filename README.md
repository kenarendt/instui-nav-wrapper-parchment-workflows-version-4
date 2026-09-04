# InstUI Nav Wrapper — Parchment platform prototype

A conceptual prototype of the Parchment platform experience, recreated in React from Figma (91.01.01 User Authentication and the HUB) using the InstUI 2026 design tokens. It simulates one user with multiple profiles under a single account login, moving through the application across simulated browser tabs.

## Preview it without a server (double-click)

`index.html` in the project root is a built, self-contained page — all JavaScript and CSS inlined. Double-click it, or open it in any browser, and the whole prototype runs. No install, no local server.

A build is checked in, so this works straight from a fresh clone. `prototype.html` is an identical copy, kept so older links keep working.

## Run it (development)

```bash
npm install
npm run dev
```

The dev entry is `dev.html`, not `index.html` — the built page owns `index.html`. `npm run dev` opens `/dev.html` for you, and the dev server redirects `/` there too, so you never get served the stale build by accident.

## Rebuild the double-click file

```bash
npm run package
```

This builds `dist/dev.html` and copies it over both `index.html` and `prototype.html`. Re-run it whenever the source changes, and commit the result so teammates get the update.

Notes on the file:// approach:

- Fonts (Inclusive Sans, Atkinson Hyperlegible Next) load from Google Fonts over the network, so they render when online. Offline, the app falls back to system fonts — everything still works, just with different type.
- Everything else is embedded, so there are no other network dependencies.
- If future work adds anything that fetches a separate local file (a JSON data file, a separate image, a dynamic import), that would break under file:// — keep new assets imported into the bundle so the single-file build stays self-contained.
- For the smoothest hosted option, GitHub Pages can serve the built file over https (which removes the file:// caveats entirely).

## The flow

1. Sign in — enter any email and password, pick a product, and log in.
2. The demo account carries both a Learner and an Admin experience. When both exist, sign-in lands on the Admin experience.
3. Each experience opens on a welcome-mat dashboard whose modules deep-link into detailed experiences.
   - Platform Services (admin) — greets the admin, then lays every service out in one card grid: Transcript Services, Diploma Services, Dual Enrollment, and Receive. Each card's Open button launches that service in a new browser tab. The kebab holds "Set your preferences", which would let an admin skip this screen and land straight inside a service.
   - Learner Connect — account rollup, course work, credentials, and digital badges. Deep-links open the detailed Learner Dashboard in a new tab.
4. An admin who administers several schools picks one before a service dashboard can show anything, on a school selection page inside that service's tab. It has no global nav, since every nav item is scoped to a school that hasn't been chosen; a top bar carries a way back and the account instead.
5. All admin service dashboards share one common dashboard pattern.
6. Inside a service, the institution mark in the nav rail switches schools in one click. The account menu carries "Platform Services" to return to the hub, and "Change schools" to go back to the full selection page.

## Structure

- `src/theme/tokens.css` — design tokens extracted verbatim from Figma.
- `src/browser/` — the simulated browser: tab state (`BrowserContext`), Chrome-style frame (`BrowserFrame`), and the page registry mapping tab kinds to pages.
- `src/components/Wrapper.jsx` — the Desktop Wrapper (beta) page shell: GlobalNav + content + optional trailing content area.
- `src/components/GlobalNav.jsx` — collapsible nav rail, the account panel, and the school switcher on the institution mark.
- `src/components/` — InstUI-aligned primitives (Button, IconButton, TextInput, Select, Tabs, Card) and reusable `blocks/` (Panel, ServiceCard, ServiceGraphic, StatTile, LineChart, DonutChart, AINote).
- `src/screens/` — SignIn, AdminHub (the Platform Services screen), LearnerHub, SchoolSelect, ServiceDashboard (shared), LearnerDashboard.
- `src/hooks/useDismissOnOutside.js` — one copy of the Escape / outside-press dismissal every transient menu uses.
- `src/data/experiences.js` — account, experiences, and service definitions.

## Fidelity notes

The design references InstUI v2 / beta components and the 2026 token set (Inclusive Sans + Atkinson Hyperlegible Next), which aren't on public npm, so components are hand-built to match the Figma tokens. Photo and logo assets live on Figma's local asset server, so brand-blue gradients and simple marks stand in for them. Charts are lightweight inline SVG. Content on the hubs and dashboards is representative of the reference screens.
