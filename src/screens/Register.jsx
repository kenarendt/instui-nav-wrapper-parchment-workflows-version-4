import { useState } from "react";
import { ChevronLeft, Globe, CircleHelp, User, Users, Check, SquarePen, Eye } from "lucide-react";
import SchoolBand from "../components/blocks/SchoolBand.jsx";
import TextInput from "../components/TextInput.jsx";
import Select from "../components/Select.jsx";
import Button from "../components/Button.jsx";
import { REGISTRATION_SCHOOL } from "../data/credentials.js";
import "./Register.css";

/**
 * Register — creating a Parchment learner account.
 *
 * Its own full page rather than another step in the sign-in card, because that
 * is what it is in production: different chrome, a support bar, a back link,
 * and a footer. Sign-in reaches it when the email check finds no account, so
 * the user never has to notice they are new and pick the right link.
 *
 * Registration happens through a school, so the school heads the card using the
 * very same `SchoolBand` the dashboards use — crest, name, address, and a rule
 * in the school's own colour. Not a lookalike built here: a learner meets this
 * screen before anything else, and the first time they see that band should
 * teach them what it means everywhere after.
 *
 * "Whose credentials are you ordering?" is carried over from the reference
 * design. The prototype has no ordering flow behind it, so it behaves like
 * Customize Dashboard does elsewhere: real to look at, inert to press.
 *
 * Only a Parchment learner account can be created here. An admin gets their
 * access from the institution, not from a signup form.
 */
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const DAYS = Array.from({ length: 31 }, (_, i) => String(i + 1));
const YEARS = Array.from({ length: 60 }, (_, i) => String(2010 - i));
const EDUCATION = [
  "High school",
  "Some college",
  "Associate degree",
  "Bachelor's degree",
  "Master's degree",
  "Doctorate",
];
const STATES = ["AZ", "CA", "CO", "NY", "OR", "TX", "WA"];
const COUNTRIES = ["United States", "Canada", "United Kingdom", "Australia"];

const opts = (list) => list.map((v) => ({ value: v, label: v }));

function OrderingChoice({ selected, Icon, label, onClick }) {
  return (
    <button
      type="button"
      className={`reg__whose-opt${selected ? " reg__whose-opt--on" : ""}`}
      aria-pressed={selected}
      onClick={onClick}
    >
      <span className="reg__whose-circle">
        <Icon size={34} strokeWidth={2} aria-hidden="true" />
        {selected && (
          <span className="reg__whose-check" aria-hidden="true">
            <Check size={14} strokeWidth={3} />
          </span>
        )}
      </span>
      <span className="reg__whose-label">{label}</span>
    </button>
  );
}

export default function Register({ email, onBack, onRegistered }) {
  const school = REGISTRATION_SCHOOL;
  const [whose, setWhose] = useState("self");
  const [form, setForm] = useState({
    first: "", middle: "", last: "",
    month: "", day: "", year: "", education: "",
    country: "", phone: "",
    address1: "", address2: "", city: "", state: "", postal: "",
    password: "", confirm: "",
  });
  const set = (key) => (e) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  // Everything marked required, which is what the button waits on.
  const required = [
    "first", "last", "month", "day", "year", "education",
    "country", "phone", "address1", "city", "state", "postal",
    "password", "confirm",
  ];
  const complete = required.every((k) => form[k].trim() !== "");

  const submit = (e) => {
    e.preventDefault();
    if (!complete) return;
    onRegistered?.({
      email,
      name: [form.first, form.last].filter(Boolean).join(" "),
      schoolId: school.id,
    });
  };

  return (
    <div className="reg">
      <header className="reg__topbar">
        <span className="reg__lockup">
          <span className="reg__lockup-mark" aria-hidden="true" />
          <span className="reg__lockup-text">
            <span className="reg__lockup-name">Parchment</span>
            <span className="reg__lockup-by">By Instructure</span>
          </span>
        </span>
        <nav className="reg__topbar-links" aria-label="Utility">
          <button type="button" className="reg__toplink">
            <Globe size={18} strokeWidth={2} aria-hidden="true" /> EN
          </button>
          <button type="button" className="reg__toplink">
            <CircleHelp size={18} strokeWidth={2} aria-hidden="true" /> Support
          </button>
        </nav>
      </header>

      <div className="reg__backbar">
        <button type="button" className="reg__back" onClick={onBack}>
          <ChevronLeft size={18} strokeWidth={2.5} aria-hidden="true" /> BACK
        </button>
      </div>

      <main className="reg__main">
        <form className="reg__card" onSubmit={submit}>
          <h1 className="reg__cardhead">Learner Account</h1>

          <div className="reg__band">
            <SchoolBand school={school} />
          </div>

          <section className="reg__whose">
            <h2 className="reg__whose-q">Whose credentials are you ordering?</h2>
            <div className="reg__whose-opts">
              <OrderingChoice
                selected={whose === "self"}
                Icon={User}
                label="Ordering Your Own Credentials Or Academic Records"
                onClick={() => setWhose("self")}
              />
              <OrderingChoice
                selected={whose === "other"}
                Icon={Users}
                label="Ordering On Behalf Of Someone Else"
                onClick={() => setWhose("other")}
              />
            </div>
          </section>

          <div className="reg__body">
            <h2 className="reg__grouphead">Enter your personal information</h2>

            <p className="reg__email">
              {email || "your email address"}
              <button
                type="button"
                className="reg__email-edit"
                aria-label="Change email address"
                onClick={onBack}
              >
                <SquarePen size={18} strokeWidth={2} />
              </button>
            </p>

            <div className="reg__row reg__row--3">
              <TextInput id="first" label="First Name" required value={form.first} onChange={set("first")} />
              <TextInput id="middle" label="Middle Name" value={form.middle} onChange={set("middle")} />
              <TextInput id="last" label="Last Name" required value={form.last} onChange={set("last")} />
            </div>

            <div className="reg__row reg__row--3">
              <Select id="month" label="Month Of Birth" required value={form.month} onChange={set("month")} options={opts(MONTHS)} placeholder="Month Of Birth" />
              <Select id="day" label="Day Of Birth" required value={form.day} onChange={set("day")} options={opts(DAYS)} placeholder="Day Of Birth" />
              <Select id="year" label="Year Of Birth" required value={form.year} onChange={set("year")} options={opts(YEARS)} placeholder="Year Of Birth" />
            </div>

            <Select id="education" label="Highest Level Of Education" required value={form.education} onChange={set("education")} options={opts(EDUCATION)} placeholder="Highest Level Of Education" />

            <h2 className="reg__grouphead">Enter your contact information</h2>

            <div className="reg__row reg__row--2">
              <Select id="country" label="Country" required value={form.country} onChange={set("country")} options={opts(COUNTRIES)} placeholder="Country" />
              <TextInput id="phone" label="Mobile Phone" required type="tel" value={form.phone} onChange={set("phone")} />
            </div>

            <div className="reg__row reg__row--2">
              <TextInput id="address1" label="Address Line 1" required value={form.address1} onChange={set("address1")} />
              <TextInput id="address2" label="Address Line 2 (APT# etc.)" value={form.address2} onChange={set("address2")} />
            </div>

            <div className="reg__row reg__row--3">
              <TextInput id="city" label="City" required value={form.city} onChange={set("city")} />
              <Select id="state" label="State" required value={form.state} onChange={set("state")} options={opts(STATES)} placeholder="State" />
              <TextInput id="postal" label="Postal Code" required value={form.postal} onChange={set("postal")} />
            </div>

            <div className="reg__grouphead-row">
              <h2 className="reg__grouphead">Set a Parchment password</h2>
              <a className="reg__req-link" href="#password-requirements">
                Password Requirements
              </a>
            </div>

            <div className="reg__row reg__row--2">
              <TextInput id="password" label="Password" required type="password" value={form.password} onChange={set("password")} />
              <TextInput id="confirm" label="Retype Password" required type="password" value={form.confirm} onChange={set("confirm")} />
            </div>

            <Button variant="primary" type="submit" disabled={!complete}>
              Create Account &amp; Continue
            </Button>

            <p className="reg__required-note">
              <span className="reg__required-star" aria-hidden="true">*</span>
              All items with a red asterisk are required.
            </p>

            <p className="reg__terms">
              By signing up you agree to the Parchment{" "}
              <a className="reg__link" href="#terms">terms of use</a> and{" "}
              <a className="reg__link" href="#privacy">privacy policy</a>.
            </p>
          </div>
        </form>
      </main>

      <footer className="reg__footer">
        <span className="reg__footer-group">
          <button type="button" className="reg__toplink">
            <CircleHelp size={16} strokeWidth={2} aria-hidden="true" /> Support: Help Desk
          </button>
          <button type="button" className="reg__toplink">
            <Eye size={16} strokeWidth={2} aria-hidden="true" /> Support: Screen Share
          </button>
        </span>
        <span className="reg__lockup reg__lockup--footer">
          <span className="reg__lockup-mark" aria-hidden="true" />
          <span className="reg__lockup-text">
            <span className="reg__lockup-name">Parchment</span>
            <span className="reg__lockup-by">By Instructure</span>
          </span>
        </span>
        <span className="reg__footer-group">
          <a className="reg__link" href="#terms">Terms Of Use</a>
          <a className="reg__link" href="#privacy">Privacy Policy</a>
        </span>
      </footer>
    </div>
  );
}
