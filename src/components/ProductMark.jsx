import CanvasLogo from "./CanvasLogo.jsx";

/**
 * ProductMark — stand-in logos for the three products on the sign-in chooser.
 *
 * The real brand assets live on Figma's local asset server and can't be bundled
 * here, so these are original placeholder marks in the same spirit as the
 * parchment mark in the nav rail and `CanvasLogo`. They are deliberately simple
 * and not an attempt to reproduce the actual logos: anyone reading this
 * prototype should be able to tell at a glance that the artwork is a
 * placeholder, not a brand asset to copy.
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
      <span style={{ ...box, background: "#e3edf9" }} aria-hidden="true">
        <CanvasLogo size={size * 0.62} color="#1d354f" />
      </span>
    );
  }

  if (product === "mastery") {
    // Three rising bars, for progress against a standard.
    const s = size * 0.62;
    return (
      <span style={{ ...box, background: "#e3edf9" }} aria-hidden="true">
        <svg width={s} height={s} viewBox="0 0 24 24" fill="#1d354f">
          <rect x="3" y="14" width="5" height="7" rx="1.5" />
          <rect x="9.5" y="9" width="5" height="12" rx="1.5" />
          <rect x="16" y="3" width="5" height="18" rx="1.5" />
        </svg>
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
