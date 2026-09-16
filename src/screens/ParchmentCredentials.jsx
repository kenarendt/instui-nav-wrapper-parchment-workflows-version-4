import { useState } from "react";
import {
  LayoutDashboard,
  FileStack,
  Receipt,
  ScrollText,
  Settings,
  Plus,
  ChevronRight,
  ArrowRight,
  CalendarDays,
  FileText,
  ShieldCheck,
  Award,
  BadgeCheck,
  X,
} from "lucide-react";
import Wrapper from "../components/Wrapper.jsx";
import Panel from "../components/blocks/Panel.jsx";
import Button from "../components/Button.jsx";
import Select from "../components/Select.jsx";
import DonutChart from "../components/blocks/DonutChart.jsx";
import AINote from "../components/blocks/AINote.jsx";
import RecordCard from "../components/blocks/RecordCard.jsx";
import ListControls from "../components/blocks/ListControls.jsx";
import RecordDetail from "./RecordDetail.jsx";
import ShareModal from "../components/ShareModal.jsx";
import CreateRecordFlow from "../components/CreateRecordFlow.jsx";
import CredentialMark from "../components/CredentialMark.jsx";
import { account } from "../data/experiences.js";
import { useBrowser } from "../browser/BrowserContext.jsx";
import { RECORDS } from "../data/records.js";
import {
  SCHOOLS,
  OTHER_BADGES,
  allCredentials,
  donutFor,
} from "../data/credentials.js";
import "./ParchmentCredentials.css";

/**
 * The dashboard shows one school at a time, so the view that spans schools is a
 * nav item rather than a tab. "All Credentials" is the flat list across every
 * school, and the badges earned outside any school are a second section on that
 * same page rather than a page of their own — a learner comparing what they
 * hold wants it in one place, and four badges did not carry a nav item.
 */
const NAV_ITEMS = [
  { key: "dashboard", label: "Dashboard", Icon: LayoutDashboard },
  { key: "records", label: "My Records", Icon: FileStack },
  { key: "allCredentials", label: "All Credentials", Icon: ScrollText },
  { key: "orders", label: "Orders", Icon: Receipt },
  { key: "settings", label: "Settings", Icon: Settings },
];

const CRED_SORTS = [
  { value: "recent", label: "Most recently earned" },
  { value: "name", label: "Name (A–Z)" },
  { value: "type", label: "Credential type (A–Z)" },
];

/* Badges are all one type, so sorting by type would do nothing. Issuer is the
   dimension that actually varies across them. */
const BADGE_SORTS = [
  { value: "recent", label: "Most recently earned" },
  { value: "name", label: "Name (A–Z)" },
  { value: "issuer", label: "Issuer (A–Z)" },
];

const SORTERS = {
  recent: (a, b) => b.earned.localeCompare(a.earned),
  name: (a, b) => a.title.localeCompare(b.title),
  type: (a, b) => (a.type ?? "").localeCompare(b.type ?? "") || a.title.localeCompare(b.title),
  issuer: (a, b) => a.issuer.localeCompare(b.issuer) || a.title.localeCompare(b.title),
};

/** Distinct values of one field, in the order they first appear. */
function optionsFor(items, field) {
  return [...new Set(items.map((i) => i[field]))].map((v) => ({
    value: v,
    label: v,
  }));
}

const THUMB_ICON = {
  diploma: FileText,
  verification: ShieldCheck,
  certificate: Award,
  // School badges appear in the All Credentials list alongside credentials, so
  // they need a thumbnail there too — without this they fell back to the
  // document icon and read as paperwork.
  badge: BadgeCheck,
};

/**
 * SelectBox — the per-row checkbox on All Credentials.
 *
 * Named for the item it selects rather than "Select", because a list of
 * twenty-one identically named checkboxes is unusable to anyone reading them
 * one at a time.
 *
 * The title alone is not enough: a diploma and its verification share one
 * title, so the name also carries the type and where it came from. That is the
 * smallest addition that makes every checkbox on the page distinct.
 */
function selectLabel(item) {
  const kind = item.type ?? "Badge";
  const from = item.school ?? item.issuer;
  return `Select ${item.title}, ${kind} from ${from}`;
}

function SelectBox({ item, selected, onToggle }) {
  return (
    <label className="cred-row__select">
      <input
        type="checkbox"
        checked={selected}
        aria-label={selectLabel(item)}
        onChange={() => onToggle(item.id)}
      />
    </label>
  );
}

function CredentialRow({ cred, showSchool, selected, onToggle }) {
  const Icon = THUMB_ICON[cred.thumb] || FileText;
  return (
    <div className={`cred-row${selected ? " cred-row--selected" : ""}`}>
      {onToggle && (
        <SelectBox item={cred} selected={selected} onToggle={onToggle} />
      )}
      <div className="cred-row__thumb" aria-hidden="true">
        <Icon size={26} strokeWidth={1.5} />
      </div>
      <div className="cred-row__body">
        <p className="cred-row__type">{cred.type}</p>
        <p className="cred-row__title">{cred.title}</p>
        <p className="cred-row__issuer">{showSchool ? cred.school : cred.issuer}</p>
        <p className="cred-row__date">
          <CalendarDays size={14} strokeWidth={2} /> Acquired: {cred.date}
        </p>
      </div>
      <ChevronRight size={20} strokeWidth={2} className="cred-row__chevron" />
    </div>
  );
}

function BadgeRow({ badge, selected, onToggle }) {
  return (
    <div className={`cred-row${selected ? " cred-row--selected" : ""}`}>
      {onToggle && (
        <SelectBox item={badge} selected={selected} onToggle={onToggle} />
      )}
      <div className="cred-row__thumb cred-row__thumb--badge" aria-hidden="true">
        <BadgeCheck size={26} strokeWidth={1.5} />
      </div>
      <div className="cred-row__body">
        <p className="cred-row__title">{badge.title}</p>
        <p className="cred-row__issuer">
          <Award size={14} strokeWidth={2} /> {badge.issuer}
        </p>
        <p className="cred-row__date">
          <CalendarDays size={14} strokeWidth={2} /> Acquired: {badge.date}
        </p>
      </div>
      <ChevronRight size={20} strokeWidth={2} className="cred-row__chevron" />
    </div>
  );
}

function SchoolView({ school }) {
  return (
    <>
      {/* No identity header here any more. The school band above the page
          carries the crest, name, location and colour, so repeating it at the
          top of the first panel would say the same thing twice. */}
      {/* Neither panel names the school. The band directly above says it at
          heading size, so repeating it in every panel title turns the school
          name into wallpaper. */}
      <Panel
        title="Credentials"
        subtitle="Everything this school has issued to you."
        showMenu
      >
        <div className="cred-list">
          {school.credentials.map((c, i) => (
            <CredentialRow key={i} cred={c} />
          ))}
        </div>

        <h3 className="pc-subhead">Digital Badges</h3>
        <div className="cred-list">
          {school.badges.map((b, i) => (
            <BadgeRow key={i} badge={b} />
          ))}
        </div>

        <div className="pc-footer-row">
          <span className="pc-footer-text">
            View and manage all of your digital badges.
          </span>
          <button className="pc-link">
            View all <ArrowRight size={14} strokeWidth={2} />
          </button>
        </div>
      </Panel>

      <Panel title="Credential insights" subtitle="This year" showMenu>
        <div className="pc-insights">
          {school.insights.map((s, i) => (
            <div key={i} className="pc-insight">
              <span className="pc-insight__label">{s.label}</span>
              <span className="pc-insight__value">{s.value}</span>
              <span className="pc-insight__hint">{s.hint}</span>
            </div>
          ))}
        </div>
        <AINote input>
          Ask me things like, &ldquo;Who is looking at my credentials online?&rdquo;
        </AINote>
        <div className="pc-view-details">
          <button className="pc-link">
            View details <ArrowRight size={14} strokeWidth={2} />
          </button>
        </div>
      </Panel>
    </>
  );
}

export default function ParchmentCredentials() {
  // Which schools this learner has connected. The demo account carries two; an
  // account created through registration carries only the school it registered
  // through, which is what `session.learnerSchools` holds when it is set.
  const { session } = useBrowser();
  const schools = session?.learnerSchools?.length ? session.learnerSchools : SCHOOLS;

  const [page, setPage] = useState("dashboard");
  const [openedRecord, setOpenedRecord] = useState(null);
  const [shareOpen, setShareOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [records, setRecords] = useState(RECORDS);
  const [active, setActive] = useState(null);
  const [addOpen, setAddOpen] = useState(false);

  // All Credentials: what is on screen, and what the learner has picked out of
  // it. Filters start with everything selected — someone opening the page wants
  // all of their credentials, and narrowing is what the controls are for.
  const credItems = allCredentials(schools);
  const [credSchools, setCredSchools] = useState(() => [
    ...new Set(credItems.map((c) => c.school)),
  ]);
  const [credTypes, setCredTypes] = useState(() => [
    ...new Set(credItems.map((c) => c.type)),
  ]);
  const [credSort, setCredSort] = useState("recent");
  const [badgeIssuers, setBadgeIssuers] = useState(() => [
    ...new Set(OTHER_BADGES.map((b) => b.issuer)),
  ]);
  const [badgeSort, setBadgeSort] = useState("recent");

  // Selection spans both sections: a record can mix a diploma with a badge
  // earned somewhere else, so one set rather than one per section.
  const [selected, setSelected] = useState(() => new Set());
  const toggleSelected = (id) =>
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const navItems = NAV_ITEMS.map((item) => ({
    ...item,
    active: item.key === (openedRecord ? "records" : page),
    onClick: () => {
      setOpenedRecord(null);
      setPage(item.key);
    },
  }));

  // ── Record detail (drill-down) ───────────────────────────────────
  if (openedRecord) {
    return (
      <>
        <RecordDetail
          record={openedRecord}
          onBack={() => setOpenedRecord(null)}
          onShare={() => setShareOpen(true)}
        />
        {shareOpen && (
          <ShareModal recordTitle={openedRecord.title} onClose={() => setShareOpen(false)} />
        )}
      </>
    );
  }

  // ── My Records page ──────────────────────────────────────────────
  if (page === "records") {
    return (
      <Wrapper
        navProps={{
          logo: <CredentialMark size={40} />,
          institutionName: "Parchment",
          username: account.name,
          userRole: account.learnerRole,
          items: navItems,
          productLogo: "parchment",
        }}
        experienceType="learner"
        title="My records"
        description="Package your credentials and skills into records that tell a specific story and open new opportunities."
        actions={
          <Button variant="primary" icon={Plus} onClick={() => setCreateOpen(true)}>
            Create new record
          </Button>
        }
      >
        <div className="records-grid">
          {records.map((r) => (
            <RecordCard
              key={r.id}
              record={r}
              onOpen={() => setOpenedRecord(r)}
              onAction={(item) => {
                if (item === "Preview public view") setOpenedRecord(r);
              }}
            />
          ))}
        </div>

        {createOpen && (
          <CreateRecordFlow
            onClose={() => setCreateOpen(false)}
            onCreate={(rec) => {
              setRecords((list) => [rec, ...list]);
              setCreateOpen(false);
              setOpenedRecord(rec);
            }}
          />
        )}
      </Wrapper>
    );
  }

  // ── All Credentials ──────────────────────────────────────────────
  // One page for everything the learner holds: their schools' credentials and
  // badges in the first section, the badges they earned outside any school in
  // the second. It was two nav items; four outside badges did not carry a page
  // of their own, and a learner comparing what they hold wants it together.
  //
  // No school band and no school switcher here, which is the honest signal that
  // this page is not scoped to one school.
  if (page === "allCredentials") {
    const filtered = (items, filters, sortKey) =>
      items
        .filter((i) => filters.every(([field, allowed]) => allowed.includes(i[field])))
        .sort(SORTERS[sortKey]);

    const creds = filtered(
      credItems,
      [["school", credSchools], ["type", credTypes]],
      credSort
    );
    const badges = filtered(OTHER_BADGES, [["issuer", badgeIssuers]], badgeSort);

    return (
      <Wrapper
        navProps={{
          logo: <CredentialMark size={40} />,
          institutionName: "Parchment",
          username: account.name,
          userRole: account.learnerRole,
          items: navItems,
          productLogo: "parchment",
        }}
        experienceType="learner"
        title="All credentials"
        description="Everything you've earned, across every school you've connected."
        actions={
          <Button
            variant="primary"
            icon={Plus}
            disabled={selected.size === 0}
            onClick={() => setCreateOpen(true)}
          >
            {selected.size > 0
              ? `Create a record (${selected.size})`
              : "Create a record"}
          </Button>
        }
        trailing={
          <Panel
            title="Credential types"
            subtitle={
              creds.length === credItems.length
                ? "Everything you hold"
                : "Matching your filters"
            }
            showMenu
          >
            {/* Counted from the rows on screen, filters included, so the chart
                and the list can never disagree. */}
            <DonutChart {...donutFor(creds)} centerLabel={String(creds.length)} />
            <div className="pc-center pc-collection">
              <Button variant="secondary">Create a collection</Button>
            </div>
          </Panel>
        }
      >
        <Panel
          title="School credentials"
          subtitle="Issued by the schools you've connected."
          showMenu
        >
          <ListControls
            noun="credentials"
            shown={creds.length}
            total={credItems.length}
            filters={[
              {
                id: "cred-school",
                label: "School",
                options: optionsFor(credItems, "school"),
                selected: credSchools,
                onChange: setCredSchools,
              },
              {
                id: "cred-type",
                label: "Type",
                options: optionsFor(credItems, "type"),
                selected: credTypes,
                onChange: setCredTypes,
              },
            ]}
            sort={{ value: credSort, options: CRED_SORTS, onChange: setCredSort }}
          />
          {creds.length === 0 ? (
            <p className="pc-muted">
              No credentials match these filters. Widen the school or type
              filter to see more.
            </p>
          ) : (
            <div className="cred-list">
              {creds.map((c) => (
                <CredentialRow
                  key={c.id}
                  cred={c}
                  showSchool
                  selected={selected.has(c.id)}
                  onToggle={toggleSelected}
                />
              ))}
            </div>
          )}
        </Panel>

        <Panel
          title="Other badges"
          subtitle="Issued by organizations other than your schools."
          showMenu
        >
          <ListControls
            noun="badges"
            shown={badges.length}
            total={OTHER_BADGES.length}
            filters={[
              {
                id: "badge-issuer",
                label: "Issuer",
                options: optionsFor(OTHER_BADGES, "issuer"),
                selected: badgeIssuers,
                onChange: setBadgeIssuers,
              },
            ]}
            sort={{ value: badgeSort, options: BADGE_SORTS, onChange: setBadgeSort }}
          />
          {badges.length === 0 ? (
            <p className="pc-muted">
              No badges match this filter. Widen the issuer filter to see more.
            </p>
          ) : (
            <div className="cred-list">
              {badges.map((b) => (
                <BadgeRow
                  key={b.id}
                  badge={b}
                  selected={selected.has(b.id)}
                  onToggle={toggleSelected}
                />
              ))}
            </div>
          )}
        </Panel>

        {createOpen && (
          <CreateRecordFlow
            onClose={() => setCreateOpen(false)}
            onCreate={(rec) => {
              setRecords((list) => [rec, ...list]);
              setCreateOpen(false);
              setSelected(new Set());
              setPage("records");
              setOpenedRecord(rec);
            }}
          />
        )}
      </Wrapper>
    );
  }

  // ── Orders / Settings placeholders ───────────────────────────────
  if (page === "orders" || page === "settings") {
    const label = page === "orders" ? "Orders" : "Settings";
    return (
      <Wrapper
        navProps={{
          logo: <CredentialMark size={40} />,
          institutionName: "Parchment",
          username: account.name,
          userRole: account.learnerRole,
          items: navItems,
          productLogo: "parchment",
        }}
        experienceType="learner"
        title={label}
        description="This section is coming soon."
      >
        <Panel title={label}>
          <p className="pc-muted">Content for {label} is not part of this prototype yet.</p>
        </Panel>
      </Wrapper>
    );
  }

  // The dashboard is always one school. Which one is this page's own state, so
  // it is handed to the shell as a schoolContext rather than derived there.
  const activeSchool = schools.find((s) => s.id === active) ?? schools[0];

  const main = <SchoolView school={activeSchool} />;

  const trailing = (
    <>
      {activeSchool && (
        <Panel title="Order Credentials" showMenu>
          <p className="pc-muted">
            Send or collect academic credentials from {activeSchool.name}
          </p>
          <div className="pc-order-primary">
            <Button variant="primary">Order your transcript</Button>
          </div>
          <p className="pc-muted pc-center">
            {activeSchool.name} also offers other credentials, such as:
          </p>
          <div className="pc-pills">
            {activeSchool.orderPills.map((p) => (
              <span key={p} className="pc-pill">{p}</span>
            ))}
            <span className="pc-pill pc-pill--more">… and more!</span>
          </div>
          <div className="pc-order-secondary">
            <Button variant="secondary">Order now</Button>
          </div>
        </Panel>
      )}

      <Panel title="Credentials" subtitle="The types of credentials you've earned" showMenu>
        <DonutChart
          segments={activeSchool.donut.segments}
          centerLabel={activeSchool.donut.total}
        />
        <div className="pc-center pc-collection">
          <Button variant="secondary">Create a collection</Button>
        </div>
      </Panel>

      {activeSchool && (
        <Panel title="Directory" showMenu>
          <Select
            id="dir-category"
            label="Category"
            value="advisors"
            onChange={() => {}}
            options={[{ value: "advisors", label: "Administrators and advisors" }]}
          />
          <p className="pc-dir-school">{activeSchool.name}</p>
          <ul className="pc-people">
            {activeSchool.directory.map((p) => (
              <li key={p.name} className="pc-person">
                <span className="pc-person__avatar">{p.initials}</span>
                <span className="pc-person__body">
                  <span className="pc-person__name">{p.name}</span>
                  <span className="pc-person__role">{p.role}</span>
                </span>
                <ChevronRight size={18} strokeWidth={2} className="cred-row__chevron" />
              </li>
            ))}
          </ul>
        </Panel>
      )}
    </>
  );

  return (
    <Wrapper
      navProps={{
        username: account.name,
        userRole: account.learnerRole,
        items: navItems,
        productLogo: "parchment",
      }}
      experienceType="learner"
      // Same shape the admin dashboards resolve to, so the learner gets the
      // same band and the same switcher on the nav mark. Adding a school is the
      // one thing only this side offers, and it rides in the same menu: someone
      // with that menu open is already deciding which school.
      schoolContext={{
        school: activeSchool,
        schools,
        onSelect: (picked) => setActive(picked.id),
        onAdd: () => setAddOpen(true),
      }}
      title="Parchment Credential Dashboard"
      actions={
        <>
          <Button variant="secondary">Customize Dashboard</Button>
        </>
      }
      trailing={trailing}
    >
      {main}

      {addOpen && (
        <div className="pc-modal" role="dialog" aria-modal="true" aria-label="Add another school">
          <div className="pc-modal__box">
            <div className="pc-modal__head">
              <h2 className="pc-modal__title">Add another school</h2>
              <button className="panel__menu" aria-label="Close" onClick={() => setAddOpen(false)}>
                <X size={20} strokeWidth={2} />
              </button>
            </div>
            <p className="pc-muted">
              Search for a school or institution to connect and collect the
              credentials you&rsquo;ve earned there.
            </p>
            <div className="pc-modal__field">
              <input className="text-input" placeholder="Search schools and institutions" />
            </div>
            <div className="pc-modal__actions">
              <Button variant="secondary" onClick={() => setAddOpen(false)}>Cancel</Button>
              <Button variant="primary" onClick={() => setAddOpen(false)}>Add school</Button>
            </div>
          </div>
        </div>
      )}
    </Wrapper>
  );
}
