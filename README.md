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
3. Both experiences open on a Hub: a welcome-mat dashboard whose modules deep-link into detailed experiences.
   - Admin Hub — every service in one card grid under a single "Parchment Services" heading: Transcript Services, Diploma Services, Dual Enrollment, and Receive. Each card's Open button launches that service's dashboard in a new browser tab.
   - Learner Hub — account rollup, course work, credentials, and digital badges. Deep-links open the detailed Learner Dashboard in a new tab.
4. All admin service dashboards share one common dashboard pattern.
5. Expand the side navigation (collapse/expand control, or click the account avatar) to open the account profile and switch to any other experience you have access to. Switching opens a new tab for that experience, or focuses the tab if it's already open.

## Structure

- `src/theme/tokens.css` — design tokens extracted verbatim from Figma.
- `src/browser/` — the simulated browser: tab state (`BrowserContext`), Chrome-style frame (`BrowserFrame`), and the page registry mapping tab kinds to pages.
- `src/components/Wrapper.jsx` — the Desktop Wrapper (beta) page shell: GlobalNav + content + optional trailing content area.
- `src/components/GlobalNav.jsx` — collapsible nav rail with the account profile switcher.
- `src/components/` — InstUI-aligned primitives (Button, IconButton, TextInput, Select, Tabs, Card) and reusable `blocks/` (Panel, ServiceCard, ServiceGraphic, StatTile, LineChart, DonutChart, AINote).
- `src/screens/` — SignIn, AdminHub, LearnerHub, ServiceDashboard (shared), LearnerDashboard.
- `src/data/experiences.js` — account, experiences, and service definitions.

## Fidelity notes

The design references InstUI v2 / beta components and the 2026 token set (Inclusive Sans + Atkinson Hyperlegible Next), which aren't on public npm, so components are hand-built to match the Figma tokens. Photo and logo assets live on Figma's local asset server, so brand-blue gradients and simple marks stand in for them. Charts are lightweight inline SVG. Content on the hubs and dashboards is representative of the reference screens.
