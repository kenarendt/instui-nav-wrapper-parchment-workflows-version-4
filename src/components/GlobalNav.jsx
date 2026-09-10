import { useRef, useState } from "react";
import {
  LayoutDashboard,
  BookText,
  CalendarDays,
  Inbox,
  Clock,
  CircleHelp,
  Plus,
  PanelLeftOpen,
  PanelLeftClose,
  ChevronsUpDown,
  User,
  Bell,
  Settings,
  LogOut,
  Moon,
  ALargeSmall,
  Contrast,
  SlidersHorizontal,
} from "lucide-react";
import CanvasLogo from "./CanvasLogo.jsx";
import SchoolCrest from "./SchoolCrest.jsx";
import Toggle from "./Toggle.jsx";
import useDismissOnOutside from "../hooks/useDismissOnOutside.js";
import { account } from "../data/experiences.js";
import "./GlobalNav.css";

const DEFAULT_ITEMS = [
  { key: "dashboard", label: "Dashboard", Icon: LayoutDashboard, active: true },
  { key: "courses", label: "Courses", Icon: BookText },
  { key: "calendar", label: "Calendar", Icon: CalendarDays },
  { key: "inbox", label: "Inbox", Icon: Inbox, badge: 9 },
  { key: "history", label: "History", Icon: Clock },
  { key: "help", label: "Help", Icon: CircleHelp },
];

function Avatar({ kind, initials }) {
  if (kind === "learner") {
    return (
      <span className="gnav__avatar gnav__avatar--photo" aria-hidden="true">
        <User size={16} strokeWidth={2} />
      </span>
    );
  }
  return (
    <span className="gnav__avatar gnav__avatar--pp" aria-hidden="true">
      {initials}
    </span>
  );
}

export default function GlobalNav({
  institutionName = account.institution,
  logo,
  username = account.name,
  userRole = account.learnerRole,
  items = DEFAULT_ITEMS,
  showAdd = false,
  productLogo = "canvas",
  // Opens platform-level settings. Lives in the account menu because it
  // configures the account across every service rather than anything inside
  // the service on screen.
  onPlatformSettings,
  // Quick school switching from the institution mark. `schools` is every
  // school this admin can act for inside the service on screen; picking one
  // switches the page to it.
  schools = [],
  currentSchoolId,
  onSelectSchool,
  onLogout,
}) {
  const [expanded, setExpanded] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [schoolOpen, setSchoolOpen] = useState(false);
  const schoolBtnRef = useRef(null);
  const schoolMenuRef = useRef(null);

  // Other schools this admin can switch to. The one they're in is named in
  // the menu's header rather than listed, since choosing it would do nothing.
  const otherSchools = schools.filter((s) => s.id !== currentSchoolId);
  const canSwitchSchool = Boolean(onSelectSchool) && otherSchools.length > 0;

  useDismissOnOutside(
    schoolOpen,
    () => setSchoolOpen(false),
    [schoolBtnRef, schoolMenuRef],
    schoolBtnRef
  );

  const initials = username
    .split(" ")
    .map((n) => n.charAt(0))
    .join("");

  const openAccount = () => {
    setExpanded(true);
    setAccountOpen(true);
  };

  const closeAccount = () => {
    setAccountOpen(false);
  };

  const toggleExpanded = () => {
    setExpanded((e) => {
      if (e) closeAccount();
      return !e;
    });
  };

  return (
    <nav
      className={`gnav${expanded ? " gnav--expanded" : ""}`}
      aria-label="Global"
    >
      <div className="gnav__rail">
        {/* Top-right collapse toggle (expanded rail only; hidden while the
            account panel is open, which carries its own toggle) */}
        {expanded && !accountOpen && (
          <button
            className="gnav__toggle"
            aria-label="Collapse sidebar"
            onClick={toggleExpanded}
          >
            <PanelLeftClose size={20} strokeWidth={2} />
          </button>
        )}

        {/* Institution logo. On a service page where the admin covers several
            schools it doubles as the school switcher: the mark already says
            which school you are in, so it is the natural place to change it. */}
        {canSwitchSchool ? (
          <>
            <button
              ref={schoolBtnRef}
              className={`gnav__institution gnav__institution--switch${
                schoolOpen ? " gnav__institution--open" : ""
              }`}
              title={`${institutionName} — switch school`}
              aria-label={`School: ${institutionName}. Switch school`}
              aria-haspopup="menu"
              aria-expanded={schoolOpen}
              onClick={() => setSchoolOpen((o) => !o)}
            >
              <span className="gnav__avatar gnav__avatar--rect" aria-hidden="true">
                {logo || <SchoolCrest size={40} />}
              </span>
              {expanded && (
                <>
                  <span className="gnav__institution-name">{institutionName}</span>
                  <ChevronsUpDown
                    size={16}
                    strokeWidth={2}
                    className="gnav__institution-caret"
                    aria-hidden="true"
                  />
                </>
              )}
            </button>
            {schoolOpen && (
              <div
                ref={schoolMenuRef}
                className="gnav__schoolmenu"
                role="menu"
                aria-label="Switch school"
              >
                <div className="gnav__schoolmenu-head">
                  <span className="gnav__schoolmenu-label">Current school</span>
                  <span className="gnav__schoolmenu-current">
                    {institutionName}
                  </span>
                </div>
                {otherSchools.map((s) => (
                  <button
                    key={s.id}
                    role="menuitem"
                    className="gnav__schoolmenu-item"
                    onClick={() => {
                      onSelectSchool(s);
                      setSchoolOpen(false);
                    }}
                  >
                    <span className="gnav__schoolmenu-crest" aria-hidden="true">
                      <SchoolCrest size={28} variant={s.crest} />
                    </span>
                    <span className="gnav__schoolmenu-name">{s.name}</span>
                  </button>
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="gnav__institution" title={institutionName}>
            <span className="gnav__avatar gnav__avatar--rect" aria-hidden="true">
              {logo || <SchoolCrest size={40} />}
            </span>
            {expanded && (
              <span className="gnav__institution-name">{institutionName}</span>
            )}
          </div>
        )}

        {/* Account item — opens the Account panel */}
        <button
          className={`gnav__account${accountOpen ? " gnav__account--active" : ""}`}
          title={username}
          aria-label={`Account: ${username}`}
          aria-expanded={accountOpen}
          onClick={() => (accountOpen ? closeAccount() : openAccount())}
        >
          <Avatar kind="pp" initials={initials} />
          {expanded && (
            <span className="gnav__account-data">
              <span className="gnav__account-name">{username}</span>
              <span className="gnav__account-role">{userRole}</span>
            </span>
          )}
        </button>

        {/* Primary navigation items */}
        <ul className="gnav__items">
          {items.map(({ key, label, Icon, active, badge, onClick }) => (
            <li key={key}>
              <button
                className={`gnav__item${active ? " gnav__item--active" : ""}`}
                aria-label={label}
                aria-current={active ? "page" : undefined}
                onClick={onClick}
              >
                <span className="gnav__iconwrap">
                  <Icon size={24} strokeWidth={2} />
                  {badge != null && <span className="gnav__badge">{badge}</span>}
                </span>
                {expanded && <span className="gnav__item-label">{label}</span>}
              </button>
            </li>
          ))}
          {showAdd && (
            <li>
              <button className="gnav__item" aria-label="Add">
                <span className="gnav__iconwrap">
                  <Plus size={24} strokeWidth={2} />
                </span>
                {expanded && <span className="gnav__item-label">Add</span>}
              </button>
            </li>
          )}
        </ul>

        {/* Collapse control (bottom) */}
        <button
          className="gnav__collapse"
          aria-label={expanded ? "Collapse sidebar" : "Expand sidebar"}
          onClick={toggleExpanded}
        >
          {expanded ? (
            <>
              <PanelLeftClose size={20} strokeWidth={2} />
              <span className="gnav__collapse-label">Collapse sidebar</span>
            </>
          ) : (
            <PanelLeftOpen size={20} strokeWidth={2} />
          )}
        </button>

        {/* Product logo */}
        <div className="gnav__product">
          {productLogo === "canvas" ? (
            <CanvasLogo size={24} />
          ) : productLogo === "parchment" ? (
            <span className="gnav__product-lockup">
              <span className="gnav__product-mark" aria-hidden="true" />
              {expanded && <span className="gnav__product-name">Parchment</span>}
            </span>
          ) : (
            <span className="gnav__product-i" aria-hidden="true">
              I<span className="gnav__product-dot">.</span>
            </span>
          )}
        </div>
      </div>

      {/* ---------- Account flyout panel ---------- */}
      {accountOpen && (
        <div className="gnav__panel" role="dialog" aria-label="Account">
          <div className="gnav__panel-head">
            <h2 className="gnav__panel-title">Account</h2>
            <button
              className="gnav__toggle gnav__toggle--panel"
              aria-label="Close account panel"
              onClick={closeAccount}
            >
              <PanelLeftClose size={20} strokeWidth={2} />
            </button>
          </div>

          {/* Profile card. Identity only — the experience switcher that used
              to live here is gone, so there is no caret and nothing to open. */}
          <div className="gnav__profile">
            <div className="gnav__profile-card gnav__profile-card--static">
              <span className="gnav__profile-text">
                <span className="gnav__profile-name">{username}</span>
                <span className="gnav__profile-email">{account.email}</span>
                <span className="gnav__profile-badge">{userRole}</span>
              </span>
            </div>
          </div>

          {/* Account menu. Platform Services used to sit at the top of this
              list; the services switcher in the page header replaced it, and
              "Change schools" went with the school selection screen. Platform
              Settings follows Account Settings because both configure the
              account rather than the work on screen — one at platform level,
              one at user level. */}
          <ul className="gnav__panel-menu">
            <li>
              <button className="gnav__panel-link">
                <User size={20} strokeWidth={2} /> Profile
              </button>
            </li>
            <li>
              <button className="gnav__panel-link">
                <Bell size={20} strokeWidth={2} /> Notifications
              </button>
            </li>
            <li>
              <button className="gnav__panel-link">
                <Settings size={20} strokeWidth={2} /> Account Settings
              </button>
            </li>
            {onPlatformSettings && (
              <li>
                <button
                  className="gnav__panel-link"
                  onClick={() => {
                    onPlatformSettings();
                    closeAccount();
                  }}
                >
                  <SlidersHorizontal size={20} strokeWidth={2} /> Platform
                  Settings
                </button>
              </li>
            )}
          </ul>

          {/* User interface controls */}
          <div className="gnav__panel-ui">
            <p className="gnav__panel-section">User interface</p>
            <div className="gnav__ui-row">
              <span className="gnav__ui-label">
                <Moon size={20} strokeWidth={2} /> Dark mode
              </span>
              <Toggle label="Dark mode" />
            </div>
            <div className="gnav__ui-row">
              <span className="gnav__ui-label">
                <ALargeSmall size={20} strokeWidth={2} /> Use dyslexia friendly font
              </span>
              <Toggle label="Use dyslexia friendly font" />
            </div>
            <div className="gnav__ui-row">
              <span className="gnav__ui-label">
                <Contrast size={20} strokeWidth={2} /> Use high contrast UI
              </span>
              <Toggle label="Use high contrast UI" />
            </div>
            <button className="gnav__logout" onClick={() => onLogout?.()}>
              <LogOut size={20} strokeWidth={2} /> Log out
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
