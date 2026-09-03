import { ChevronLeft } from "lucide-react";
import ServiceGraphic from "../components/blocks/ServiceGraphic.jsx";
import SchoolCard from "../components/blocks/SchoolCard.jsx";
import { useBrowser } from "../browser/BrowserContext.jsx";
import { ADMIN_SCHOOLS, serviceById } from "../data/experiences.js";
import "./SchoolSelect.css";

/**
 * SchoolSelect — the interstitial an admin lands on when they open a service
 * they administer for more than one school.
 *
 * This replaced a modal. A modal was the wrong shape for it: choosing a school
 * isn't a detour from the page behind it, it's the step that decides what the
 * page will be, and there was nothing underneath worth keeping in view.
 *
 * Unique in the prototype for having no global nav. The only way out is back,
 * because until a school is chosen there is no school context for a nav to
 * describe.
 *
 * Two tiers, following the production page: the admin's usual school on top,
 * the rest under "Related schools". Both actions do the same thing — open the
 * service for that school. The tiers are hierarchy, not different behaviour.
 */
export default function SchoolSelect({ serviceId }) {
  const { activeTab, setTabSchool, closeTab } = useBrowser();
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
  // which is Admin Connect.
  const goBack = () => {
    if (activeTab) closeTab(activeTab.id);
  };

  return (
    <div className="schoolsel">
      <nav className="schoolsel__bar" aria-label="Back">
        <button className="schoolsel__back" onClick={goBack}>
          <ChevronLeft size={20} strokeWidth={2.5} aria-hidden="true" />
          Back to my services
        </button>
      </nav>

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
