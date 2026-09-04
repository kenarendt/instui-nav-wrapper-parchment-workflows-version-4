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
 * work yet.
 *
 * Back only appears when there is a Platform Services hub to go back to. An
 * account with a single service has no hub, so sign-in lands straight here and
 * "Back to my services" would have no destination — it used to close the only
 * tab and leave a blank page. In that case the page is a required choice:
 * no back, and sign out is the only way past it.
 *
 * Two tiers, following the production page: the admin's usual school on top,
 * the rest under "Related schools". Both actions do the same thing — enter the
 * service as that school — so both say "Continue". Different verbs across the
 * tiers would imply different outcomes.
 */
export default function SchoolSelect({ serviceId }) {
  const { activeTab, setTabSchool, closeTab, openTab, singleAccount } =
    useBrowser();
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

  // With one service on the account there is no hub, so there is nowhere for
  // back to lead and the choice is required.
  const canGoBack = !singleAccount;

  // Focus the hub (or open it if its tab was closed), then drop this one.
  // Nothing has happened here yet, so leaving no trace is the honest result.
  const goBack = () => {
    openTab({
      kind: "adminHub",
      title: "Platform Services",
      dedupeKey: "adminHub",
    });
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
        {canGoBack ? (
          <button className="schoolsel__back" onClick={goBack}>
            <span className="schoolsel__back-icon" aria-hidden="true">
              <ArrowLeft size={18} strokeWidth={2.5} />
            </span>
            <span className="schoolsel__back-label">
              <strong>Back to</strong> my services
            </span>
          </button>
        ) : (
          <span />
        )}

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
              {/* A required choice offers no side trips — sign out is the
                  only way past this page. */}
              {canGoBack && (
                <button className="schoolsel__menu-item" role="menuitem">
                  <UserRound size={18} strokeWidth={2} aria-hidden="true" />
                  Account settings
                </button>
              )}
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
              {!canGoBack && " Choose one to continue."}
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
                  actionLabel="Continue"
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
