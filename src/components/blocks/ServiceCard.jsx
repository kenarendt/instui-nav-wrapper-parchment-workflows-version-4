import LaunchCard from "./LaunchCard.jsx";
import ServiceGraphic from "./ServiceGraphic.jsx";
import Button from "../Button.jsx";

/**
 * ServiceCard — a service launch point on the Platform Services screen.
 *
 * The card chrome and layout live in LaunchCard, which follows the anatomy in
 * Figma 91.04.001 Services Selector (node 412:25375). This supplies the
 * service's graphic, name, description, and Open action.
 *
 * Two elements of the reference are not built here:
 *   01 Platform Category — the platform lockup. Platform Services lists every
 *      service under one "Parchment Services" heading, because which platform
 *      a service belongs to isn't useful at the point of choosing one, and the
 *      Parchment Pathways branding is being retired. `lockup` passes through
 *      to LaunchCard if a platform ever needs calling out.
 *   06 "Default" Tag — needs a default-service preference the prototype
 *      doesn't model.
 *
 * Carries no rollup count. A figure like "12 open orders" would force the hub
 * to call into every service before it can paint, which is the load cost this
 * screen is meant to avoid. Counts stay on each service's own dashboard.
 */
export default function ServiceCard({ service, onOpen, lockup = null }) {
  return (
    <LaunchCard
      lockup={lockup}
      graphic={<ServiceGraphic iconKey={service.icon} />}
      title={service.name}
      meta={[service.description]}
      action={
        <Button variant="primary" onClick={onOpen}>
          Open
          {/* Visible label stays "Open"; screen readers get the service name,
              so a list of buttons doesn't read as four identical "Open"s. */}
          <span className="sr-only">&nbsp;{service.name}</span>
        </Button>
      }
    />
  );
}
