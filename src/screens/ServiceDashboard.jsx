import {
  LayoutDashboard,
  FileStack,
  User,
  Settings,
  PlusCircle,
  ArrowRight,
} from "lucide-react";
import Wrapper from "../components/Wrapper.jsx";
import Panel from "../components/blocks/Panel.jsx";
import Button from "../components/Button.jsx";
import StatTile from "../components/blocks/StatTile.jsx";
import LineChart from "../components/blocks/LineChart.jsx";
import DonutChart from "../components/blocks/DonutChart.jsx";
import AINote from "../components/blocks/AINote.jsx";
import ReceiveDashboard from "./ReceiveDashboard.jsx";
import DiplomaDashboard from "./DiplomaDashboard.jsx";
import DualEnrollmentDashboard from "./DualEnrollmentDashboard.jsx";
import { serviceById, account } from "../data/experiences.js";
import "./ServiceDashboard.css";

const NAV_ITEMS = [
  { key: "dashboard", label: "Dashboard", Icon: LayoutDashboard, active: true },
  { key: "orders", label: "Orders", Icon: FileStack },
  { key: "learners", label: "Learners", Icon: User },
  { key: "settings", label: "Settings", Icon: Settings },
];

const SERIES = [
  { label: "Orders", color: "#7f77dd", points: [20, 24, 30, 46, 62, 70, 66, 68, 65] },
  { label: "On Hold", color: "#0f7b74", points: [10, 12, 11, 14, 16, 18, 15, 17, 16] },
  { label: "Open Orders", color: "#273540", points: [6, 7, 8, 9, 10, 11, 10, 12, 11] },
];

function Row({ title, desc, action }) {
  return (
    <div className="svc-row">
      <div className="svc-row__body">
        <h3 className="svc-row__title">{title}</h3>
        <p className="svc-row__desc">{desc}</p>
      </div>
      {action}
    </div>
  );
}

export default function ServiceDashboard({ serviceId }) {
  if (serviceId === "receive") return <ReceiveDashboard />;
  if (serviceId === "diploma") return <DiplomaDashboard />;
  if (serviceId === "dualEnrollment") return <DualEnrollmentDashboard />;

  const service = serviceById(serviceId);
  if (!service) return null;
  const d = service.dashboard;

  const trailing = (
    <>
      <Panel title="Order a credential" subtitle="Order on behalf of learners" showMenu>
        <div className="svc-order">
          <div className="svc-order__art" aria-hidden="true">📄</div>
          <p className="svc-order__inst">{account.institution} offers:</p>
          <div className="svc-order__pills">
            {["Transcripts", "Diplomas", "Verifications", "And More!"].map((p) => (
              <span key={p} className="svc-pill">{p}</span>
            ))}
          </div>
          <button className="svc-configlink">Configure your storefront</button>
          <Button variant="secondary">Order now</Button>
        </div>
      </Panel>

      <Panel title="Order fulfillment" subtitle="This month" showMenu>
        <DonutChart segments={d.fulfillment.segments} centerLabel={d.fulfillment.total} />
        <AINote>
          This summary is powered by IgniteAI and reflects the latest activity.
        </AINote>
        <div className="svc-foot">
          <span className="svc-foot__meta">Updated 2h ago</span>
          <button className="svc-foot__link">
            View Details <ArrowRight size={14} strokeWidth={2} />
          </button>
        </div>
      </Panel>

      <Panel title="Print automation" subtitle="Status of print" showMenu>
        <div className="svc-print">
          <div className="svc-print__art" aria-hidden="true">🖨️</div>
          <span className="svc-status">Running</span>
        </div>
        <Button variant="secondary">Pause Printing</Button>
      </Panel>
    </>
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
      serviceId={serviceId}
      title={`${service.name} Dashboard`}
      trailing={trailing}
    >
      <Panel title="Workspace" showMenu>
        <Row
          title={`${d.openOrders} Open orders`}
          desc="New orders that are waiting to be fulfilled."
          action={<Button variant="primary">Fulfill open orders</Button>}
        />
        <Row
          title="Add credentials"
          desc="Upload and match new credential records."
          action={
            <Button variant="secondary">
              <PlusCircle size={18} strokeWidth={2} /> Add credentials
            </Button>
          }
        />
        <Row
          title="Manage learners"
          desc="Review and manage learner records."
          action={<Button variant="secondary">Manage learners</Button>}
        />
      </Panel>

      <Panel title="Order summary" subtitle="This month" showMenu>
        <LineChart series={SERIES} />
        <AINote>
          This summary is powered by IgniteAI and reflects the latest activity.
          Summaries are only visible to instructors.
        </AINote>
        <div className="svc-foot">
          <span className="svc-foot__meta">Updated 2h ago</span>
          <button className="svc-foot__link">
            View Details <ArrowRight size={14} strokeWidth={2} />
          </button>
        </div>
      </Panel>

      <Panel title="Metrics" subtitle="Source: Parchment Admin Analytics" showMenu>
        <div className="svc-metrics">
          {d.metrics.map((m, i) => (
            <StatTile key={i} value={m.value} label={m.label} hint={m.hint} />
          ))}
        </div>
        <AINote input>
          Ask about more data insights or for help cleaning up unmatched
          credentials and accounts
        </AINote>
        <div className="svc-foot">
          <span className="svc-foot__meta">Updated 2h ago</span>
          <button className="svc-foot__link">
            View Details <ArrowRight size={14} strokeWidth={2} />
          </button>
        </div>
      </Panel>
    </Wrapper>
  );
}
