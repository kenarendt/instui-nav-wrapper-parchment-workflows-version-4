import SchoolCrest from "./SchoolCrest.jsx";
import "./SchoolMenu.css";

/**
 * SchoolMenu — the popout that switches which school an admin is acting for.
 *
 * One copy, two triggers: the institution mark at the top of the nav rail, and
 * the chevron on the school band above the dashboard. Both open this. Research
 * said it was not obvious enough which school you were working on behalf of, so
 * the answer was another place to see and change it — but a second popout,
 * hand-built beside the first, is how two controls that should behave
 * identically start behaving differently. `placement` is the only thing that
 * varies: where it anchors.
 *
 * The current school is named in the header rather than listed, since choosing
 * it would do nothing. Callers decide whether a switcher appears at all — with
 * one school in the service there is nothing to switch to, and no trigger
 * should be drawn.
 */
export default function SchoolMenu({
  menuRef,
  // Schools this admin covers in the service on screen, including the current.
  schools = [],
  currentSchoolId,
  currentName,
  onSelect,
  // "rail" anchors beside the nav rail; "below" drops under its trigger,
  // right-aligned.
  placement = "rail",
}) {
  const others = schools.filter((s) => s.id !== currentSchoolId);
  return (
    <div
      ref={menuRef}
      className={`schoolmenu schoolmenu--${placement}`}
      role="menu"
      aria-label="Switch school"
    >
      <div className="schoolmenu__head">
        <span className="schoolmenu__label">Current school</span>
        <span className="schoolmenu__current">{currentName}</span>
      </div>
      {others.map((s) => (
        <button
          key={s.id}
          type="button"
          role="menuitem"
          className="schoolmenu__item"
          onClick={() => onSelect?.(s)}
        >
          <span className="schoolmenu__crest" aria-hidden="true">
            <SchoolCrest size={28} variant={s.crest} />
          </span>
          <span className="schoolmenu__name">{s.name}</span>
        </button>
      ))}
    </div>
  );
}
