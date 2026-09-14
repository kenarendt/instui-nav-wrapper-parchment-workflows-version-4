import { Maximize, Minimize } from "lucide-react";
import GlobalNav from "./GlobalNav.jsx";
import IconButton from "./IconButton.jsx";
import ServiceSwitcher from "./ServiceSwitcher.jsx";
import SchoolBand from "./blocks/SchoolBand.jsx";
import SchoolCrest from "./SchoolCrest.jsx";
import { useBrowser } from "../browser/BrowserContext.jsx";
import {
  LEARNER_SCHOOLS,
  account,
  schoolById,
  serviceById,
  serviceSchools,
} from "../data/experiences.js";
import "./Wrapper.css";

/**
 * Wrapper — the Desktop Wrapper (beta) page shell.
 *
 * Composes GlobalNav + a content region (header, main, optional trailing
 * content area).
 *
 * Every page carries the same two controls at the top right, in this order:
 * the services switcher, then expand/collapse. They come after whatever the
 * page passes as `actions`, so a page-specific control like Customize
 * Dashboard sits to their left. Keeping the order fixed means the way out of a
 * service is in the same place on every screen, which is what makes a flat
 * architecture navigable.
 *
 * Expanded fills the content container; collapsed caps it at a fixed max width.
 * The trailing rail stays a fixed width in both states — the main column is the
 * side that flexes. The state is a display preference held in BrowserContext,
 * so toggling it on one page applies everywhere.
 *
 * Pass `serviceId` on an admin service page. The school an admin acts for is
 * scoped to the service, so that id decides both which school the page names
 * under its title and which schools the nav's institution mark offers. An admin
 * can cover four schools in Transcript Services and one in Receive, and the
 * switcher disappears in the second case because there is nothing to switch to.
 *
 * An admin service page states the school at the top of the work itself, in the
 * school band above the first panel, rather than as a line under the page
 * title. Research found the line too easy to miss; the band carries the crest,
 * the name at heading size, the location and the school's own colour. Because
 * it renders here rather than in each dashboard, every admin service gets the
 * same one in the same place, and a new service gets it for free.
 *
 * It sits above the whole body, not inside the main column, so its rule spans
 * the full content width. The school scopes everything on the page, including
 * the trailing rail, and a rule that stopped short of it would say otherwise.
 *
 * The line under the page title survives only where there is no band — Platform
 * Settings, which spans every school rather than naming one. Running both would
 * mean saying the same thing twice, 40px apart, which is how people learn to
 * read neither.
 *
 * Learner pages follow the same rule for the nav mark. Pass `showSchoolSummary`
 * to also state how many schools are connected under the page title.
 */
// Spell out small counts, per the house style: one through nine as words,
// 10 and above as numerals.
const NUMBER_WORDS = [
  "zero", "one", "two", "three", "four",
  "five", "six", "seven", "eight", "nine",
];
function countWord(n) {
  return NUMBER_WORDS[n] ?? String(n);
}
function capitalize(word) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

export default function Wrapper({
  navProps = {},
  // "admin" | "learner". Admin pages name the school under the page title.
  experienceType,
  // Service id, on admin service pages that act for one school at a time.
  serviceId,
  // Learner pages: state how many schools are connected under the page title.
  showSchoolSummary = false,
  breadcrumb,
  topRight,
  title,
  description,
  actions,
  tabs,
  trailing,
  children,
}) {
  const {
    expandedView,
    toggleExpandedView,
    session,
    activeTab,
    setTabSchool,
    openTab,
  } = useBrowser();

  const service = serviceId ? serviceById(serviceId) : undefined;
  // Every school this admin covers inside this service, and the one on screen.
  const schools = service ? serviceSchools(serviceId, session) : [];
  const school = service
    ? schoolById(activeTab?.params?.schoolId) ?? schools[0]
    : undefined;

  // What the header and nav say about school context. A page showing the band
  // says nothing under its title — the band has already said it, louder.
  let schoolLine = null;
  let schoolIdentity = null;
  if (experienceType === "admin") {
    if (school) {
      schoolIdentity = {
        institutionName: school.name,
        logo: <SchoolCrest size={40} variant={school.crest} />,
      };
    } else if (session.multiSchool !== false) {
      // Not scoped to one school, so it names none of them.
      schoolLine = "Across all of your schools";
      schoolIdentity = {
        institutionName: "Multiple schools",
        logo: <SchoolCrest size={40} variant="generic" />,
      };
    } else {
      // One school on the account — the institution is the school.
      schoolLine = account.institution;
    }
  } else if (experienceType === "learner") {
    const count = LEARNER_SCHOOLS.length;
    if (count > 1) {
      schoolIdentity = {
        institutionName: "Multiple schools",
        logo: <SchoolCrest size={40} variant="generic" />,
      };
      if (showSchoolSummary) {
        schoolLine = `${capitalize(countWord(count))} schools connected`;
      }
    } else {
      const only = LEARNER_SCHOOLS[0];
      if (only) {
        schoolIdentity = {
          institutionName: only.name,
          logo: <SchoolCrest size={40} variant={only.crest} />,
        };
        if (showSchoolSummary) schoolLine = `${only.name} connected`;
      }
    }
  }

  const nav = { ...navProps, ...(schoolIdentity ?? {}) };

  const handleLogout = () => {
    window.location.reload();
  };

  return (
    <div className="wrap">
      <GlobalNav
        {...nav}
        // Quick school switching straight from the institution mark, scoped to
        // the schools this service covers.
        schools={school ? schools : []}
        currentSchoolId={school?.id}
        onSelectSchool={
          school && activeTab
            ? (picked) => setTabSchool(activeTab.id, picked.id)
            : undefined
        }
        // A side trip rather than a service, so it opens its own tab and
        // leaves the work behind it intact. Deduped, so it never opens twice.
        onPlatformSettings={() =>
          openTab({
            kind: "platformSettings",
            title: "Settings",
            dedupeKey: "platformSettings",
          })
        }
        onLogout={handleLogout}
      />

      <main className="wrap__container">
        <div className={`wrap__content${expandedView ? " wrap__content--full" : ""}`}>
          {(breadcrumb || topRight) && (
            <div className="wrap__topbar">
              {breadcrumb && (
                <nav className="wrap__breadcrumb" aria-label="Breadcrumb">
                  {breadcrumb}
                </nav>
              )}
              {topRight && <div className="wrap__topright">{topRight}</div>}
            </div>
          )}
          {(title || actions) && (
            <div className="wrap__header">
              <div className="wrap__header-row">
                <div className="wrap__page-info">
                  {title && <h1 className="wrap__title">{title}</h1>}
                  {schoolLine && <p className="wrap__school">{schoolLine}</p>}
                  {description && (
                    <p className="wrap__description">{description}</p>
                  )}
                </div>
                <div className="wrap__actions">
                  {actions}
                  <ServiceSwitcher />
                  <IconButton
                    icon={expandedView ? Minimize : Maximize}
                    variant="secondary"
                    pressed={expandedView}
                    screenReaderLabel={expandedView ? "Collapse view" : "Expand view"}
                    onClick={toggleExpandedView}
                  />
                </div>
              </div>
              {tabs && <div className="wrap__tabs">{tabs}</div>}
            </div>
          )}

          {school && (
            <SchoolBand
              school={school}
              schools={schools}
              onSelectSchool={
                activeTab
                  ? (picked) => setTabSchool(activeTab.id, picked.id)
                  : undefined
              }
            />
          )}

          <div className={`wrap__body${trailing ? " wrap__body--split" : ""}`}>
            <div className="wrap__main">{children}</div>
            {trailing && (
              <aside className="wrap__trailing" aria-label="Additional content">
                {trailing}
              </aside>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
