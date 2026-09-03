import { iconFor } from "./serviceIcons.js";

/**
 * ServiceGraphic — element 02 "Service Graphic" of the service card
 * (Figma 91.04.001 Services Selector, node 412:25375).
 *
 * The reference art is a scalloped seal — Parchment's brand device — with an
 * illustrated glyph inside. Those illustrations live on Figma's asset server
 * and aren't in the bundle, so this draws the seal and pairs it with the
 * service's line glyph. Same silhouette and read as the reference, no external
 * asset, and it stays crisp at any size.
 */

/**
 * Traces a scalloped ring: a circle whose radius oscillates, so `bumps`
 * evenly spaced lobes ring the edge. Sampled densely enough that straight
 * segments read as a smooth curve.
 */
function sealPath(cx, cy, radius, bumps, amplitude, steps = 288) {
  const points = [];
  for (let i = 0; i < steps; i += 1) {
    const angle = (i / steps) * Math.PI * 2;
    const r = radius + amplitude * Math.cos(bumps * angle);
    points.push(
      `${(cx + r * Math.cos(angle)).toFixed(2)},${(cy + r * Math.sin(angle)).toFixed(2)}`
    );
  }
  return `M${points.join("L")}Z`;
}

const OUTER = sealPath(36, 36, 30, 12, 2.4);
const INNER = sealPath(36, 36, 24.5, 12, 1.9);

export default function ServiceGraphic({ iconKey, size = 72 }) {
  const Icon = iconFor(iconKey);
  return (
    <span className="service-graphic" aria-hidden="true">
      <svg
        className="service-graphic__seal"
        width={size}
        height={size}
        viewBox="0 0 72 72"
        fill="none"
      >
        <path d={OUTER} fill="var(--background-containercolor)" stroke="currentColor" strokeWidth="2.25" />
        <path d={INNER} fill="none" stroke="currentColor" strokeWidth="1.25" opacity="0.55" />
      </svg>
      <span className="service-graphic__glyph">
        <Icon size={Math.round(size * 0.36)} strokeWidth={1.75} />
      </span>
    </span>
  );
}
