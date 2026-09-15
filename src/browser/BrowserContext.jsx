import { createContext, useContext, useState, useCallback } from "react";
import { nextVerification } from "../data/verification.js";

const BrowserContext = createContext(null);

let counter = 0;
const nextId = () => `tab-${++counter}`;

/**
 * BrowserProvider — owns the simulated browser's tab state.
 *
 * It also holds three things that behave like saved settings rather than page
 * state: the expanded/collapsed display preference, the `session` (the shape of
 * the signed-in account), whether the first-run walkthrough is still running,
 * and where the learner's ID verification stands. All three live here so every page in every tab agrees about them —
 * the walkthrough especially, since dismissing it on one page must not leave it
 * waiting on another.
 *
 * openTab dedupes on `dedupeKey`: if a tab with the same key already exists it
 * is focused instead of duplicated. navigateTab is the opposite move — it
 * replaces what a tab is pointing at, in place, which is how the services
 * switcher works. Switching services is traversal within one window, not a
 * reason to accumulate tabs.
 */
export function BrowserProvider({
  initialTabs = [],
  session = {},
  children,
}) {
  const [tabs, setTabs] = useState(() =>
    initialTabs.map((t) => ({ id: nextId(), ...t }))
  );
  const [activeId, setActiveId] = useState(() => (tabs[0] ? tabs[0].id : null));

  // Display preference: true = content fills the container, false = content is
  // capped at a fixed max width. Shared across every page and tab. Starts
  // collapsed, so the wide view is something the user opts into.
  const [expandedView, setExpandedView] = useState(false);
  const toggleExpandedView = useCallback(
    () => setExpandedView((v) => !v),
    []
  );

  // First-run walkthrough. Starts open only if sign-in asked for it, and once
  // dismissed stays dismissed for the rest of the session.
  const [onboardingOpen, setOnboardingOpen] = useState(
    () => Boolean(session.onboarding)
  );
  const dismissOnboarding = useCallback(() => setOnboardingOpen(false), []);

  // Learner ID verification state. Held here rather than in the account panel
  // so pressing the pill on one page is still true on the next, and so the
  // panel unmounting on a page change does not reset it.
  const [idVerification, setIdVerification] = useState(
    () => session.idVerification
  );
  const cycleVerification = useCallback(
    () => setIdVerification((v) => nextVerification(v)),
    []
  );

  const openTab = useCallback((tab) => {
    setTabs((prev) => {
      if (tab.dedupeKey) {
        const existing = prev.find((t) => t.dedupeKey === tab.dedupeKey);
        if (existing) {
          setActiveId(existing.id);
          // Merge incoming params so re-opening a service for a different
          // school moves that tab rather than doing nothing.
          if (tab.params) {
            return prev.map((t) =>
              t.id === existing.id
                ? { ...t, params: { ...t.params, ...tab.params } }
                : t
            );
          }
          return prev;
        }
      }
      const id = nextId();
      setActiveId(id);
      return [...prev, { id, ...tab }];
    });
  }, []);

  /**
   * Point an existing tab at something else, keeping its position in the strip.
   * If another tab is already showing the destination, focus that one instead —
   * otherwise switching services could leave two tabs on the same service and
   * break openTab's dedupe.
   */
  const navigateTab = useCallback((id, next) => {
    setTabs((prev) => {
      const twin = prev.find((t) => t.id !== id && t.dedupeKey === next.dedupeKey);
      if (twin) {
        setActiveId(twin.id);
        return prev;
      }
      setActiveId(id);
      return prev.map((t) => (t.id === id ? { id, ...next } : t));
    });
  }, []);

  const closeTab = useCallback((id) => {
    setTabs((prev) => {
      const idx = prev.findIndex((t) => t.id === id);
      if (idx === -1) return prev;
      const next = prev.filter((t) => t.id !== id);
      setActiveId((cur) => {
        if (cur !== id) return cur;
        const fallback = next[idx] ?? next[idx - 1] ?? next[0];
        return fallback ? fallback.id : null;
      });
      return next;
    });
  }, []);

  const focusTab = useCallback((id) => setActiveId(id), []);

  // Which school an admin is acting for inside a service. Stored on the tab so
  // it survives switching away and back, and so two tabs can sit on different
  // schools.
  const setTabSchool = useCallback((id, schoolId) => {
    setTabs((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, params: { ...t.params, schoolId } } : t
      )
    );
  }, []);

  const value = {
    tabs,
    activeId,
    activeTab: tabs.find((t) => t.id === activeId) ?? null,
    session,
    multiSchool: session.multiSchool !== false,
    setTabSchool,
    openTab,
    navigateTab,
    closeTab,
    focusTab,
    expandedView,
    toggleExpandedView,
    onboardingOpen,
    dismissOnboarding,
    idVerification,
    cycleVerification,
  };
  return (
    <BrowserContext.Provider value={value}>{children}</BrowserContext.Provider>
  );
}

export function useBrowser() {
  const ctx = useContext(BrowserContext);
  if (!ctx) throw new Error("useBrowser must be used within BrowserProvider");
  return ctx;
}
