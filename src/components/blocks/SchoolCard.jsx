import LaunchCard from "./LaunchCard.jsx";
import SchoolCrest from "../SchoolCrest.jsx";
import Button from "../Button.jsx";
import "./SchoolCard.css";

/**
 * SchoolCard — a school launch point on the school selection page.
 *
 * Same shell as the Platform Services cards, so the two screens read as
 * one pattern: crest, school name, location and detail, and a full-width
 * action that opens the service for that school.
 *
 * Carries no open-order count. The reference page shows one per school, but it
 * costs a query per school the admin covers, and the count doesn't change
 * which school they need to work in.
 *
 * `emphasis` marks the admin's usual school, which the page puts above the
 * rest. Both tiers say "Continue" and both do the same thing — enter the
 * service as that school. The hierarchy is carried by button weight and the
 * primary's longer phrasing ("Continue with this selection", since that card
 * is already selected), not by a different verb: a different verb would imply
 * a different outcome.
 */
export default function SchoolCard({
  school,
  onSelect,
  actionLabel = "Continue",
  actionVariant = "secondary",
  emphasis = false,
}) {
  return (
    <LaunchCard
      emphasis={emphasis}
      graphic={
        <span className="schoolcard__crest" aria-hidden="true">
          <SchoolCrest size={64} variant={school.crest} />
        </span>
      }
      title={school.name}
      meta={[school.location, school.detail]}
      action={
        <Button variant={actionVariant} onClick={() => onSelect(school)}>
          {actionLabel}
          {/* Both tiers repeat a short label across cards, so each button
              names its school to a screen reader. */}
          <span className="sr-only">&nbsp;— {school.name}</span>
        </Button>
      }
    />
  );
}
