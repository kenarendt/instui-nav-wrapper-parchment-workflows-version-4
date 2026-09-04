import { LayoutDashboard, Sparkles, Inbox, CircleHelp, Settings } from "lucide-react";
import Wrapper from "../components/Wrapper.jsx";
import Panel from "../components/blocks/Panel.jsx";
import ServiceCard from "../components/blocks/ServiceCard.jsx";
import Button from "../components/Button.jsx";
import { useBrowser } from "../browser/BrowserContext.jsx";
import { SERVICE_ORDER, serviceById, account } from "../data/experiences.js";
import "./AdminHub.css";

const NAV_ITEMS = [
  { key: "dashboard", label: "Dashboard", Icon: LayoutDashboard, active: true },
  { key: "assist", label: "Assistant", Icon: Sparkles },
  { key: "inbox", label: "Inbox", Icon: Inbox, badge: 9 },
  { key: "help", label: "Help", Icon: CircleHelp },
];

export default function AdminHub() {
  const { openTab } = useBrowser();

  // Opening a service always opens its tab. An admin who works for several
  // schools lands on the school selection page inside that tab, because the
  // dashboard has nothing to show until it knows who it is acting for.
  const openService = (service) => {
    openTab({
      kind: "service",
      title: service.short,
      params: { serviceId: service.id },
      dedupeKey: `service:${service.id}`,
    });
  };

  // One flat grid under a single heading. The Award / Pathways split is gone:
  // an admin picking a service doesn't need to know which platform it sits on,
  // and the Pathways branding is being retired.
  //
  // The container greets rather than labels: the page title already names the
  // screen, so repeating it here would say nothing. The greeting and its
  // sentence come from the production welcome mat.
  //
  // Preferences sit behind the kebab, matching every other panel's affordance.
  // The preference itself would let an admin skip this screen and land inside
  // a service, which the prototype doesn't model — the item is a placeholder.
  const main = (
    <Panel
      title={`Welcome back, ${account.name.split(" ")[0]}`}
      subtitle="You have access to multiple Parchment platform services. Please select where you would like to start."
      menuItems={[{ label: "Set your preferences", Icon: Settings }]}
    >
      <div className="launch-grid">
        {SERVICE_ORDER.map((id) => {
          const svc = serviceById(id);
          return (
            <ServiceCard key={id} service={svc} onOpen={() => openService(svc)} />
          );
        })}
      </div>
    </Panel>
  );

  const trailing = (
    <>
      <Panel title="My credentials" subtitle="My personal credentials and achievements." showMenu>
        <div className="adminhub__promo">
          <div className="adminhub__promo-art" aria-hidden="true">🎓</div>
          <p className="adminhub__promo-text">
            Your personal Parchment academic and professional credential profile.
          </p>
          <span className="adminhub__promo-brand">Parchment</span>
          <Button
            variant="secondary"
            onClick={() =>
              openTab({
                kind: "parchmentCredentials",
                title: "Parchment",
                dedupeKey: "parchmentCredentials",
              })
            }
          >
            Open
          </Button>
        </div>
      </Panel>
      <Panel title="Platform settings" subtitle="Super user platform administration." showMenu>
        <div className="adminhub__promo">
          <div className="adminhub__promo-art" aria-hidden="true">⚙️</div>
          <p className="adminhub__promo-text">
            Configure and manage system level settings across all of your
            Parchment services.
          </p>
          <span className="adminhub__promo-brand">Parchment</span>
          <Button variant="secondary">Open</Button>
        </div>
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
        productLogo: "instructure",
      }}
      experienceType="admin"
      title="Platform Services"
      actions={
        <>
          <Button variant="secondary">Customize Dashboard</Button>
        </>
      }
      trailing={trailing}
    >
      {main}
    </Wrapper>
  );
}
