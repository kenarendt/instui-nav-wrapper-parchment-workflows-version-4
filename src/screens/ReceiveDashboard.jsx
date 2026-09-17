import {
  LayoutDashboard,
  Cloud,
  ClipboardList,
  FileText,
  Settings,
  Download,
  Pencil,
  FileArchive,
  FolderInput,
  CloudDownload,
  Sparkles,
} from "lucide-react";
import Wrapper from "../components/Wrapper.jsx";
import Panel from "../components/blocks/Panel.jsx";
import Button from "../components/Button.jsx";
import IconButton from "../components/IconButton.jsx";
import { account } from "../data/experiences.js";
import "./ReceiveDashboard.css";

const NAV_ITEMS = [
  { key: "dashboard", label: "Dashboard", Icon: LayoutDashboard, active: true },
  { key: "documents", label: "Parchment Cloud", Icon: Cloud },
  { key: "workflows", label: "Orders", Icon: ClipboardList },
  { key: "reports", label: "Reports", Icon: FileText },
  { key: "settings", label: "Settings", Icon: Settings },
];

const WORKFLOWS = [
  { id: "ug", title: "Undergraduate academic transcripts", tag: "ZIP FILES", Icon: FileArchive },
  { id: "grad", title: "Graduate academic transcripts", tag: "SFTP", Icon: FolderInput },
];

export default function ReceiveDashboard() {
  const trailing = (
    <Panel title="Parchment Cloud" className="rcv-cloud" showMenu>
      <p className="rcv-cloud__sub">Every received document and record.</p>
      <div className="rcv-cloud__art" aria-hidden="true">
        <CloudDownload size={72} strokeWidth={1.25} />
      </div>
      <p className="rcv-cloud__num">690</p>
      <p className="rcv-cloud__caption">Documents saved in the Parchment Cloud</p>
      <Button variant="secondary">All downloaded documents</Button>
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
      serviceId="receive"
      title="Receive Dashboard"
      trailing={trailing}
    >
      {/* Workspace */}
      <Panel title="Workspace" showMenu>
        <div className="rcv-row">
          <span className="rcv-stat" aria-hidden="true">4</span>
          <div className="rcv-row__body">
            <h3 className="rcv-row__title">New documents pending download</h3>
            <p className="rcv-row__desc">
              Documents that were not auto-processed and need to be completed (Viewed/downloaded)
            </p>
          </div>
          <div className="rcv-row__actions">
            <Button variant="primary">View documents</Button>
          </div>
        </div>

        <div className="rcv-row rcv-row--divided">
          <span className="rcv-stat" aria-hidden="true">1</span>
          <div className="rcv-row__body">
            <h3 className="rcv-row__title">Zip file pending download</h3>
            <p className="rcv-row__desc">Documents that were zipped automatically via workflows.</p>
          </div>
          <div className="rcv-row__actions">
            <Button variant="secondary">View files</Button>
            <Button variant="primary" icon={Download}>Download all</Button>
          </div>
        </div>
      </Panel>

      {/* Workflows */}
      <Panel title="Workflows" subtitle="Automated document routing configurations." showMenu>
        {WORKFLOWS.map((wf, i) => (
          <div key={wf.id} className={`rcv-row${i > 0 ? " rcv-row--divided" : ""}`}>
            <span className="rcv-wf-icon" aria-hidden="true">
              <wf.Icon size={30} strokeWidth={1.5} />
              <span className="rcv-wf-icon__tag">{wf.tag}</span>
            </span>
            <div className="rcv-row__body">
              <h3 className="rcv-row__title">{wf.title}</h3>
              <p className="rcv-row__label">WORKFLOW</p>
            </div>
            <div className="rcv-row__actions">
              <IconButton icon={Pencil} variant="secondary" screenReaderLabel={`Edit ${wf.title}`} />
              <Button variant="secondary">View documents</Button>
            </div>
          </div>
        ))}

        <div className="rcv-buildwf">
          <button className="rcv-buildwf__btn">
            <Sparkles size={16} strokeWidth={2} /> Help me build a workflow
          </button>
        </div>
      </Panel>
    </Wrapper>
  );
}
