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

1. Sign in — an email address first, then whatever that address turns out to
   need:
   - **Email, then Continue.** The account is looked up rather than declared, so
     there is no product picker and no "Don't have an account?" link here.
   - **Which product**, only when the account reaches more than one of
     Parchment, Mastery, and Canvas. One product and this step never appears.
   - **The password** for the product they picked. Its heading names that
     product and its mark sits beside it — someone who just chose between three
     of them can see they landed on the right one before typing a password into
     it — with a Forgot password link underneath.
   An address with no account goes to registration instead, so being new stops
   being something the user has to notice and self-select. Mastery and Canvas
   reach a page that says plainly this prototype covers Parchment, rather than a
   hollow imitation of a product we have not built. That page renders inside the
   simulated browser with the services switcher still in place, so it is a
   boundary rather than a dead end.
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
   - **School switcher** — two triggers, one menu. The institution mark at the
     top of the nav rail, and the chevron on the school band above the
     dashboard. Schools hang off the service, not the account, so the menu only
     offers the schools attached to the service on screen, and both triggers
     disappear in a service that covers one school.
4. Admin dashboards and the learner credentials dashboard open with a **school
   band**: crest, school name at heading size, location, and a rule in the
   school's own primary colour. Research found that admins could not easily tell
   whose work they were looking at, so the school is stated at the top of the
   work rather than only in the chrome. The band renders from `Wrapper`, so every
   school-scoped page gets the same one in the same place.
5. On the learner side the school switcher chooses whose credentials are on
   screen, replacing the old tab bar. Its menu carries **Add another school** at
   the foot, below a divider, since someone with that menu open is already
   deciding which school. The two views that span schools — **All Credentials**
   and **Other Badges** — are nav items rather than tabs, because neither belongs
   to a school; they show no band and no switcher, which is the honest signal
   that they are not school-scoped.
6. All admin service dashboards share one common dashboard pattern.
7. Platform Settings sits in the nav account menu, under Account Settings. It
   opens in its own tab, since it is a side trip rather than a service.

## Registration

An email with no account reaches `screens/Register.jsx`, a full page with its
own chrome rather than another step in the sign-in card, matching the production
design. Registration happens through a school, so the school heads the card with
its crest, address, and a rule in its own colour — the same band idea as the
dashboards, in the place a learner first meets it. That school becomes the one
school the new account is connected to, so a fresh account lands on My
Credentials showing it, with nothing to switch to and only "Add another school"
in the menu.

Only a Parchment learner account can be created. An admin gets their access from
the institution, not from a signup form.

The school heads the card using the same `SchoolBand` the dashboards use, not a
lookalike built for this page. A learner meets this screen before anything else,
so the first time they see that band should teach them what it means everywhere
after. The form sits on white, so the card reads as one surface and the section
rules carry the structure.

Two deliberate departures from the reference screen: field labels sit above
their inputs rather than inside them, matching the rest of the prototype and
keeping the label visible once typing starts; and the required-fields note reads
"asterisk", which the reference misspells.

## First-run walkthrough

`components/OnboardingTour.jsx` + `.css`, switched on by "New user onboarding"
at sign-in. It dims the page, cuts a hole over a control, and anchors a popover
to it with a step counter and Back / Next.

It points at the two controls this architecture depends on: the services
switcher, then the school band. With no hub screen and no gate screens, someone
who misses those two is stuck in whichever service and school they landed in, so
they are worth a tour here in a way they would not be in an architecture with a
hub to fall back on. The school step spotlights the whole band rather than just
its chevron, so the message can say both things at once: this is whose work you
are looking at, and this is where you change it.

Steps are filtered by what is on screen, so the counter reads 1 of 2, 1 of 1, or
the tour never appears. The school step needs a switcher, not just a band: an
admin with one school in the service has nothing to switch to, and a tour
pointing at a control the user does not have teaches them the product is broken.

The page underneath is inert while it runs. The step counter promises a path
through, and letting someone open the spotlit menu would cover the popover
explaining it. Escape and the close button both end it, and once ended it stays
ended for the session.

## Learner ID verification

Learners go through an enhanced ID check, uploading a government issued ID. None
of that process is built here. What the prototype shows is where a learner
stands afterwards, as a status tag beside their persona tag in the account
panel, with the action that moves them on.

Three states, in `src/data/verification.js`:

- **Verified** (green) — done and still good. It keeps a **Reverify** action
  anyway, since a learner may need to redo the check after a name or ID change.
- **Reverification Required** (amber) — was verified, has lapsed. Same action,
  different urgency.
- **Not Verified** (red) — never done. The action is **Verify**, not Reverify:
  telling someone to redo something they have never done is confusing. A
  brand-new account created through registration starts here.

Each state pairs its colour with its own icon and its own words, so none of it
rests on colour alone, and all three clear 4.5:1 against their own fill.

Admins have no state here. Their standing comes from the institution that
granted their access, not from an ID check, so the block is absent on admin
pages — including for an account that is both.

**Pressing the pill cycles to the next state**, which is prototype scaffolding
rather than product behaviour. It sits on the pill so it stays clear of the
Verify / Reverify action beside it, which is the real one. The state is held in
`BrowserContext`, so it holds across pages and tabs.

## The prototype panel

It sits on the first sign-in step, since everything it varies is settled when
the email is checked. It stands in for the account lookup: the shape of the
Parchment account (admin plus learner, admin only, learner only), whether the
admin covers several schools, whether they reach one service or four, whether
the address also reaches Mastery or Canvas, whether the first-run walkthrough
runs, where the learner's ID verification starts, and whether it has an account
at all. A line underneath says in plain words what the current settings will do.

## School branding

Each school carries a `brandColor`, in `src/data/experiences.js` for admins and
`src/data/credentials.js` for learners, matched so the same school looks the same
from either side. The band sets
it as the `--school-brand` custom property, and the rule reads that property
rather than a hard-coded fill, so any other decorative element that should
carry the school's colour can read the same one. Treat it as decoration only: a
school sets this itself and can pick anything, so nothing relies on the colour
to be understood. The crest, the name and the location all identify the school
without it.

## Defaults live in one place

`PREFERENCES` in `src/data/experiences.js` holds the default service and the
default school per service. A flat architecture needs both: without them there
is nothing to land on. In production these would be user settings, which is why
Platform Settings is the menu item that sits closest to them.

## Fidelity notes

The Canvas and Mastery product marks are traced from the InstUI component
library (nodes 2280-7060 and 2280-7137) and live in `components/CanvasLogo.jsx`
and `components/MasteryLogo.jsx`. The Parchment mark is still a placeholder;
swap it when the real artwork is to hand.

The design references InstUI v2 / beta components and the 2026 token set (Inclusive Sans + Atkinson Hyperlegible Next), which aren't on public npm, so components are hand-built to match the Figma tokens. Photo and logo assets live on Figma's local asset server, so brand-blue gradients and simple marks stand in for them. Charts are lightweight inline SVG. Content on the hubs and dashboards is representative of the reference screens.
