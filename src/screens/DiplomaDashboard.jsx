import {
  LayoutDashboard,
  CalendarClock,
  Settings,
  Rocket,
  MonitorSmartphone,
  ArrowRight,
} from "lucide-react";
import Wrapper from "../components/Wrapper.jsx";
import Panel from "../components/blocks/Panel.jsx";
import Button from "../components/Button.jsx";
import MetricStat from "../components/blocks/MetricStat.jsx";
import AINote from "../components/blocks/AINote.jsx";
import { account } from "../data/experiences.js";
import "./DiplomaDashboard.css";

const NAV_ITEMS = [
  { key: "dashboard", label: "Dashboard", Icon: LayoutDashboard, active: true },
  { key: "issue-events", label: "Issue events", Icon: CalendarClock },
  { key: "settings", label: "Settings", Icon: Settings },
];

const METRICS = [
  { value: "24", label: "Unmatched credentials", hint: "Credentials that are not matched to a learner record." },
  { value: "2%", label: "Unmatched accounts", hint: "Parchment accounts that are not tied to a learner record." },
  { value: "6%", label: "Unverified", hint: "Learner records with verified IDs." },
];

export default function DiplomaDashboard() {
  const trailing = (
    <Panel title="New Issue Event" className="dpl-nie" showMenu>
      <p className="dpl-nie__sub">Create a new issue event to notify users.</p>
      <div className="dpl-nie__art" aria-hidden="true">
        <MonitorSmartphone size={72} strokeWidth={1.25} />
      </div>
      <p className="dpl-nie__caption">Upload data and issue credentials.</p>
      <Button variant="primary">Issue new credentials</Button>
    </Panel>
  );

  return (
    <Wrapper
      navProps={{
        institutionName: account.institution,
        username: account.name,
        userRole: account.adminRole,
        items: NAV_ITEMS,
        productLogo: "parchment",
      }}
      experienceType="admin"
      serviceId="diploma"
      title="Diploma Services Dashboard"
      actions={
        <>
          <Button variant="secondary">Customize Dashboard</Button>
        </>
      }
      trailing={trailing}
    >
      {/* Workspace */}
      <Panel title="Workspace" showMenu>
        <div className="dpl-row">
          <span className="dpl-stat" aria-hidden="true">4</span>
          <div className="dpl-row__body">
            <h3 className="dpl-row__title">Scheduled issue events</h3>
            <p className="dpl-row__desc">Credentials queued up for issuance.</p>
          </div>
          <div className="dpl-row__actions">
            <Button variant="tertiary">View issue events</Button>
          </div>
        </div>

        <div className="dpl-row dpl-row--divided">
          <span className="dpl-stat" aria-hidden="true">1</span>
          <div className="dpl-row__body">
            <h3 className="dpl-row__title">In progress</h3>
            <p className="dpl-row__desc">Issue events in progress (not issued yet)</p>
          </div>
          <div className="dpl-row__actions">
            <Button variant="tertiary">View issue event</Button>
          </div>
        </div>

        <div className="dpl-row dpl-row--divided">
          <span className="dpl-illus" aria-hidden="true">
            <Rocket size={40} strokeWidth={1.5} />
          </span>
          <div className="dpl-row__body">
            <h3 className="dpl-row__title">187 ready to issue</h3>
            <p className="dpl-row__desc">187 learner records ready to go!</p>
          </div>
          <div className="dpl-row__actions">
            <Button variant="tertiary">Edit</Button>
            <Button variant="secondary">Issue now</Button>
          </div>
        </div>
      </Panel>

      {/* Metrics */}
      <Panel title="Metrics" subtitle="Source: Parchment Admin Analytics" showMenu>
        <div className="dpl-metrics">
          {METRICS.map((m, i) => (
            <MetricStat key={i} label={m.label} value={m.value} hint={m.hint} />
          ))}
        </div>
        <AINote input>
          Ask about more data insights or for help cleaning up unmatched credentials and accounts
        </AINote>
        <div className="dpl-foot">
          <span className="dpl-foot__meta">Updated 2h ago</span>
          <button className="dpl-foot__link">
            View Details <ArrowRight size={14} strokeWidth={2} />
          </button>
        </div>
      </Panel>
    </Wrapper>
  );
}
