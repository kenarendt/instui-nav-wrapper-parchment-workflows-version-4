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
2. Sign-in drops you straight into a service. There is no hub screen and no
   school selection screen in between. Landing resolves in three steps:
   - Admin access beats learner access, so an account carrying both opens on an
     admin service.
   - The default service decides which one. Transcript Services for now.
   - That service's default school decides which school you act for.
   An account with learner access only opens on My Credentials.
3. Everything after that is traversal from inside a service, using two controls
   in the chrome:
   - **Services switcher** — the grid button in the page top-right, between
     Customize Dashboard and expand/collapse. It lists every service the account
     reaches, marks the one you are in, and puts My Credentials under its own
     "My experience" heading. It switches the current tab in place rather than
     opening a new one, and hides itself when the account has only one
     destination.
   - **School switcher** — the institution mark at the top of the nav rail, as
     before. Schools hang off the service, not the account, so it only offers the
     schools attached to the service on screen, and it disappears in a service
     that covers one school.
4. All admin service dashboards share one common dashboard pattern.
5. Platform Settings sits in the nav account menu, under Account Settings. It
   opens in its own tab, since it is a side trip rather than a service.

The prototype panel under the login card varies the shape of the account —
admin plus learner, admin only, learner only, whether the admin covers several
schools, and whether they reach one service or four. That is what decides where
you land and which of the two switchers appear, so it is what a demo needs to
change.

## Defaults live in one place

`PREFERENCES` in `src/data/experiences.js` holds the default service and the
default school per service. A flat architecture needs both: without them there
is nothing to land on. In production these would be user settings, which is why
Platform Settings is the menu item that sits closest to them.

## Fidelity notes

The design references InstUI v2 / beta components and the 2026 token set (Inclusive Sans + Atkinson Hyperlegible Next), which aren't on public npm, so components are hand-built to match the Figma tokens. Photo and logo assets live on Figma's local asset server, so brand-blue gradients and simple marks stand in for them. Charts are lightweight inline SVG. Content on the hubs and dashboards is representative of the reference screens.
