import { useEffect } from "react";

/**
 * useDismissOnOutside — closes a transient overlay on Escape or on a press
 * outside it.
 *
 * Extracted once three overlays needed it (the account menu on the school
 * selection page, the school switcher in the nav, and a panel's kebab menu).
 * Keeping one copy means they can't drift into behaving differently, which is
 * exactly the kind of inconsistency people notice without being able to name.
 *
 * `refs` are the elements that count as "inside" — usually the trigger and the
 * overlay, since pressing the trigger has its own toggle handler and must not
 * also be treated as an outside press. Pass `restoreFocusTo` so Escape returns
 * focus to the trigger rather than dropping it at the top of the document.
 *
 * refs are stable ref objects, so they are deliberately not in the dependency
 * list; the effect only needs to re-run when the overlay opens or closes.
 */
export default function useDismissOnOutside(
  open,
  close,
  refs,
  restoreFocusTo
) {
  useEffect(() => {
    if (!open) return undefined;

    const isInside = (target) =>
      refs.some((ref) => ref.current?.contains(target));

    const onPointerDown = (e) => {
      if (!isInside(e.target)) close();
    };
    const onKeyDown = (e) => {
      if (e.key !== "Escape") return;
      close();
      restoreFocusTo?.current?.focus();
    };

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, close, restoreFocusTo]);
}
