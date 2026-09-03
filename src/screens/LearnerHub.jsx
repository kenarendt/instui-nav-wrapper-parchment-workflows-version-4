import { useState } from "react";
import {
  LayoutDashboard,
  Sparkles,
  Inbox,
  CircleHelp,
  FileText,
  AlertCircle,
  ChevronRight,
} from "lucide-react";
import Wrapper from "../components/Wrapper.jsx";
import Panel from "../components/blocks/Panel.jsx";
import Button from "../components/Button.jsx";
import { useBrowser } from "../browser/BrowserContext.jsx";
import {
  LEARNER_SCHOOLS,
  account,
  learnerSchoolById,
} from "../data/experiences.js";
import "./LearnerHub.css";

const NAV_ITEMS = [
  { key: "dashboard", label: "Dashboard", Icon: LayoutDashboard, active: true },
  { key: "assist", label: "Assistant", Icon: Sparkles },
  { key: "inbox", label: "Inbox", Icon: Inbox, badge: 9 },
  { key: "help", label: "Help", Icon: CircleHelp },
];

// Course work spans every connected school. `schoolId` ties each item to one.
const COURSEWORK = [
  { schoolId: "panda", icon: AlertCircle, title: "Lab Report: Photosynthesis", course: "Biology I", status: "Overdue", tone: "danger" },
  { schoolId: "panda", icon: FileText, title: "Essay: The Great Gatsby", course: "American Literature", status: "Turn in 11:59 pm", tone: "info" },
  { schoolId: "panda", icon: FileText, title: "Problem Set 3: Kinematics", course: "Physics I", status: "Tomorrow 5:00 pm", tone: "info" },
  { schoolId: "bambusa", icon: FileText, title: "Analysis of White Noise", course: "Contemporary American Fiction", status: "Turn in 11:59 pm", tone: "info" },
  { schoolId: "bambusa", icon: FileText, title: "Neural Network Fundamentals", course: "Intro to Cognitive Science", status: "Tomorrow 1:00 pm", tone: "info" },
  { schoolId: "bambusa", icon: FileText, title: "Rousseau and the Social Contract", course: "Foundations of Modern Political Thought", status: "Friday 9:00 am", tone: "info" },
];

// Grades are representative; the assignment counts are derived from COURSEWORK
// so the rollup can never contradict the list below it.
const GRADES_THIS_WEEK = { panda: 2, bambusa: 1 };

const SCHOOLS = LEARNER_SCHOOLS.map((school) => {
  const work = COURSEWORK.filter((c) => c.schoolId === school.id);
  const overdue = work.filter((c) => c.status === "Overdue").length;
  const upcoming = work.length - overdue;
  const grades = GRADES_THIS_WEEK[school.id] ?? 0;
  return {
    ...school,
    stats: [
      {
        value: overdue,
        label: overdue === 1 ? "Assignment overdue" : "Assignments overdue",
        tone: overdue > 0 ? "danger" : "muted",
      },
      {
        value: upcoming,
        label: upcoming === 1 ? "Assignment due this week" : "Assignments due this week",
        tone: upcoming > 0 ? "info" : "muted",
      },
      {
        value: grades,
        label: grades === 1 ? "Grade this week" : "Grades this week",
        tone: grades > 0 ? "success" : "muted",
      },
    ],
  };
});

const CREDENTIALS = [
  { title: "Bachelor of Engineering", kind: "Diploma", school: "Mount Elbert University School of Engineering", date: "Aug 29, 2026" },
  { title: "Bachelor of Engineering", kind: "Diploma Verification", school: "Mount Elbert University School of Engineering", date: "Sep 1, 2026" },
  { title: "Academic Excellence", kind: "Certificate", school: "Mount Elbert University", date: "May 22, 2023" },
];

const TODOS = [
  "Pay parking ticket",
  "Schedule academic advising appointment",
  "Schedule academic advising appointment",
];

const PEOPLE = [
  { name: "Dr. Lina Patel", detail: "COGS101" },
  { name: "Prof. Marcus Lin", detail: "COGS101" },
  { name: "Dr. Jasmine Ortiz", detail: "1 enrollment" },
  { name: "Prof. Sarah Nwoko", detail: "COGS101" },
];

export default function LearnerHub() {
  const { openTab } = useBrowser();
  // Course work filter: "all", or one connected school.
  const [schoolFilter, setSchoolFilter] = useState("all");

  const visibleCoursework =
    schoolFilter === "all"
      ? COURSEWORK
      : COURSEWORK.filter((c) => c.schoolId === schoolFilter);

  const openDashboard = (label) =>
    openTab({
      kind: "learnerDashboard",
      title: label,
      params: { title: label },
      dedupeKey: `learnerDashboard:${label}`,
    });

  const openParchment = () =>
    openTab({
      kind: "parchmentCredentials",
      title: "Parchment",
      dedupeKey: "parchmentCredentials",
    });

  const toneColor = {
    danger: "#a32d2d",
    info: "#185fa5",
    success: "#3b6d11",
    muted: "#576773",
  };

  const main = (
    <>
      <Panel title="Account rollup" showMenu>
        {SCHOOLS.map((school) => (
          <div key={school.name} className="lh-school">
            <div className="lh-school__head">
              <h3 className="lh-school__name">{school.name}</h3>
            </div>
            <div className="lh-school__stats">
              {school.stats.map((s, i) => (
                <div key={i} className={`lh-stat lh-stat--${s.tone}`}>
                  <span className="lh-stat__value">{s.value}</span>
                  <span className="lh-stat__label">{s.label}</span>
                </div>
              ))}
            </div>
            <button className="lh-link" onClick={() => openDashboard(`${school.name} dashboard`)}>
              View {school.name} dashboard
            </button>
          </div>
        ))}
      </Panel>

      <Panel
        title="Course work"
        showMenu
        headerRight={
          <div className="lh-filter" role="group" aria-label="Filter course work by school">
            <button
              type="button"
              className={`lh-filter__btn${schoolFilter === "all" ? " lh-filter__btn--on" : ""}`}
              aria-pressed={schoolFilter === "all"}
              onClick={() => setSchoolFilter("all")}
            >
              All schools
            </button>
            {LEARNER_SCHOOLS.map((s) => (
              <button
                key={s.id}
                type="button"
                className={`lh-filter__btn${schoolFilter === s.id ? " lh-filter__btn--on" : ""}`}
                aria-pressed={schoolFilter === s.id}
                onClick={() => setSchoolFilter(s.id)}
              >
                {s.short}
              </button>
            ))}
          </div>
        }
      >
        <ul className="lh-list">
          {visibleCoursework.map((c, i) => {
            const Icon = c.icon;
            const school = learnerSchoolById(c.schoolId);
            return (
              <li key={i} className="lh-course">
                <Icon size={20} strokeWidth={2} style={{ color: toneColor[c.tone], flexShrink: 0 }} />
                <div className="lh-course__body">
                  <p className="lh-course__title">{c.title}</p>
                  <button className="lh-link lh-link--sm" onClick={() => openDashboard("Course")}>
                    {c.course} · Go to course
                  </button>
                  <p className="lh-course__school">{school?.name}</p>
                </div>
                <span className="lh-pill" style={{ color: toneColor[c.tone], borderColor: toneColor[c.tone] }}>
                  {c.status}
                </span>
              </li>
            );
          })}
        </ul>
      </Panel>

      <Panel
        title="Credentials"
        headerRight={<Button variant="secondary" onClick={openParchment}>Order Records</Button>}
        showMenu
      >
        <ul className="lh-list">
          {CREDENTIALS.map((cr, i) => (
            <li key={i} className="lh-cred">
              <div className="lh-cred__thumb" aria-hidden="true">
                <FileText size={22} strokeWidth={1.75} />
              </div>
              <div className="lh-cred__body">
                <p className="lh-cred__kind">{cr.kind}</p>
                <p className="lh-cred__title">{cr.title}</p>
                <p className="lh-cred__meta">{cr.school}</p>
                <p className="lh-cred__meta">Acq/Awd: {cr.date}</p>
              </div>
              <ChevronRight size={20} strokeWidth={2} style={{ color: "var(--text-mutedcolor)" }} />
            </li>
          ))}
        </ul>
        <button className="lh-link lh-link--center" onClick={openParchment}>
          View more in Parchment
        </button>
      </Panel>

      <Panel title="Digital Badges" showMenu>
        <div className="lh-badges">
          {["Mathletes", "Architectural History", "National Honor Society", "Geothermal Engineering"].map(
            (b) => (
              <div key={b} className="lh-badge">
                <div className="lh-badge__art" aria-hidden="true">🏅</div>
                <span className="lh-badge__label">{b}</span>
              </div>
            )
          )}
        </div>
      </Panel>
    </>
  );

  const trailing = (
    <>
      <Panel title="Featured Widget" showMenu>
        <div className="lh-featured">
          <p className="lh-featured__title">Study Buddy</p>
          <p className="lh-featured__desc">
            Have a test or quiz coming up? Study Buddy generates flashcards and
            practice quizzes to help you reach your goals.
          </p>
          <Button variant="secondary">Add Widget</Button>
        </div>
      </Panel>

      <Panel title="To-do list" headerRight={<Button variant="secondary">+ New</Button>} showMenu>
        <ul className="lh-todos">
          {TODOS.map((t, i) => (
            <li key={i} className="lh-todo">
              <input type="checkbox" aria-label={`Mark ${t} as done`} />
              <span>{t}</span>
            </li>
          ))}
        </ul>
      </Panel>

      <Panel title="People" showMenu>
        <ul className="lh-people">
          {PEOPLE.map((p, i) => (
            <li key={i} className="lh-person">
              <span className="lh-person__avatar" aria-hidden="true">
                {p.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
              </span>
              <span className="lh-person__body">
                <span className="lh-person__name">{p.name}</span>
                <span className="lh-person__detail">{p.detail}</span>
              </span>
            </li>
          ))}
        </ul>
      </Panel>
    </>
  );

  return (
    <Wrapper
      navProps={{
        institutionName: account.institution,
        username: account.name,
        userRole: account.learnerRole,
        items: NAV_ITEMS,
        productLogo: "instructure",
      }}
      experienceType="learner"
      showSchoolSummary
      title="Learner Connect"
      actions={
        <>
          <Button variant="secondary">Customize Dashboard</Button>
        </>
      }
      trailing={trailing}
    >
      {main}
    </Wrapper>
  );
}
