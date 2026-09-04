import { useRef, useState } from "react";
import { ArrowLeft, LogOut, UserRound } from "lucide-react";
import ServiceGraphic from "../components/blocks/ServiceGraphic.jsx";
import SchoolCard from "../components/blocks/SchoolCard.jsx";
import useDismissOnOutside from "../hooks/useDismissOnOutside.js";
import { useBrowser } from "../browser/BrowserContext.jsx";
import { ADMIN_SCHOOLS, account, serviceById } from "../data/experiences.js";
import "./SchoolSelect.css";

/**
 * SchoolSelect — the interstitial an admin lands on when they open a service
 * they administer for more than one school.
 *
 * This replaced a modal. A modal was the wrong shape for it: choosing a school
 * isn't a detour from the page behind it, it's the step that decides what the
 * page will be, and there was nothing underneath worth keeping in view.
 *
 * The shell is a slim top bar rather than the global nav, because this is a
 * gate. Every rail item — Dashboard, Inbox, Settings — is scoped to a school
 * that hasn't been chosen, so a rail here could only show items that don't
 * work yet. The bar carries the two things that do apply: a way back, and the
 * account, so an admin who lands here by accident isn't stuck with one door.
 *
 * Two tiers, following the production page: the admin's usual school on top,
 * the rest under "Related schools". Both actions do the same thing — open the
 * service for that school. The tiers are hierarchy, not different behaviour.
 */
export default function SchoolSelect({ serviceId }) {
  const { activeTab, setTabSchool, closeTab } = useBrowser();
  const [menuOpen, setMenuOpen] = useState(false);
  const accountRef = useRef(null);
  const avatarRef = useRef(null);

  useDismissOnOutside(
    menuOpen,
    () => setMenuOpen(false),
    [accountRef],
    avatarRef
  );

  const service = serviceById(serviceId);
  if (!service) return null;

  // Stands in for the admin's default or most recently used school. The
  // prototype doesn't persist a preference, so the first school takes the
  // top tier.
  const [primary, ...related] = ADMIN_SCHOOLS;

  const choose = (school) => {
    if (activeTab) setTabSchool(activeTab.id, school.id);
  };

  // Nothing has happened yet — no school chosen means no work to return to —
  // so back closes this tab and hands focus to whichever tab was underneath,
  // which is Platform Services.
  const goBack = () => {
    if (activeTab) closeTab(activeTab.id);
  };

  const initials = account.name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2);

  return (
    <div className="schoolsel">
      <header className="schoolsel__bar">
        <button className="schoolsel__back" onClick={goBack}>
          <span className="schoolsel__back-icon" aria-hidden="true">
            <ArrowLeft size={18} strokeWidth={2.5} />
          </span>
          <span className="schoolsel__back-label">
            <strong>Back to</strong> my services
          </span>
        </button>

        <div className="schoolsel__account" ref={accountRef}>
          <button
            ref={avatarRef}
            className="schoolsel__avatar"
            aria-haspopup="menu"
            aria-expanded={menuOpen}
            aria-label={`Account: ${account.name}`}
            onClick={() => setMenuOpen((o) => !o)}
          >
            {initials}
          </button>
          {menuOpen && (
            <div className="schoolsel__menu" role="menu">
              <div className="schoolsel__menu-id">
                <span className="schoolsel__menu-name">{account.name}</span>
                <span className="schoolsel__menu-email">{account.email}</span>
                <span className="schoolsel__menu-role">{account.adminRole}</span>
              </div>
              <button className="schoolsel__menu-item" role="menuitem">
                <UserRound size={18} strokeWidth={2} aria-hidden="true" />
                Account settings
              </button>
              <button
                className="schoolsel__menu-item"
                role="menuitem"
                onClick={() => window.location.reload()}
              >
                <LogOut size={18} strokeWidth={2} aria-hidden="true" />
                Sign out
              </button>
            </div>
          )}
        </div>
      </header>

      <div className="schoolsel__container">
        <header className="schoolsel__service">
          <ServiceGraphic iconKey={service.icon} size={64} />
          <div className="schoolsel__service-text">
            <h1 className="schoolsel__title">{service.name}</h1>
            <p className="schoolsel__sub">
              You have access to multiple schools with this service.
            </p>
          </div>
        </header>

        {/* The heading is for screen readers only: the production page leaves
            this tier unlabelled, and the card's own action names it. It still
            needs to exist so the card titles below sit under a heading rather
            than skipping a level. */}
        <section aria-labelledby="schoolsel-selected">
          <h2 id="schoolsel-selected" className="sr-only">
            Selected school
          </h2>
          <div className="schoolsel__primary">
            <SchoolCard
              school={primary}
              emphasis
              actionLabel="Continue with this selection"
              actionVariant="primary"
              onSelect={choose}
            />
          </div>
        </section>

        {related.length > 0 && (
          <section aria-labelledby="schoolsel-related">
            <h2 id="schoolsel-related" className="schoolsel__related-title">
              Related schools
            </h2>
            <div className="launch-grid">
              {related.map((school) => (
                <SchoolCard
                  key={school.id}
                  school={school}
                  actionLabel="Add"
                  onSelect={choose}
                />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
