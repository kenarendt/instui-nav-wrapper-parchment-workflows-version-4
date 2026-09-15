import { useRef, useState } from "react";
import { BadgeCheck, Check } from "lucide-react";
import PlatformServicesMark from "./PlatformServicesMark.jsx";
import { iconFor } from "./blocks/serviceIcons.js";
import CanvasLogo from "./CanvasLogo.jsx";
import MasteryLogo from "./MasteryLogo.jsx";
import useDismissOnOutside from "../hooks/useDismissOnOutside.js";
import { useBrowser } from "../browser/BrowserContext.jsx";
import { destinations, LEARNER_DESTINATION } from "../data/experiences.js";
import "./ServiceSwitcher.css";

/**
 * ServiceSwitcher — moves between everything this account can reach, from the
 * page top-right.
 *
 * Version 4 has no hub screen, so this is the only way across the platform. It
 * sits in the page header actions rather than the nav rail because the rail is
 * scoped to the service you are in: its items are that service's items, and a
 * control that leaves the service does not belong among them. Putting it beside
 * the other page-level controls also keeps it in the same place on every
 * screen, which is the whole point of a flat architecture.
 *
 * It switches the current tab in place. Moving between services is traversal
 * within one window, not a reason to accumulate tabs, so the tab strip only
 * grows when the user deliberately opens something in a new tab.
 *
 * The button hides itself when the account has one destination. A control whose
 * menu offers only the page you are already on teaches the user nothing.
 *
 * The learner experience sits under its own heading rather than in the same
 * list as the admin services. It is the user's own record, not work they do on
 * behalf of a school, and an admin moving to it is changing hats — worth a beat
 * of separation, without making it look like a lesser destination.
 */
export default function ServiceSwitcher() {
  const { session, activeTab, navigateTab } = useBrowser();
  const [open, setOpen] = useState(false);
  const btnRef = useRef(null);
  const menuRef = useRef(null);

  useDismissOnOutside(open, () => setOpen(false), [btnRef, menuRef], btnRef);

  const all = destinations(session);
  // Nothing to switch between: one destination means this control can only
  // point at the current page.
  if (all.length < 2) return null;

  // Which destination the tab is already on, so the menu can mark it. Every
  // kind that is a destination has to be listed here, or the menu offers the
  // page you are standing on as somewhere to go.
  const CURRENT_BY_KIND = {
    service: () => activeTab.params?.serviceId,
    parchmentCredentials: () => LEARNER_DESTINATION.id,
    product: () => activeTab.params?.productId,
  };
  const currentId = activeTab ? CURRENT_BY_KIND[activeTab.kind]?.() : undefined;
  const current = all.find((d) => d.id === currentId);

  const adminItems = all.filter((d) => d.group === "admin");
  const learnerItems = all.filter((d) => d.group === "learner");
  const productItems = all.filter((d) => d.group === "product");

  const go = (destination) => {
    setOpen(false);
    if (destination.id === currentId) return;
    if (activeTab) navigateTab(activeTab.id, destination.tab());
  };

  const renderItem = (destination) => {
    const selected = destination.id === currentId;
    const Icon = destination.icon ? iconFor(destination.icon) : null;
    const ProductLogo =
      destination.id === "canvas"
        ? CanvasLogo
        : destination.id === "mastery"
          ? MasteryLogo
          : null;
    return (
      <li key={destination.id}>
        <button
          type="button"
          role="menuitem"
          className={`svcsw__item${selected ? " svcsw__item--selected" : ""}`}
          aria-current={selected ? "true" : undefined}
          onClick={() => go(destination)}
        >
          <span className="svcsw__item-icon" aria-hidden="true">
            {ProductLogo ? (
              <ProductLogo size={20} color="currentColor" />
            ) : Icon ? (
              <Icon size={20} strokeWidth={2} />
            ) : (
              <BadgeCheck size={20} strokeWidth={2} />
            )}
          </span>
          <span className="svcsw__item-name">{destination.name}</span>
          {selected && (
            <Check
              size={18}
              strokeWidth={2.5}
              className="svcsw__item-check"
              aria-hidden="true"
            />
          )}
        </button>
      </li>
    );
  };

  return (
    <div className="svcsw">
      <button
        ref={btnRef}
        type="button"
        className={`icon-btn icon-btn--secondary svcsw__trigger${
          open ? " svcsw__trigger--open" : ""
        }`}
        // Named for what it opens and where you are, so screen reader users get
        // the same orientation the check mark gives sighted users.
        aria-label={
          current
            ? `Platform services. Currently in ${current.name}`
            : "Platform services"
        }
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
      >
        <PlatformServicesMark size={20} />
      </button>

      {open && (
        <div
          ref={menuRef}
          className="svcsw__menu"
          role="menu"
          aria-label="Switch service"
        >
          {/* No "currently in" header. The school switcher has one because it
              leaves the current school out of its list; this menu lists the
              current service and marks it, so a header would say the same
              thing twice in a menu five rows long. */}
          <ul className="svcsw__list">{adminItems.map(renderItem)}</ul>

          {learnerItems.length > 0 && (
            <div className="svcsw__group" role="group" aria-labelledby="svcsw-learner">
              <p className="svcsw__group-label" id="svcsw-learner">
                Parchment Learner Account
              </p>
              <ul className="svcsw__list">{learnerItems.map(renderItem)}</ul>
            </div>
          )}

          {productItems.map((d) => (
            <div className="svcsw__group" key={d.id}>
              <ul className="svcsw__list">{renderItem(d)}</ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
