import { useState } from "react";
import SignIn from "./screens/SignIn.jsx";
import { BrowserProvider } from "./browser/BrowserContext.jsx";
import BrowserFrame from "./browser/BrowserFrame.jsx";

/**
 * App — top-level flow.
 *
 * Starts at sign-in. The demo account carries both a Learner and an Admin
 * experience, so sign-in defaults to Platform Services (Admin wins when both
 * exist). The sign-in screen exposes a prototype override to land on
 * Learner Connect instead. From there, the simulated browser owns navigation:
 * Connect modules and the nav profile switcher open or focus tabs.
 *
 * The Connect screens exist to choose between the accounts on one email. With
 * "Multi-account simulation off" there is only one account, so sign-in skips
 * them and lands on the single thing that account can reach. An admin can
 * still cover several schools — a district admin filling orders for every
 * school over the summer, say — so the school picker still applies there.
 */
// dedupeKey matters here: the tab the user lands on at sign-in must share a
// key with the tab the account menu would open, so choosing that experience
// refocuses this tab instead of opening a second one.
const LANDING_TABS = {
  admin: { kind: "adminHub", title: "Platform Services", dedupeKey: "adminHub" },
  learner: { kind: "learnerHub", title: "Learner Connect", dedupeKey: "learnerHub" },
};

// One account: no Connect screen to land on, so go straight to the work.
const SINGLE_ACCOUNT_TABS = {
  admin: {
    kind: "service",
    title: "Transcript",
    params: { serviceId: "transcript" },
    dedupeKey: "service:transcript",
  },
  learner: {
    kind: "parchmentCredentials",
    title: "Parchment",
    dedupeKey: "parchmentCredentials",
  },
};

export default function App() {
  const [session, setSession] = useState(null);

  if (!session) {
    return (
      <SignIn
        onSignIn={({ landing, multiSchool, singleAccount }) =>
          setSession({
            landing: landing || "admin",
            multiSchool: !!multiSchool,
            singleAccount: !!singleAccount,
          })
        }
      />
    );
  }

  const landingTabs = session.singleAccount ? SINGLE_ACCOUNT_TABS : LANDING_TABS;
  const initialTab = landingTabs[session.landing] ?? landingTabs.admin;

  return (
    <BrowserProvider
      initialTabs={[initialTab]}
      multiSchool={session.multiSchool}
      singleAccount={session.singleAccount}
    >
      <BrowserFrame />
    </BrowserProvider>
  );
}
