import { useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import SchoolCrest from "../SchoolCrest.jsx";
import SchoolMenu from "../SchoolMenu.jsx";
import useDismissOnOutside from "../../hooks/useDismissOnOutside.js";
import "./SchoolBand.css";

/**
 * SchoolBand — says plainly which school the admin is acting on behalf of, and
 * offers a second place to change it.
 *
 * Research found that admins could not easily tell whose work they were looking
 * at. The nav rail already carried the school on its institution mark, but a
 * 40px crest in the chrome is easy to stop seeing. So the school gets stated at
 * the top of the work itself, at the size of a real heading, with the crest, the
 * location, and a rule in the school's own primary colour.
 *
 * The colour arrives as the `--school-brand` custom property rather than a fill
 * on the rule, so anything else that wants to carry the school's colour reads
 * the same property instead of re-deriving it. It is decoration only: a school
 * can set it to anything, so nothing here relies on the colour to be understood.
 * The crest, the name and the location all say which school this is without it.
 *
 * The chevron opens the same popout as the institution mark, not a second copy
 * of it. It renders only when the admin covers more than one school in this
 * service, matching the mark: a control that cannot change anything is worse
 * than no control.
 */
export default function SchoolBand({
  school,
  // Every school this admin covers in the service on screen.
  schools = [],
  onSelectSchool,
}) {
  const [open, setOpen] = useState(false);
  const btnRef = useRef(null);
  const menuRef = useRef(null);

  useDismissOnOutside(open, () => setOpen(false), [btnRef, menuRef], btnRef);

  if (!school) return null;
  const canSwitch = Boolean(onSelectSchool) && schools.length > 1;

  return (
    <section
      className="schoolband"
      style={{ "--school-brand": school.brandColor }}
      aria-label="Acting on behalf of"
    >
      <div className="schoolband__row">
        <span className="schoolband__crest" aria-hidden="true">
          <SchoolCrest size={56} variant={school.crest} />
        </span>

        <div className="schoolband__id">
          <h2 className="schoolband__name">{school.name}</h2>
          {school.location && (
            <p className="schoolband__meta">{school.location}</p>
          )}
          {school.country && (
            <p className="schoolband__meta">{school.country}</p>
          )}
        </div>

        {canSwitch && (
          <div className="schoolband__switch">
            <button
              ref={btnRef}
              type="button"
              className="icon-btn icon-btn--secondary"
              // Names the school as well as the action, so this reads the same
              // to a screen reader user as the crest and heading do to everyone
              // else. Deliberately worded differently from the nav rail's
              // switcher ("School: X. Switch school"): two buttons doing the
              // same job on one page should still be tellable apart in a list
              // of buttons, so the phrasing differs while the verb does not.
              aria-label={`Switch school. Acting on behalf of ${school.name}`}
              aria-haspopup="menu"
              aria-expanded={open}
              onClick={() => setOpen((o) => !o)}
            >
              <ChevronDown size={20} strokeWidth={2} />
            </button>
            {open && (
              <SchoolMenu
                menuRef={menuRef}
                placement="below"
                schools={schools}
                currentSchoolId={school.id}
                currentName={school.name}
                onSelect={(picked) => {
                  onSelectSchool(picked);
                  setOpen(false);
                }}
              />
            )}
          </div>
        )}
      </div>

      {/* Decorative: the identity above already names the school. */}
      <div className="schoolband__rule" aria-hidden="true" />
    </section>
  );
}
