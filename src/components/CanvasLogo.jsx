import { useId } from "react";

/**
 * Canvas product mark, from the InstUI component library (node 2280-7060).
 *
 * Eight large dots sit on a circle of radius 31.5 and are cut by a circle of
 * radius 32, so the ones on the axes read as half discs and the diagonal ones
 * as lenses. Eight small dots ring the middle on radius 17.3. Traced from the
 * source artwork rather than approximated, so it matches at any size.
 *
 * The clip needs an id, and this mark can appear more than once on a page, so
 * the id comes from useId rather than a constant.
 */
export default function CanvasLogo({ size = 24, color = "var(--icon-sidenav-color)" }) {
  const clipId = useId();
  const ring = (radius, r) =>
    Array.from({ length: 8 }, (_, k) => {
      const a = ((k * 45 - 90) * Math.PI) / 180;
      return (
        <circle
          key={k}
          cx={(32 + radius * Math.cos(a)).toFixed(2)}
          cy={(32 + radius * Math.sin(a)).toFixed(2)}
          r={r}
        />
      );
    });

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill={color}
      role="img"
      aria-label="Canvas"
    >
      <clipPath id={clipId}>
        <circle cx="32" cy="32" r="32" />
      </clipPath>
      <g clipPath={`url(#${clipId})`}>{ring(31.5, 9)}</g>
      {ring(17.3, 3)}
    </svg>
  );
}
