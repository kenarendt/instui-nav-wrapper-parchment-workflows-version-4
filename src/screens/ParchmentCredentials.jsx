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
  ALL_DONUT,
} from "../data/credentials.js";
import "./ParchmentCredentials.css";

/**
 * The dashboard shows one school at a time, so the two views that span schools
 * are nav items rather than tabs. Neither belongs to a school: "All
 * credentials" is the flat list across every school, and "Other badges" is
 * what the learner earned outside any of them. Putting them beside My Records
 * groups them correctly — things the learner owns, one level up from any single
 * school.
 */
const NAV_ITEMS = [
  { key: "dashboard", label: "Dashboard", Icon: LayoutDashboard },
  { key: "records", label: "My Records", Icon: FileStack },
  { key: "allCredentials", label: "All Credentials", Icon: ScrollText },
  { key: "otherBadges", label: "Other Badges", Icon: Award },
  { key: "orders", label: "Orders", Icon: Receipt },
  { key: "settings", label: "Settings", Icon: Settings },
];

const THUMB_ICON = {
  diploma: FileText,
  verification: ShieldCheck,
  certificate: Award,
};

function CredentialRow({ cred, showSchool }) {
  const Icon = THUMB_ICON[cred.thumb] || FileText;
  return (
    <div className="cred-row">
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

function BadgeRow({ badge }) {
  return (
    <div className="cred-row">
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

  // ── Cross-school pages ───────────────────────────────────────────
  // These two used to be tabs beside the schools, which put them inside a
  // control that otherwise meant "which school". Neither belongs to a school,
  // so both became pages in the nav rail. They carry no school band and no
  // switcher, which is the honest signal that they are not school-scoped.
  if (page === "allCredentials" || page === "otherBadges") {
    const isBadges = page === "otherBadges";
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
        title={isBadges ? "Other badges" : "All credentials"}
        description={
          isBadges
            ? "Badges you've earned outside of your schools."
            : "Everything you've earned, across every school you've connected."
        }
        trailing={
          !isBadges && (
            <Panel
              title="Credentials"
              subtitle="The types of credentials you've earned"
              showMenu
            >
              <DonutChart
                segments={ALL_DONUT.segments}
                centerLabel={ALL_DONUT.total}
              />
              <div className="pc-center pc-collection">
                <Button variant="secondary">Create a collection</Button>
              </div>
            </Panel>
          )
        }
      >
        {/* No panel title: the page heading directly above already names this,
            and a panel is the only thing on the page. The subtitle earns its
            place by saying something the heading does not. */}
        <Panel
          subtitle={
            isBadges
              ? "Issued by organizations other than your schools."
              : "Sorted with the most recent first."
          }
          showMenu
        >
          <div className="cred-list">
            {isBadges
              ? OTHER_BADGES.map((b, i) => <BadgeRow key={i} badge={b} />)
              : allCredentials().map((c, i) => (
                  <CredentialRow key={i} cred={c} showSchool />
                ))}
          </div>
        </Panel>
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
      title="Parchment Credentials"
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
