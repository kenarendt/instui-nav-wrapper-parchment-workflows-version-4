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
 */
export default function SignIn({ onSignIn }) {
  const [product, setProduct] = useState("parchment");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [landing, setLanding] = useState("admin");
  const [multiSchool, setMultiSchool] = useState(false);
  // On = this email carries one account only, so there is nothing to switch
  // between and no Connect screen to land on.
  const [singleAccount, setSingleAccount] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSignIn?.({ product, email, password, landing, multiSchool, singleAccount });
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

        <div className="signin__demo" role="group" aria-label="Prototype: landing destination">
          <span className="signin__demo-label">Prototype · Land on</span>
          <div className="signin__seg">
            <button
              type="button"
              className={`signin__seg-btn${landing === "admin" ? " signin__seg-btn--active" : ""}`}
              aria-pressed={landing === "admin"}
              onClick={() => setLanding("admin")}
            >
              Platform Services
            </button>
            <button
              type="button"
              className={`signin__seg-btn${landing === "learner" ? " signin__seg-btn--active" : ""}`}
              aria-pressed={landing === "learner"}
              onClick={() => setLanding("learner")}
            >
              Learner Connect
            </button>
          </div>

          <div className="signin__opt">
            <span className="signin__opt-label">
              Admin supports multiple schools
            </span>
            <Toggle
              label="Admin supports multiple schools"
              defaultOn={false}
              onChange={setMultiSchool}
            />
          </div>

          <div className="signin__opt">
            <span className="signin__opt-label">Multi-account simulation off</span>
            <Toggle
              label="Multi-account simulation off"
              defaultOn={false}
              onChange={setSingleAccount}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
