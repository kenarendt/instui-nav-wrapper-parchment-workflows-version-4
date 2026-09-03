import ServiceGraphic from "./ServiceGraphic.jsx";
import Button from "../Button.jsx";
import "./ServiceCard.css";

/**
 * ServiceCard — a service launch point in an Admin Connect group.
 *
 * Follows the card anatomy in Figma 91.04.001 Services Selector (node
 * 412:25375), which numbers six elements:
 *   01 Platform Category — the platform lockup (Parchment Award, Parchment
 *      Pathways, Parchment). Omitted here: unlike the production Services
 *      Selector, which lays every service out in one flat grid and needs the
 *      lockup to tell platforms apart, Admin Connect already groups services
 *      under a heading that names the platform. Pass `lockup` to bring it back.
 *   02 Service Graphic — the scalloped seal, see ServiceGraphic.
 *   03 Service Name.
 *   04 Service Notes — the high-level description.
 *   05 Primary Action — full-width Open, which launches the service.
 *   06 "Default" Tag — not built yet; it depends on a user preference for a
 *      default service, which this prototype doesn't model.
 *
 * Carries no rollup count. A figure like "12 open orders" would force the hub
 * to call into every service before it can paint, which is the load cost this
 * screen is meant to avoid. Counts stay on each service's own dashboard.
 */
export default function ServiceCard({ service, onOpen, lockup = null }) {
  return (
    <div className="service-card">
      {lockup && (
        <>
          <div className="service-card__lockup">{lockup}</div>
          <hr className="service-card__rule" />
        </>
      )}
      <ServiceGraphic iconKey={service.icon} />
      <h3 className="service-card__title">{service.name}</h3>
      <p className="service-card__desc">{service.description}</p>
      <div className="service-card__action">
        <Button variant="primary" onClick={onOpen}>
          Open
          {/* Visible label stays "Open"; screen readers get the service name,
              so a list of buttons doesn't read as four identical "Open"s. */}
          <span className="sr-only">&nbsp;{service.name}</span>
        </Button>
      </div>
    </div>
  );
}
