/**
 * Mastery product mark, from the InstUI component library (node 2280-7137).
 *
 * Five dots on two rows — two above, three below — with two strokes running
 * down and to the right. The outer dots on the bottom row run off the edges of
 * the box, which is part of the mark rather than a cropping mistake. Traced
 * from the source artwork.
 */
const R = 8;
const TOP_Y = 20.8;
const BOT_Y = 42.8;
const TOPS = [19.25, 43.75];
const BOTS = [7, 31.5, 56];

export default function MasteryLogo({ size = 24, color = "var(--icon-sidenav-color)" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      role="img"
      aria-label="Mastery"
    >
      <g stroke={color} strokeWidth="2.8" strokeLinecap="round">
        <line x1={TOPS[0]} y1={TOP_Y} x2={BOTS[1]} y2={BOT_Y} />
        <line x1={TOPS[1]} y1={TOP_Y} x2={BOTS[2]} y2={BOT_Y} />
      </g>
      <g fill={color}>
        {TOPS.map((x) => (
          <circle key={`t${x}`} cx={x} cy={TOP_Y} r={R} />
        ))}
        {BOTS.map((x) => (
          <circle key={`b${x}`} cx={x} cy={BOT_Y} r={R} />
        ))}
      </g>
    </svg>
  );
}
