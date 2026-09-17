import { useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import Button from "../Button.jsx";
import AdvancedSearchModal from "../AdvancedSearchModal.jsx";
import "./GlobalSearch.css";

/**
 * GlobalSearch — one search box per service, above the work.
 *
 * Every admin service dashboard opens with the same question: find the one
 * learner, order, or document this is about. So the search sits at the top of
 * the main column, above the Workspace panels, rather than behind a nav item.
 * It renders from Wrapper, like the school band, so a new service gets it
 * without touching its dashboard.
 *
 * It is scoped to one service, not to the platform. An admin in Diploma
 * Services is looking for a diploma; offering them every field Receive needs
 * would be noise, and a result set spanning four services would have no single
 * place to send them. Each service brings its own supporting line, placeholder,
 * and advanced fields from `search` in the services model.
 *
 * The box takes a single string because that is how people start — a name, a
 * date of birth, an ID — and everything narrower lives behind the advanced
 * button. That keeps the common case one field wide while the 15 to 18 fields
 * an admin occasionally needs stay one click away instead of filling the page.
 *
 * Nothing here queries anything: this is a prototype, so submitting is inert.
 * The point on screen is where search lives and how much of it is visible
 * before you ask for more.
 */
export default function GlobalSearch({ service }) {
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const config = service?.search;
  if (!config) return null;

  return (
    <section className="gsearch" aria-labelledby="gsearch-title">
      <div className="gsearch__head">
        <h2 className="gsearch__title" id="gsearch-title">
          Search
        </h2>
        <p className="gsearch__note">{config.note}</p>
      </div>

      <form
        className="gsearch__form"
        role="search"
        onSubmit={(e) => e.preventDefault()}
      >
        <div className="gsearch__field">
          <Search
            className="gsearch__icon"
            size={20}
            strokeWidth={2}
            aria-hidden="true"
          />
          <input
            className="gsearch__input"
            type="search"
            placeholder={config.placeholder}
            /* Names the service, because the page can carry a second search
               inside a panel and "Search" alone would not tell them apart. */
            aria-label={`Search ${service.name}`}
          />
        </div>

        <div className="gsearch__actions">
          <Button variant="primary" type="submit">
            Search
          </Button>
          {/* Labelled rather than icon-only to assistive tech: the sliders
              glyph is well understood visually but says nothing on its own. */}
          <button
            type="button"
            className="gsearch__advanced"
            aria-haspopup="dialog"
            aria-expanded={advancedOpen}
            onClick={() => setAdvancedOpen(true)}
          >
            <SlidersHorizontal size={18} strokeWidth={2} aria-hidden="true" />
            <span className="gsearch__advanced-label">Advanced options</span>
          </button>
        </div>
      </form>

      {advancedOpen && (
        <AdvancedSearchModal
          service={service}
          onClose={() => setAdvancedOpen(false)}
        />
      )}
    </section>
  );
}
