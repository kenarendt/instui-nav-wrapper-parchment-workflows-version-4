import { useState } from "react";
import SignIn from "./screens/SignIn.jsx";
import Register from "./screens/Register.jsx";
import { BrowserProvider } from "./browser/BrowserContext.jsx";
import BrowserFrame from "./browser/BrowserFrame.jsx";
import { landingTab } from "./data/experiences.js";
import { REGISTRATION_SCHOOL } from "./data/credentials.js";

/**
 * App — top-level flow.
 *
 * Four states, in the order a person meets them:
 *   1. Sign in. An email first, then the product if the account reaches more
 *      than one, then the password.
 *   2. Register, when the email check finds no account. Parchment learner only.
 *   3. The app itself, in the simulated browser. Signing in to Mastery or Canvas
 *      lands on a product tab there — a page saying where the prototype stops,
 *      reached inside the browser so the services switcher can still carry the
 *      user over to Parchment rather than dead-ending them.
 *
 * Sign-in resolves one destination and lands on it: admin access beats learner
 * access, the default service decides which admin service, and that service's
 * default school decides the scope. There is no hub screen and no school
 * selection screen to pass through.
 *
 * A newly registered learner is connected to the school they registered
 * through, and to no others — registration happens on a school's page, so that
 * is the school they have. Their session carries that one school, so the
 * credentials dashboard shows it and the switcher offers only "Add another
 * school".
 */
export default function App() {
  const [session, setSession] = useState(null);
  const [registering, setRegistering] = useState(null);

  if (registering) {
    return (
      <Register
        email={registering.email}
        onBack={() => setRegistering(null)}
        onRegistered={({ email, name }) => {
          setSession({
            email,
            name,
            product: "parchment",
            shape: "learnerOnly",
            newAccount: true,
            // The one school a brand-new account has.
            learnerSchools: [REGISTRATION_SCHOOL],
          });
          // Leave the registration state too, or this branch keeps rendering
          // the form over the account it just created.
          setRegistering(null);
        }}
      />
    );
  }

  if (!session) {
    return <SignIn onSignIn={setSession} onRegister={setRegistering} />;
  }

  return (
    <BrowserProvider initialTabs={[landingTab(session)]} session={session}>
      <BrowserFrame />
    </BrowserProvider>
  );
}
