import CanvasLogo from "./CanvasLogo.jsx";
import MasteryLogo from "./MasteryLogo.jsx";

/**
 * ProductMark — stand-in logos for the three products on the sign-in chooser.
 *
 * Canvas and Mastery use the real marks from the InstUI component library,
 * traced from the artwork Ken supplied. Parchment is still a placeholder in the
 * same spirit as the mark in the nav rail, since that one has not been handed
 * over yet — worth swapping when it is, so all three are the genuine article.
 */
export default function ProductMark({ product, size = 40 }) {
  const box = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: size,
    height: size,
    borderRadius: "var(--avatar-rectangle-radius)",
    flexShrink: 0,
  };

  if (product === "canvas") {
    return (
      <span style={{ ...box, background: "#e3edf9" }}>
        <CanvasLogo size={size * 0.62} color="#1d354f" />
      </span>
    );
  }

  if (product === "mastery") {
    return (
      <span style={{ ...box, background: "#e3edf9" }}>
        <MasteryLogo size={size * 0.62} color="#1d354f" />
      </span>
    );
  }

  // Parchment — the outlined card with a dot, matching the nav rail mark.
  const s = size * 0.62;
  return (
    <span style={{ ...box, background: "#e3edf9" }} aria-hidden="true">
      <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
        <rect
          x="2.5"
          y="5"
          width="19"
          height="14"
          rx="3"
          stroke="#1d354f"
          strokeWidth="2.4"
        />
        <circle cx="8.5" cy="12" r="2.6" fill="#1d354f" />
      </svg>
    </span>
  );
}
