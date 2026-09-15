import "./Pill.css";

/**
 * Pill — mirrors InstUI Pill v2. Communicates the state of an item with a
 * colored label. Variants: neutral (default), success, warning.
 *
 * Colour is never the only signal: pass an icon and wording that say the same
 * thing, since a pill that only differs by hue says nothing to anyone who
 * cannot tell the hues apart.
 */
export default function Pill({ children, color = "neutral" }) {
  return <span className={`pill pill--${color}`}>{children}</span>;
}
