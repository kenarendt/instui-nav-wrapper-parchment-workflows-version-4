import { useState } from "react";
import InstructureMark from "../components/InstructureMark.jsx";
import ProductMark from "../components/ProductMark.jsx";
import TextInput from "../components/TextInput.jsx";
import Button from "../components/Button.jsx";
import Toggle from "../components/Toggle.jsx";
import { productsForAccount } from "../data/products.js";
import "./SignIn.css";

/**
 * Sign-in — an email address first, then whatever that address turns out to
 * need.
 *
 * The old screen asked for a product, an email and a password all at once, which
 * put the burden of knowing the answer on the user. Now the email comes first
 * and the account decides the rest:
 *   1. Email, and Continue.
 *   2. If the account reaches more than one product, which one. One product and
 *      this step never appears, because a choice of one is not a choice.
 *   3. The password for the product they picked, with a way out if they have
 *      forgotten it.
 * An address with no account goes to registration instead, so "no account yet"
 * stops being something the user has to notice and self-select.
 *
 * Because the account is looked up rather than declared, the first step has no
 * "Don't have an account? Register now" link. The flow finds that out on its
 * own.
 *
 * The prototype panel sits on the first step, since everything it varies is
 * settled at the point the email is checked. It stands in for the account
 * lookup: what the address turns out to reach, and whether it exists at all.
 */
const ACCOUNT_SHAPES = [
  { id: "both", label: "Admin + Learner" },
  { id: "adminOnly", label: "Admin only" },
  { id: "learnerOnly", label: "Learner only" },
];

export default function SignIn({ onSignIn, onRegister }) {
  const [step, setStep] = useState("email");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [product, setProduct] = useState(null);

  // Prototype: what the account check finds for this address.
  const [shape, setShape] = useState("both");
  const [multiSchool, setMultiSchool] = useState(true);
  const [singleService, setSingleService] = useState(false);
  const [hasMastery, setHasMastery] = useState(false);
  const [hasCanvas, setHasCanvas] = useState(false);
  const [noAccount, setNoAccount] = useState(false);
  const [onboarding, setOnboarding] = useState(false);
  // Whether this account has the ID verification feature at all. On, and the
  // learner experience shows where they stand; off, and none of it appears.
  const [idVerification, setIdVerification] = useState(true);

  const products = productsForAccount({ hasMastery, hasCanvas });
  const productName = products.find((p) => p.id === product)?.name;
  // hasMastery / hasCanvas ride along: once signed in, the services switcher
  // offers every product the account reaches, not just the one they picked.
  const session = {
    email, shape, multiSchool, singleService, hasMastery, hasCanvas, onboarding,
    // Learners are put through an ID check. Signing in means the account
    // exists, so it starts from the settled state; the pill in the account
    // panel cycles to the others. Undefined hides the whole thing.
    idVerification: idVerification ? "verified" : undefined,
  };

  const checkEmail = (e) => {
    e.preventDefault();
    if (noAccount) {
      onRegister?.({ email, idVerification });
      return;
    }
    if (products.length === 1) {
      setProduct(products[0].id);
      setStep("password");
      return;
    }
    setStep("product");
  };

  const chooseProduct = (id) => {
    setProduct(id);
    setStep("password");
  };

  const submitPassword = (e) => {
    e.preventDefault();
    onSignIn?.({ ...session, password, product });
  };

  const backToEmail = () => {
    setStep("email");
    setProduct(null);
    setPassword("");
  };

  return (
    <div className="signin">
      <div className="signin__bg" aria-hidden="true" />

      <div
        className={`signin__content${
          step === "product" ? " signin__content--wide" : ""
        }`}
      >
        <div className="signin__brand">
          <InstructureMark height={44} />
          <span className="signin__wordmark">Welcome to Instructure</span>
        </div>

        {step === "email" && (
          <form className="signin__card" onSubmit={checkEmail}>
            <header className="signin__header">
              <h1 className="signin__title">Sign in</h1>
              <p className="signin__subtitle">
                Enter your email address to get started. We&rsquo;ll find your
                account and take you to the right place.
              </p>
            </header>

            <div className="signin__form">
              <TextInput
                id="email"
                label="E-mail address"
                required
                type="email"
                autoComplete="email"
                placeholder="peter_panda@bambusa-university.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="signin__actions">
              <Button variant="primary" type="submit">
                <span className="signin__login-label">Continue</span>
              </Button>
            </div>
          </form>
        )}

        {step === "product" && (
          <div className="signin__card">
            <header className="signin__header">
              <h1 className="signin__title">Choose where to sign in</h1>
              <p className="signin__subtitle">
                {email || "This account"} has access to more than one product.
              </p>
            </header>

            <ul className="signin__products">
              {products.map((p) => (
                <li key={p.id}>
                  <button
                    type="button"
                    className="signin__product"
                    onClick={() => chooseProduct(p.id)}
                  >
                    <ProductMark product={p.id} size={48} />
                    <span className="signin__product-name">{p.name}</span>
                    <span className="signin__product-desc">{p.description}</span>
                  </button>
                </li>
              ))}
            </ul>

            <div className="signin__actions">
              <button
                type="button"
                className="signin__back"
                onClick={backToEmail}
              >
                Use a different email
              </button>
            </div>
          </div>
        )}

        {step === "password" && (
          <form className="signin__card" onSubmit={submitPassword}>
            {/* The product is named in the heading and shown as its own mark,
                so someone who just chose between three of them can see they
                landed on the right one before typing a password into it. The
                subtitle carries the email only — the heading has the product
                covered. */}
            <header className="signin__header signin__header--product">
              <ProductMark product={product} size={48} />
              <div className="signin__header-text">
                <h1 className="signin__title">
                  Enter your {productName ?? ""} password
                </h1>
                <p className="signin__subtitle">
                  Signing in as {email || "your account"}.
                </p>
              </div>
            </header>

            <div className="signin__form">
              <TextInput
                id="password"
                label="Password"
                required
                type="password"
                autoComplete="current-password"
                placeholder="**********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <p className="signin__forgot">
                <a className="signin__link" href="#forgot">
                  Forgot password?
                </a>
              </p>
            </div>

            <div className="signin__actions">
              <Button variant="primary" type="submit">
                <span className="signin__login-label">Login</span>
              </Button>
              <button
                type="button"
                className="signin__back"
                onClick={backToEmail}
              >
                Use a different email
              </button>
            </div>
          </form>
        )}

        {step === "email" && (
          <div className="signin__demo" role="group" aria-label="Prototype: what the account check finds">
            <span className="signin__demo-label">
              Prototype · This email turns out to have
            </span>

            <div className="signin__seg">
              {ACCOUNT_SHAPES.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  className={`signin__seg-btn${shape === s.id ? " signin__seg-btn--active" : ""}`}
                  aria-pressed={shape === s.id}
                  disabled={noAccount}
                  onClick={() => setShape(s.id)}
                >
                  {s.label}
                </button>
              ))}
            </div>

            <div className="signin__opt">
              <span className="signin__opt-label">
                Admin supports multiple schools
              </span>
              <Toggle
                label="Admin supports multiple schools"
                defaultOn
                onChange={setMultiSchool}
              />
            </div>

            <div className="signin__opt">
              <span className="signin__opt-label">
                Admin has one Parchment service only
              </span>
              <Toggle
                label="Admin has one Parchment service only"
                defaultOn={false}
                onChange={setSingleService}
              />
            </div>

            <div className="signin__opt">
              <span className="signin__opt-label">Has Mastery account</span>
              <Toggle
                label="Has Mastery account"
                defaultOn={false}
                onChange={setHasMastery}
              />
            </div>

            <div className="signin__opt">
              <span className="signin__opt-label">Has Canvas account</span>
              <Toggle
                label="Has Canvas account"
                defaultOn={false}
                onChange={setHasCanvas}
              />
            </div>

            <div className="signin__opt">
              <span className="signin__opt-label">Learner ID verification</span>
              <Toggle
                label="Learner ID verification"
                defaultOn
                onChange={setIdVerification}
              />
            </div>

            <div className="signin__opt">
              <span className="signin__opt-label">New user onboarding</span>
              <Toggle
                label="New user onboarding"
                defaultOn={false}
                onChange={setOnboarding}
              />
            </div>

            {/* A checkbox rather than a toggle: this is not a setting that
                shades the account, it replaces the whole path. */}
            <label className="signin__check">
              <input
                type="checkbox"
                checked={noAccount}
                onChange={(e) => setNoAccount(e.target.checked)}
              />
              <span>No account for this email yet</span>
            </label>

            <p className="signin__demo-note">
              {noAccount
                ? "Continue goes to registration. A new account can only be a Parchment learner."
                : describeCheck(products.length, shape, singleService, onboarding)}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// Say out loud what the current settings will do, so the panel explains itself
// rather than needing the rules held in someone's head.
function describeCheck(productCount, shape, singleService, onboarding) {
  const first =
    productCount > 1
      ? `${productCount} products, so Continue asks which one.`
      : "One product, so Continue goes straight to the password.";
  const tour = onboarding
    ? " The walkthrough runs on arrival, covering whichever of the two switchers are on screen."
    : "";
  if (shape === "learnerOnly") {
    return `${first} Lands on My Credentials.${tour}`;
  }
  const services = singleService ? "one service" : "four services";
  return `${first} Lands on Transcript Services, ${services}.${tour}`;
}
