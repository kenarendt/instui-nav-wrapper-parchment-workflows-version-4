import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import Button from "./Button.jsx";
import "./OnboardingTour.css";

/**
 * OnboardingTour — a first-run walkthrough of the two controls the flat
 * architecture depends on.
 *
 * With no hub screen and no gate screens, the only ways across the platform are
 * the services switcher in the page header and the school switcher on the
 * school band. Someone who does not notice those two is stuck in whichever
 * service and school they landed in, so a first-run tour pointing at them is
 * worth more here than it would be in an architecture with a hub to fall back
 * on.
 *
 * It dims the page, cuts a hole over the control, and anchors a popover to it
 * with a step counter and Back / Next. The page underneath is inert while the
 * tour runs: the step counter promises a path through, and letting someone open
 * the spotlit menu would cover the very popover explaining it.
 *
 * Steps are filtered by what is actually on screen. `gate` is the thing that
 * has to exist for the step to be worth showing — the school step needs a
 * switcher, not just a band, because an admin with one school in this service
 * has nothing to switch to. A tour that points at a control the user does not
 * have teaches them the product is broken.
 */
const STEPS = [
  {
    id: "services",
    target: ".svcsw",
    title: "Move between services",
    body: "Open this to switch Parchment services, go to your own credentials, or head to another Instructure product. Wherever you are now is marked with a check.",
  },
  {
    id: "school",
    target: ".schoolband",
    // The band always renders on a school-scoped page; the chevron only shows
    // when there is another school to act for.
    gate: ".schoolband__switch",
    title: "Check which school you are in",
    body: "Everything on this page belongs to the school named here. Use the arrow to act on behalf of a different one.",
  },
];

const HOLE_PAD = 10;
const GAP = 12;
const POPOVER_WIDTH = 320;

export default function OnboardingTour({ onDone }) {
  const [index, setIndex] = useState(0);
  const [steps, setSteps] = useState(null);
  const [rect, setRect] = useState(null);
  const [flip, setFlip] = useState(false);
  const rootRef = useRef(null);
  const popRef = useRef(null);
  const nextRef = useRef(null);

  // Which steps have a control on screen. This has to wait for a layout
  // effect: during the first render pass the page it is asking about has not
  // been committed yet, so querying the DOM there finds nothing and the tour
  // concludes it has nothing to say.
  useLayoutEffect(() => {
    const found = STEPS.filter((s) => document.querySelector(s.gate ?? s.target));
    setSteps(found);
    // Nothing to point at — say nothing rather than showing an empty tour.
    if (found.length === 0) onDone?.();
  }, [onDone]);

  const step = steps?.[index];

  const measure = useCallback(() => {
    const root = rootRef.current;
    if (!root || !step) return;
    const el = document.querySelector(step.target);
    if (!el) return;
    const a = el.getBoundingClientRect();
    const b = root.getBoundingClientRect();
    setRect({
      top: a.top - b.top,
      left: a.left - b.left,
      width: a.width,
      height: a.height,
      containerWidth: b.width,
      containerHeight: b.height,
    });
  }, [step]);

  useLayoutEffect(() => {
    measure();
  }, [measure]);

  useEffect(() => {
    window.addEventListener("resize", measure);
    // Capture, so a scroll in the content column is caught too.
    window.addEventListener("scroll", measure, true);
    return () => {
      window.removeEventListener("resize", measure);
      window.removeEventListener("scroll", measure, true);
    };
  }, [measure]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onDone?.();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onDone]);

  // Move focus to the popover's primary action, so a keyboard user is not left
  // tabbing through a page they cannot use.
  useEffect(() => {
    nextRef.current?.focus();
  }, [index]);

  // Below the control by default; above it when there is no room underneath.
  useLayoutEffect(() => {
    if (!rect || !popRef.current) return;
    const h = popRef.current.offsetHeight;
    const below = rect.top + rect.height + HOLE_PAD + GAP + h;
    setFlip(below > rect.containerHeight && rect.top - GAP - h > 0);
  }, [rect, index]);

  if (!steps || steps.length === 0 || !step) return null;

  const hole = rect && {
    top: rect.top - HOLE_PAD,
    left: rect.left - HOLE_PAD,
    width: rect.width + HOLE_PAD * 2,
    height: rect.height + HOLE_PAD * 2,
  };

  // Right edges aligned with the control, then clamped inside the page.
  let popLeft = 0;
  let arrowLeft = POPOVER_WIDTH / 2;
  if (rect) {
    const wanted = rect.left + rect.width - POPOVER_WIDTH;
    popLeft = Math.min(
      Math.max(GAP, wanted),
      Math.max(GAP, rect.containerWidth - POPOVER_WIDTH - GAP)
    );
    arrowLeft = Math.min(
      Math.max(18, rect.left + rect.width / 2 - popLeft),
      POPOVER_WIDTH - 18
    );
  }

  const last = index === steps.length - 1;

  return (
    <div className="tour" ref={rootRef}>
      {/* Catches every press, so the page underneath is inert. The dim itself
          is the hole's box-shadow, which cannot be clicked. */}
      <div className="tour__blocker" />

      {hole && (
        <div
          className="tour__hole"
          style={{
            top: hole.top,
            left: hole.left,
            width: hole.width,
            height: hole.height,
          }}
        />
      )}

      {rect && (
        <div
          ref={popRef}
          className={`tour__pop${flip ? " tour__pop--above" : ""}`}
          style={{
            left: popLeft,
            width: POPOVER_WIDTH,
            ...(flip
              ? { top: rect.top - HOLE_PAD - GAP, transform: "translateY(-100%)" }
              : { top: rect.top + rect.height + HOLE_PAD + GAP }),
          }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="tour-title"
          aria-describedby="tour-body"
        >
          <span
            className="tour__arrow"
            style={{ left: arrowLeft }}
            aria-hidden="true"
          />
          <div className="tour__head">
            <h2 className="tour__title" id="tour-title">
              {step.title}
            </h2>
            <button
              type="button"
              className="tour__close"
              aria-label="Close the walkthrough"
              onClick={() => onDone?.()}
            >
              <X size={18} strokeWidth={2.5} />
            </button>
          </div>

          <p className="tour__body" id="tour-body">
            {step.body}
          </p>

          <div className="tour__foot">
            <span className="tour__count">
              Step {index + 1} of {steps.length}
            </span>
            <div className="tour__actions">
              {index > 0 && (
                <button
                  type="button"
                  className="tour__back"
                  onClick={() => setIndex((i) => i - 1)}
                >
                  Back
                </button>
              )}
              <span ref={nextRef} tabIndex={-1} className="tour__focus">
                <Button
                  variant="primary"
                  onClick={() => (last ? onDone?.() : setIndex((i) => i + 1))}
                >
                  {last ? "Got it" : "Next"}
                </Button>
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
