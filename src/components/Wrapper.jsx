import { Maximize, Minimize } from "lucide-react";
import GlobalNav from "./GlobalNav.jsx";
import IconButton from "./IconButton.jsx";
import SchoolCrest from "./SchoolCrest.jsx";
import { useBrowser } from "../browser/BrowserContext.jsx";
import {
  ADMIN_SCHOOLS,
  LEARNER_SCHOOLS,
  account,
  schoolById,
} from "../data/experiences.js";
import "./Wrapper.css";

/**
 * Wrapper — the Desktop Wrapper (beta) page shell.
 *
 * Composes GlobalNav + a content region (header, main, optional trailing
 * content area). The nav's profile switcher opens/focuses the tab for the
 * chosen profile.
 *
 * Every page gets an expand/collapse control in the header actions. Expanded
 * fills the content container; collapsed caps it at a fixed max width. The
 * trailing rail stays a fixed width in both states — the main column is the
 * side that flexes. The state is a display preference held in BrowserContext,
 * so toggling it on one page applies everywhere.
 *
 * Admin pages (`experienceType="admin"`) name the school they act on behalf of
 * under the page title, and carry that school's crest in the nav. Pages that
 * are not scoped to one school — Platform Services, Platform settings — say so
 * instead of naming one: a single-school admin sees their institution, and a
 * multi-school admin sees a neutral mark and the number of schools they cover.
 *
 * Learner pages follow the same rule for the nav mark. Pass
 * `showSchoolSummary` to also state how many schools are connected under the
 * page title (Learner Connect does).
 *
 * Pass `schoolScope` (the service name) on an admin service page. When the
 * signed-in admin supports multiple schools, the tab shows the school
 * selection page until one is chosen; here it swaps the nav's institution mark
 * for that school's crest and adds "Change schools" to the account menu, which
 * clears the choice and returns the tab to that page.
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
  // Service name, on admin service pages that belong to one school at a time.
  schoolScope,
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
    openTab,
    expandedView,
    toggleExpandedView,
    multiSchool,
    activeTab,
    setTabSchool,
  } = useBrowser();
  // A school only comes into play on a service page, and only when this admin
  // supports more than one school. A service tab without one never reaches
  // this shell — it renders the school selection page instead.
  const schoolScoped = Boolean(schoolScope) && multiSchool;
  const school = schoolScoped ? schoolById(activeTab?.params?.schoolId) : undefined;

  // What the header and nav say about school context.
  let schoolLine = null;
  let schoolIdentity = null;
  if (experienceType === "admin") {
    if (school) {
      schoolLine = school.name;
      schoolIdentity = {
        institutionName: school.name,
        logo: <SchoolCrest size={40} variant={school.crest} />,
      };
    } else if (multiSchool) {
      // Spans every school this admin covers, so it names none of them. On a
      // service page still waiting on a choice, it says nothing at all.
      schoolLine = schoolScope
        ? null
        : `Administering ${countWord(ADMIN_SCHOOLS.length)} schools`;
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
        // On a service dashboard, a way back to the hub that launched it.
        onPlatformServices={
          experienceType === "admin" && schoolScope
            ? () =>
                openTab({
                  kind: "adminHub",
                  title: "Platform Services",
                  dedupeKey: "adminHub",
                })
            : undefined
        }
        // Clearing the school sends this tab back to the selection page.
        onChangeSchool={
          schoolScoped && school && activeTab
            ? () => setTabSchool(activeTab.id, null)
            : undefined
        }
        // Quick switch straight from the institution mark, without a trip
        // back to the selection page.
        schools={schoolScoped && school ? ADMIN_SCHOOLS : []}
        currentSchoolId={school?.id}
        onSelectSchool={
          schoolScoped && school && activeTab
            ? (picked) => setTabSchool(activeTab.id, picked.id)
            : undefined
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
