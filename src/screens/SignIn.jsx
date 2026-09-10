import { useState } from "react";
import InstructureMark from "../components/InstructureMark.jsx";
import Select from "../components/Select.jsx";
import TextInput from "../components/TextInput.jsx";
import Button from "../components/Button.jsx";
import Toggle from "../components/Toggle.jsx";
import "./SignIn.css";

/**
 * Sign-in screen — recreated from Figma node 431:35603 ("Log In").
 * Full-bleed background with gradient overlay, Instructure wordmark, and a
 * login card (Select Product, email, password, Login, register link).
 *
 * The background photo asset lives on the Figma localhost server and can't be
 * bundled here, so a brand-blue gradient stands in for it.
 *
 * The prototype panel under the card varies the shape of the account rather
 * than the destination. Version 4 resolves the destination itself — admin
 * access beats learner access, the default service and its default school do
 * the rest — so there is no landing to pick. What is worth varying is what the
 * account can reach, because that decides whether the services switcher and
 * the school switcher appear at all.
 */
const ACCOUNT_SHAPES = [
  { id: "both", label: "Admin + Learner" },
  { id: "adminOnly", label: "Admin only" },
  { id: "learnerOnly", label: "Learner only" },
];

// Say out loud where the current settings land, so the panel explains itself
// rather than needing the rules held in someone's head.
function describeLanding(shape, singleService) {
  if (shape === "learnerOnly") {
    return "Lands on My Credentials. No services switcher.";
  }
  const services = singleService ? "one service" : "four services";
  const switcher =
    singleService && shape === "adminOnly"
      ? "No services switcher."
      : "Services switcher available.";
  return `Lands on Transcript Services, ${services}. ${switcher}`;
}

export default function SignIn({ onSignIn }) {
  const [product, setProduct] = useState("parchment");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // What the account carries. This is what decides where sign-in lands and
  // which chrome controls exist, so it is what a demo needs to vary.
  const [shape, setShape] = useState("both");
  const [multiSchool, setMultiSchool] = useState(true);
  // On = this admin reaches one service only, so the services switcher has
  // nothing to offer and hides itself.
  const [singleService, setSingleService] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSignIn?.({ product, email, password, shape, multiSchool, singleService });
  };

  return (
    <div className="signin">
      <div className="signin__bg" aria-hidden="true" />

      <div className="signin__content">
        <div className="signin__brand">
          <InstructureMark height={44} />
          <span className="signin__wordmark">Welcome to Instructure</span>
        </div>

        <form className="signin__card" onSubmit={handleSubmit}>
          <header className="signin__header">
            <h1 className="signin__title">Login</h1>
            <p className="signin__subtitle">
              Lorem ipsum dolor sit amet posuere arcu mollis id scelerisque
              tellus morbi.
            </p>
          </header>

          <div className="signin__form">
            <Select
              id="product"
              label="Select Product"
              value={product}
              onChange={(e) => setProduct(e.target.value)}
              options={[
                { value: "parchment", label: "Parchment" },
                { value: "canvas", label: "Canvas" },
                { value: "mastery", label: "Mastery" },
              ]}
            />
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
          </div>

          <div className="signin__actions">
            <Button variant="primary" type="submit">
              <span className="signin__login-label">Login</span>
            </Button>
            <p className="signin__register">
              Don&rsquo;t have an account?{" "}
              <a className="signin__link" href="#register">
                Register now!
              </a>
            </p>
          </div>
        </form>

        <div className="signin__demo" role="group" aria-label="Prototype: account shape">
          <span className="signin__demo-label">Prototype · This account carries</span>
          <div className="signin__seg">
            {ACCOUNT_SHAPES.map((s) => (
              <button
                key={s.id}
                type="button"
                className={`signin__seg-btn${shape === s.id ? " signin__seg-btn--active" : ""}`}
                aria-pressed={shape === s.id}
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
            <span className="signin__opt-label">Admin has one service only</span>
            <Toggle
              label="Admin has one service only"
              defaultOn={false}
              onChange={setSingleService}
            />
          </div>

          <p className="signin__demo-note">{describeLanding(shape, singleService)}</p>
        </div>
      </div>
    </div>
  );
}
