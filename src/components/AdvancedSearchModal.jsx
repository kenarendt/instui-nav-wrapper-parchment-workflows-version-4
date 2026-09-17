import { useEffect, useId, useRef } from "react";
import {
  Check,
  ChevronDown,
  FileText,
  Inbox,
  Search,
  Upload,
  UserSquare,
  X,
} from "lucide-react";
import Button from "./Button.jsx";
import "./TextInput.css";
import "./AdvancedSearchModal.css";

/**
 * AdvancedSearchModal — every field a service can search on, in one dialog.
 *
 * The global search box on the dashboard takes one string. This is where the
 * rest of it lives: 15 to 18 fields grouped by what they describe, which is too
 * much to leave on a dashboard but exactly what an admin reaches for when the
 * single box has returned 200 rows.
 *
 * Fields come from `search.sections` on the service, so the dialog is the same
 * component in all four services and none of them can drift from its own
 * model. A service adds a section by adding one to its config. Section icons
 * arrive as keys rather than components, because the services model is data —
 * it should not have to import from lucide to describe itself.
 *
 * Grouping matters more than it looks. "Search learner details" and "Search
 * document details" are two different questions — who, and what — and an admin
 * usually knows the answer to one of them. Flattening 18 inputs into one grid
 * would make them scan all of it to find the two fields they came for.
 *
 * Bulk search sits beside the fields rather than in them: pasting 400 IDs is a
 * different task from filling in a form, and it replaces the fields instead of
 * refining them.
 *
 * Reset is deliberately present. A form this wide is easy to leave half-filled
 * from a previous question, and a stale field silently narrowing a search is
 * worse than an empty one.
 *
 * Nothing here queries anything — submitting closes the dialog. What is being
 * prototyped is the shape and reach of the search, not the results.
 */
const SECTION_ICONS = {
  id: UserSquare,
  doc: FileText,
  inbox: Inbox,
};

function Field({ field, idBase }) {
  const id = `${idBase}-${field.label.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}`;

  // A row of checkboxes rather than a select: these are states an admin
  // combines ("New or Complete"), not one choice out of a list.
  if (field.type === "checks") {
    return (
      <fieldset className="asm__checks">
        <legend className="asm__label">{field.label}</legend>
        <div className="asm__checks-row">
          {field.options.map((opt) => (
            <label className="asm__check" key={opt}>
              <input type="checkbox" className="asm__check-input" />
              <span className="asm__check-box" aria-hidden="true">
                <Check size={14} strokeWidth={3} />
              </span>
              {opt}
            </label>
          ))}
        </div>
      </fieldset>
    );
  }

  if (field.type === "select") {
    return (
      <div className="asm__field">
        <label className="asm__label" htmlFor={id}>
          {field.label}
        </label>
        <div className="asm__select">
          <select id={id} className="asm__select-control" defaultValue="">
            <option value="">Any</option>
            {field.options.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
          <ChevronDown
            className="asm__select-chevron"
            size={20}
            strokeWidth={1.5}
            aria-hidden="true"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="asm__field">
      <label className="asm__label" htmlFor={id}>
        {field.label}
      </label>
      <input
        id={id}
        className="text-input"
        type={field.type === "date" ? "date" : "text"}
        placeholder={field.type === "date" ? "mm/dd/yyyy" : undefined}
      />
    </div>
  );
}

export default function AdvancedSearchModal({ service, onClose }) {
  const idBase = useId();
  const boxRef = useRef(null);
  const closeRef = useRef(null);
  const sections = service?.search?.sections ?? [];

  // Escape closes, and focus starts inside the dialog rather than on whatever
  // was behind it. Without both, a keyboard user opening this is stranded.
  useEffect(() => {
    closeRef.current?.focus();
    const onKey = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  const reset = () => {
    const form = boxRef.current?.querySelector("form");
    form?.reset();
  };

  return (
    <div
      className="asm-overlay"
      role="dialog"
      aria-modal="true"
      aria-label={`Advanced search — ${service.name}`}
    >
      <div className="asm-box" ref={boxRef}>
        <div className="asm__head">
          <div>
            <h2 className="asm__title">Advanced search</h2>
            {/* Names the service, because this dialog looks the same in all
                four and the fields alone will not always say which one. */}
            <p className="asm__sub">{service.name}</p>
          </div>
          <button
            ref={closeRef}
            className="panel__menu"
            aria-label="Close advanced search"
            onClick={onClose}
          >
            <X size={20} strokeWidth={2} />
          </button>
        </div>

        <form
          className="asm__form"
          onSubmit={(e) => {
            e.preventDefault();
            onClose?.();
          }}
        >
          <div className="asm__cols">
            <div className="asm__sections">
              {sections.map((section) => {
                const Icon = SECTION_ICONS[section.icon] ?? Search;
                return (
                  <fieldset className="asm__section" key={section.title}>
                    <legend className="asm__section-title">
                      <Icon size={18} strokeWidth={2} aria-hidden="true" />
                      {section.title}
                    </legend>
                    <div className="asm__grid">
                      {section.fields.map((field) => (
                        <Field
                          key={field.label}
                          field={field}
                          idBase={idBase}
                        />
                      ))}
                    </div>
                  </fieldset>
                );
              })}
            </div>

            <aside className="asm__bulk" aria-label="Search in bulk">
              <h3 className="asm__bulk-title">
                <Upload size={18} strokeWidth={2} aria-hidden="true" />
                Search in bulk
              </h3>
              <p className="asm__bulk-note">
                Paste or upload a list of IDs to look up many records at once.
                A bulk list replaces the fields on the left.
              </p>
              <label className="asm__label" htmlFor={`${idBase}-bulk`}>
                One ID per line
              </label>
              <textarea
                id={`${idBase}-bulk`}
                className="asm__textarea"
                rows={6}
                placeholder={"1048-2291\n1048-2292\n1048-2293"}
              />
              <Button variant="secondary" icon={Upload}>
                Upload a file
              </Button>
            </aside>
          </div>

          <div className="asm__actions">
            <button type="button" className="asm__reset" onClick={reset}>
              Reset all fields
            </button>
            <div className="asm__actions-right">
              <Button variant="secondary" onClick={onClose}>
                Cancel
              </Button>
              <Button variant="primary" type="submit" icon={Search}>
                Search
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
