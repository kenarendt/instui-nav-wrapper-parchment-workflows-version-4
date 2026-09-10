import { useState } from "react";
import SignIn from "./screens/SignIn.jsx";
import { BrowserProvider } from "./browser/BrowserContext.jsx";
import BrowserFrame from "./browser/BrowserFrame.jsx";
import { landingTab } from "./data/experiences.js";

/**
 * App — top-level flow.
 *
 * Sign-in drops the user straight into a service. There is no hub screen and no
 * school selection screen to pass through: `landingTab` resolves the account
 * shape down to one destination, already scoped to a school, and that is the
 * first tab. Admin access wins over learner access, the default service decides
 * which admin service, and that service's default school decides the scope.
 *
 * From there the simulated browser owns navigation. The services switcher in
 * the page top-right and the school switcher on the nav's institution mark both
 * move the current tab rather than opening new ones, so traversing the platform
 * stays inside one window.
 *
 * The prototype panel on the sign-in screen varies the account shape, since
 * that is what now decides where a user lands and which controls appear.
 */
export default function App() {
  const [session, setSession] = useState(null);

  if (!session) {
    return <SignIn onSignIn={setSession} />;
  }

  return (
    <BrowserProvider initialTabs={[landingTab(session)]} session={session}>
      <BrowserFrame />
    </BrowserProvider>
  );
}
