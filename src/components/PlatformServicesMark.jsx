/**
 * PlatformServicesMark — the 3x3 grid that stands for the Parchment platform as
 * a whole. Drawn here rather than taken from the icon set: Lucide has no filled
 * 3x3 grid (`Grid3x3` is lines, `LayoutGrid` is 2x2, `Grip` is dots), and this
 * has to match the mark used in the design.
 *
 * Cell size is deliberately under half the pitch. At 20px a denser grid fills
 * in and reads as one solid square, which is exactly what the mark must not
 * look like — the gaps are the whole idea.
 */
export default function PlatformServicesMark({ size = 20 }) {
  const cells = [0, 1, 2].flatMap((row) => [0, 1, 2].map((col) => [row, col]));
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden="true"
    >
      {cells.map(([row, col]) => (
        <rect
          key={`${row}-${col}`}
          x={col * 7.5}
          y={row * 7.5}
          width="5"
          height="5"
          rx="1"
        />
      ))}
    </svg>
  );
}
