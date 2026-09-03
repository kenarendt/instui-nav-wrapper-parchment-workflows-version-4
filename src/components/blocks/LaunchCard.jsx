import "./LaunchCard.css";

/**
 * LaunchCard — the card shell behind every "pick this and go" choice.
 *
 * Follows the card anatomy in Figma 91.04.001 Services Selector (node
 * 412:25375): a graphic, a name, supporting lines, and a full-width primary
 * action pinned to the bottom so buttons line up across a row.
 *
 * Shared so the Admin Connect service cards and the school selection cards
 * can't drift apart. Callers supply the graphic and the action; this owns the
 * chrome and the layout.
 *
 * `emphasis` marks the card as the recommended choice — a heavier border and a
 * tinted ground. Use it on one card at most.
 * `lockup` is the platform category element (01), off unless a caller needs it.
 */
export default function LaunchCard({
  graphic,
  title,
  meta = [],
  action,
  emphasis = false,
  lockup = null,
}) {
  return (
    <div className={`launch-card${emphasis ? " launch-card--emphasis" : ""}`}>
      {lockup && (
        <>
          <div className="launch-card__lockup">{lockup}</div>
          <hr className="launch-card__rule" />
        </>
      )}
      {graphic}
      <h3 className="launch-card__title">{title}</h3>
      {meta.filter(Boolean).map((line, i) => (
        <p key={i} className="launch-card__meta">
          {line}
        </p>
      ))}
      <div className="launch-card__action">{action}</div>
    </div>
  );
}
