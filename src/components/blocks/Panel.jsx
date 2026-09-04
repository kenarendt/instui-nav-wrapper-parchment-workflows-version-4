import { useRef, useState } from "react";
import { MoreVertical } from "lucide-react";
import useDismissOnOutside from "../../hooks/useDismissOnOutside.js";
import "./Panel.css";

/**
 * Panel — the standard white content container used across hubs and
 * dashboards. Optional header with title, subtitle, and an overflow menu.
 *
 * `showMenu` renders the kebab as a placeholder, which is how most panels in
 * the prototype use it. Pass `menuItems` instead to make it real: an array of
 * { label, onClick }, rendered as a dropdown that dismisses on Escape or an
 * outside press.
 */
export default function Panel({
  title,
  subtitle,
  headerRight,
  showMenu = false,
  menuItems = null,
  padded = true,
  className = "",
  children,
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuBtnRef = useRef(null);
  const menuRef = useRef(null);
  const hasMenu = Array.isArray(menuItems) && menuItems.length > 0;

  useDismissOnOutside(
    menuOpen,
    () => setMenuOpen(false),
    [menuBtnRef, menuRef],
    menuBtnRef
  );

  return (
    <section className={`panel${className ? ` ${className}` : ""}`}>
      {(title || headerRight || showMenu || hasMenu) && (
        <header className="panel__header">
          <div className="panel__heading">
            {title && <h2 className="panel__title">{title}</h2>}
            {subtitle && <p className="panel__subtitle">{subtitle}</p>}
          </div>
          <div className="panel__header-right">
            {headerRight}
            {hasMenu ? (
              <div className="panel__menu-wrap">
                <button
                  ref={menuBtnRef}
                  className="panel__menu"
                  aria-label={title ? `More options: ${title}` : "More options"}
                  aria-haspopup="menu"
                  aria-expanded={menuOpen}
                  onClick={() => setMenuOpen((o) => !o)}
                >
                  <MoreVertical size={20} strokeWidth={2} />
                </button>
                {menuOpen && (
                  <div ref={menuRef} className="panel__menu-list" role="menu">
                    {menuItems.map((item) => (
                      <button
                        key={item.label}
                        role="menuitem"
                        className="panel__menu-item"
                        onClick={() => {
                          item.onClick?.();
                          setMenuOpen(false);
                        }}
                      >
                        {item.Icon && (
                          <item.Icon size={18} strokeWidth={2} aria-hidden="true" />
                        )}
                        {item.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              showMenu && (
                <button className="panel__menu" aria-label="More options">
                  <MoreVertical size={20} strokeWidth={2} />
                </button>
              )
            )}
          </div>
        </header>
      )}
      <div className={`panel__body${padded ? "" : " panel__body--flush"}`}>
        {children}
      </div>
    </section>
  );
}
