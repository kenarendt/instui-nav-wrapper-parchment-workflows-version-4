import { useRef, useState } from "react";
import { Check, ChevronDown, ListFilter } from "lucide-react";
import useDismissOnOutside from "../../hooks/useDismissOnOutside.js";
import "./ListControls.css";

/**
 * ListControls — the filter and sort row above a list of credentials.
 *
 * Each filter is a multi-select popout of values that are actually present in
 * the list, so it never offers a school or a type that would empty the view for
 * no reason. Everything starts selected: a learner opening the page wants all of
 * their credentials, and filtering is how they narrow that down.
 *
 * The count line is not decoration. Once a filter hides rows, "Showing 12 of
 * 17" is the only thing on screen that says the list is incomplete, and without
 * it a learner can quietly believe they have fewer credentials than they do.
 */
function Popout({ id, label, summary, openId, setOpenId, children }) {
  const open = openId === id;
  const btnRef = useRef(null);
  const menuRef = useRef(null);
  useDismissOnOutside(open, () => setOpenId(null), [btnRef, menuRef], btnRef);

  return (
    <div className="lc__wrap">
      <button
        ref={btnRef}
        type="button"
        className={`lc__btn${open ? " lc__btn--open" : ""}`}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpenId(open ? null : id)}
      >
        <ListFilter size={16} strokeWidth={2} aria-hidden="true" />
        <span className="lc__btn-label">{label}</span>
        <span className="lc__btn-summary">{summary}</span>
        <ChevronDown size={16} strokeWidth={2} aria-hidden="true" />
      </button>
      {open && (
        <div ref={menuRef} className="lc__menu" role="menu" aria-label={label}>
          {children}
        </div>
      )}
    </div>
  );
}

export default function ListControls({
  // [{ id, label, noun, options: [{ value, label }], selected, onChange }]
  filters = [],
  // { value, options: [{ value, label }], onChange }
  sort,
  shown,
  total,
  noun = "items",
}) {
  const [openId, setOpenId] = useState(null);

  return (
    <div className="lc">
      <div className="lc__group">
        {filters.map((f) => {
          const all = f.selected.length === f.options.length;
          const toggle = (value) =>
            f.onChange(
              f.selected.includes(value)
                ? f.selected.filter((v) => v !== value)
                : [...f.selected, value]
            );
          return (
            <Popout
              key={f.id}
              id={f.id}
              label={f.label}
              summary={all ? "All" : `${f.selected.length} of ${f.options.length}`}
              openId={openId}
              setOpenId={setOpenId}
            >
              {f.options.map((o) => {
                const on = f.selected.includes(o.value);
                return (
                  <button
                    key={o.value}
                    type="button"
                    role="menuitemcheckbox"
                    aria-checked={on}
                    className="lc__option"
                    onClick={() => toggle(o.value)}
                  >
                    <span className={`lc__box${on ? " lc__box--on" : ""}`} aria-hidden="true">
                      {on && <Check size={14} strokeWidth={3} />}
                    </span>
                    {o.label}
                  </button>
                );
              })}
              <div className="lc__menu-foot">
                <button
                  type="button"
                  className="lc__link"
                  onClick={() => f.onChange(f.options.map((o) => o.value))}
                >
                  Select all
                </button>
                <button
                  type="button"
                  className="lc__link"
                  onClick={() => f.onChange([])}
                >
                  Clear
                </button>
              </div>
            </Popout>
          );
        })}

        {sort && (
          <Popout
            id={`${noun}-sort`}
            label="Sort"
            summary={sort.options.find((o) => o.value === sort.value)?.label}
            openId={openId}
            setOpenId={setOpenId}
          >
            {sort.options.map((o) => (
              <button
                key={o.value}
                type="button"
                role="menuitemradio"
                aria-checked={o.value === sort.value}
                className="lc__option"
                onClick={() => {
                  sort.onChange(o.value);
                  setOpenId(null);
                }}
              >
                <span className="lc__radio" aria-hidden="true">
                  {o.value === sort.value && <Check size={14} strokeWidth={3} />}
                </span>
                {o.label}
              </button>
            ))}
          </Popout>
        )}
      </div>

      <p className="lc__count" aria-live="polite">
        {shown === total
          ? `${total} ${noun}`
          : `Showing ${shown} of ${total} ${noun}`}
      </p>
    </div>
  );
}
