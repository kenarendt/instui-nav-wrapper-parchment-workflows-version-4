/**
 * Account, experiences, and services model for the prototype.
 *
 * One account login can carry several experiences. At the top level they fall
 * into two categories: a Learner experience and an Admin experience. If the
 * account has both, sign-in lands on the Admin experience. Each experience
 * lands on a "Connect" dashboard (a welcome-mat dashboard). Connect modules
 * deep-link into detailed experiences that open in new (simulated) browser tabs.
 *
 * Admin services are grouped, per the design, into:
 *   - Parchment Award Services: Transcript Services, Diploma Services, Dual Enrollment
 *   - Parchment Pathways Services: Receive
 * All admin service dashboards share one common dashboard pattern.
 *
 * Services carry no rollup count for the Connect surface. Aggregating a figure
 * like "12 open orders" at the hub level means calling into every service
 * before the page can paint, which the API cannot do cheaply. Counts belong on
 * each service's own dashboard, under `dashboard`, where the data is local.
 */

export const account = {
  name: "Peter Panda",
  email: "peter_panda@bambusa-university.edu",
  institution: "Bambusa University",
  // Persona labels shown in the nav (the tag on the account card and the
  // sub-label under the name). These name the account the user is active in,
  // not their institutional role.
  learnerRole: "Learner",
  adminRole: "Admin",
};

export const SERVICES = {
  transcript: {
    id: "transcript",
    name: "Transcript Services",
    short: "Transcript",
    group: "award",
    icon: "file-text",
    description:
      "Manage learners and credentials, and fulfill orders for academic credentials.",
    dashboard: {
      openOrders: 12,
      metrics: [
        { value: "24", label: "Unmatched credentials", hint: "Credentials that are not matched to a learner record." },
        { value: "2%", label: "Unmatched accounts", hint: "Parchment accounts that are not tied to a learner record." },
        { value: "6%", label: "Unverified", hint: "Learner records with verified IDs." },
      ],
      fulfillment: { total: "4,894", segments: [
        { label: "Transcripts", value: 55, color: "#273540" },
        { label: "Diplomas", value: 30, color: "#c02a6e" },
        { label: "Verifications", value: 15, color: "#0f7b74" },
      ] },
    },
  },
  diploma: {
    id: "diploma",
    name: "Diploma Services",
    short: "Diploma",
    group: "award",
    icon: "award",
    description: "Issue digital and printed diplomas.",
    dashboard: {
      openOrders: 187,
      metrics: [
        { value: "187", label: "Ready to issue", hint: "Diplomas prepared and awaiting release." },
        { value: "1.4k", label: "Issued this year", hint: "Digital and printed diplomas issued." },
        { value: "3%", label: "Returned", hint: "Diplomas returned or undeliverable." },
      ],
      fulfillment: { total: "1,402", segments: [
        { label: "Digital", value: 62, color: "#273540" },
        { label: "Printed", value: 38, color: "#c02a6e" },
      ] },
    },
  },
  dualEnrollment: {
    id: "dualEnrollment",
    name: "Dual Enrollment",
    short: "Dual Enrollment",
    group: "award",
    icon: "users",
    description:
      "Enroll learners into dual enrollment courses along with comprehensive enrollment management tools.",
    dashboard: {
      openOrders: 3,
      metrics: [
        { value: "3", label: "New applications", hint: "Applications awaiting review." },
        { value: "248", label: "Active enrollments", hint: "Learners currently enrolled." },
        { value: "12", label: "Partner courses", hint: "Courses open for dual enrollment." },
      ],
      fulfillment: { total: "263", segments: [
        { label: "Approved", value: 70, color: "#273540" },
        { label: "Pending", value: 20, color: "#c02a6e" },
        { label: "Waitlist", value: 10, color: "#0f7b74" },
      ] },
    },
  },
  receive: {
    id: "receive",
    name: "Receive",
    short: "Receive",
    group: "pathways",
    icon: "cloud-download",
    description: "Automate receiving academic credentials and documents.",
    dashboard: {
      openOrders: 4,
      metrics: [
        { value: "4", label: "New documents", hint: "Documents received and awaiting processing." },
        { value: "96%", label: "Auto-matched", hint: "Documents matched automatically." },
        { value: "1.1k", label: "Received this month", hint: "Total inbound documents." },
      ],
      fulfillment: { total: "1,120", segments: [
        { label: "Processed", value: 82, color: "#273540" },
        { label: "In review", value: 12, color: "#c02a6e" },
        { label: "Flagged", value: 6, color: "#0f7b74" },
      ] },
    },
  },
};

export const SERVICE_GROUPS = [
  {
    id: "award",
    name: "Parchment Award Services",
    brand: "Parchment Award",
    services: ["transcript", "diploma", "dualEnrollment"],
  },
  {
    id: "pathways",
    name: "Parchment Pathways Services",
    brand: "Parchment Pathways",
    services: ["receive"],
  },
];

/**
 * Experiences this account can access. Order matters for default landing:
 * if an Admin experience is present it wins over Learner.
 */
export const EXPERIENCES = [
  {
    id: "admin",
    type: "admin",
    label: "Admin",
    sublabel: account.adminRole,
    landing: { kind: "adminHub", title: "Admin Connect", dedupeKey: "adminHub" },
  },
  {
    id: "learner",
    type: "learner",
    label: "Learner",
    sublabel: account.learnerRole,
    landing: { kind: "learnerHub", title: "Learner Connect", dedupeKey: "learnerHub" },
  },
];

export function defaultLanding(experiences = EXPERIENCES) {
  const admin = experiences.find((e) => e.type === "admin");
  return admin ?? experiences[0];
}

/**
 * Switchable profiles listed in the account overlay.
 *
 * One account can carry several underlying accounts on the same email, but the
 * menu presents only the two top-level choices: Learner and Admin. Individual
 * admin services are reached from inside the Admin experience, not from this
 * menu. Each entry maps to the tab that opens — or is focused, if that tab is
 * already open. Both rows use the same avatar: this is one person signed in
 * with one email, so the initials mark is identical across accounts.
 */
export const PROFILES = [
  {
    id: "learner",
    role: "Learner Connect",
    sub: null,
    avatar: "pp",
    tab: { kind: "learnerHub", title: "Learner Connect", dedupeKey: "learnerHub" },
  },
  {
    id: "admin",
    role: "Admin Connect",
    sub: null,
    avatar: "pp",
    tab: { kind: "adminHub", title: "Admin Connect", dedupeKey: "adminHub" },
  },
];

export function serviceById(id) {
  return SERVICES[id];
}

/**
 * Schools an admin can administer within a service.
 *
 * Some admins work on behalf of several schools inside one Parchment service.
 * When that applies, the service asks which school the admin is acting for
 * before showing the dashboard, and the chosen school's crest identifies the
 * context in the nav. Fictional institutions — `crest` picks the SchoolCrest
 * artwork.
 */
export const ADMIN_SCHOOLS = [
  {
    id: "bambusa",
    name: "Bambusa University",
    crest: "bambusa",
    location: "Denver, Colorado",
    detail: "4-year private · 18,400 learners",
  },
  {
    id: "panda",
    name: "Panda High School",
    crest: "panda",
    location: "Portland, Oregon",
    detail: "Secondary · 1,260 learners",
  },
  {
    id: "meridian",
    name: "Meridian Community College",
    crest: "meridian",
    location: "Tempe, Arizona",
    detail: "2-year public · 9,750 learners",
  },
  {
    id: "elbert",
    name: "Mount Elbert University",
    crest: "elbert",
    location: "Leadville, Colorado",
    detail: "4-year public · 22,100 learners",
  },
];

export function schoolById(id) {
  return ADMIN_SCHOOLS.find((s) => s.id === id);
}

/**
 * Schools connected to the learner account. A learner collects course work and
 * credentials across every school they attend, so more than one is normal. The
 * nav shows a neutral mark rather than any single crest when there are several.
 */
export const LEARNER_SCHOOLS = [
  { id: "panda", name: "Panda High School", short: "Panda High", crest: "panda" },
  { id: "bambusa", name: "Bambusa University", short: "Bambusa", crest: "bambusa" },
];

export function learnerSchoolById(id) {
  return LEARNER_SCHOOLS.find((s) => s.id === id);
}
