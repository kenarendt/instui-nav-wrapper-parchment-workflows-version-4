import {
  LayoutDashboard,
  Contact,
  Settings,
  UserPlus,
  Building2,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import Wrapper from "../components/Wrapper.jsx";
import Panel from "../components/blocks/Panel.jsx";
import Button from "../components/Button.jsx";
import MetricStat from "../components/blocks/MetricStat.jsx";
import AINote from "../components/blocks/AINote.jsx";
import { account } from "../data/experiences.js";
import "./DualEnrollmentDashboard.css";

const NAV_ITEMS = [
  { key: "dashboard", label: "Dashboard", Icon: LayoutDashboard, active: true },
  { key: "learners", label: "Learners", Icon: Contact },
  { key: "settings", label: "Settings", Icon: Settings },
];

const METRICS = [
  { label: "Applications approved", value: "258", hint: "3 partner schools" },
  { label: "Applications denied", value: "58", hint: "12% deny rate" },
  { label: "Dropped courses", value: "81", hint: "18% drop rate" },
];

const ACTIVE_WORKFLOWS = [
  "Learner Self Registration",
  "College Initiated Enrollment",
  "HS Counselor Initiated Enrollment",
];

export default function DualEnrollmentDashboard() {
  const trailing = (
    <Panel title="Workflow configurations" className="due-wf" showMenu>
      <p className="due-wf__sub">Configure and manage learner and admin workflows.</p>
      <div className="due-wf__art" aria-hidden="true">
        <span className="due-badge">
          <Building2 size={36} strokeWidth={1.5} />
        </span>
      </div>
      <p className="due-wf__label">Active workflows:</p>
      <div className="due-wf__pills">
        {ACTIVE_WORKFLOWS.map((w) => (
          <span key={w} className="due-wfpill">
            <CheckCircle2 size={16} strokeWidth={2} /> {w}
          </span>
        ))}
      </div>
      <Button variant="tertiary">Manage workflow engine</Button>
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
      serviceId="dualEnrollment"
      title="Dual Enrollment Dashboard"
      actions={
        <>
          <Button variant="secondary">Customize Dashboard</Button>
        </>
      }
      trailing={trailing}
    >
      {/* Workspace */}
      <Panel title="Workspace" showMenu>
        <div className="due-row">
          <span className="due-stat" aria-hidden="true">3</span>
          <div className="due-row__body">
            <h3 className="due-row__title">New applications received</h3>
            <p className="due-row__desc">Applications that require your approval.</p>
          </div>
          <div className="due-row__actions">
            <Button variant="primary">Approve applications</Button>
          </div>
        </div>

        <div className="due-row due-row--divided">
          <span className="due-illus" aria-hidden="true">
            <span className="due-badge">
              <UserPlus size={30} strokeWidth={1.5} />
            </span>
          </span>
          <div className="due-row__body">
            <h3 className="due-row__title">Invite learners</h3>
            <p className="due-row__desc">Invite learners to explore and select available courses.</p>
          </div>
          <div className="due-row__actions">
            <Button variant="secondary">Invite learners</Button>
          </div>
        </div>
      </Panel>

      {/* Metrics */}
      <Panel title="Metrics" subtitle="Source: Parchment Admin Analytics" showMenu>
        <div className="due-metrics">
          {METRICS.map((m, i) => (
            <MetricStat key={i} label={m.label} value={m.value} hint={m.hint} />
          ))}
        </div>
        <AINote input>
          Ask about more data insights or for help cleaning up unmatched credentials and accounts
        </AINote>
        <div className="due-foot">
          <span className="due-foot__meta">Updated 2h ago</span>
          <button className="due-foot__link">
            View Details <ArrowRight size={14} strokeWidth={2} />
          </button>
        </div>
      </Panel>
    </Wrapper>
  );
}
