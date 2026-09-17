/**
 * Account, services, and settings model for the prototype.
 *
 * Version 4 flattens the information architecture. There is no hub screen and
 * no school selection screen: sign-in resolves a single destination and drops
 * the user straight into the work. Everything after that is traversal from
 * inside a service, using two controls in the chrome — the services switcher in
 * the page top-right, and the school switcher on the institution mark in the
 * nav rail.
 *
 * How landing resolves, in order:
 *   1. Admin access wins over learner access. An account with both lands on an
 *      admin service.
 *   2. Among admin services, the default service in `PREFERENCES` decides which
 *      one. Transcript Services is the default for now.
 *   3. Within that service, the default school in `PREFERENCES` decides which
 *      school the admin acts for.
 * An account with learner access only lands on My Credentials.
 *
 * Schools hang off the service, not off the account. An admin can cover four
 * schools in Transcript Services and one in Receive, so the school switcher
 * only ever offers the schools attached to the service on screen, and each
 * service carries its own default.
 *
 * Admin services sit in one flat list. They used to be split into Parchment
 * Award and Parchment Pathways groups, but which platform a service belongs to
 * is not something an admin needs at the point of choosing one, and the
 * Pathways branding is being retired.
 *
 * Each service also carries a `search` block. Global search is per service, not
 * per platform: an admin in Diploma Services is looking for a diploma, and
 * offering them every field Receive needs would be noise. So the placeholder,
 * the supporting line and the advanced fields all belong to the service.
 *
 * Field types the advanced modal knows: text, date, select (with `options`),
 * and checks (a row of checkboxes). Anything else needs adding there too.
 *
 * Services carry no rollup count for a cross-service surface. Aggregating a
 * figure like "12 open orders" above the service level means calling into every
 * service before the page can paint, which the API cannot do cheaply. Counts
 * belong on each service's own dashboard, under `dashboard`, where the data is
 * local.
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

/**
 * Schools an admin can administer. Which of these a given service offers is
 * set per service below. Fictional institutions — `crest` picks the
 * SchoolCrest artwork.
 *
 * `brandColor` is the school's own primary colour, which a school sets for
 * itself in production. It reaches the UI as a CSS custom property rather than
 * a hard-coded fill, so decorative elements can opt into it wherever it helps
 * identify the school. Today that is the rule under the school band; anything
 * else that wants it reads the same property. Keep these dark enough to sit on
 * a white panel, and treat them as decoration — nothing should depend on the
 * colour alone to be understood, since a school can set it to anything.
 */
export const ADMIN_SCHOOLS = [
  {
    id: "bambusa",
    name: "Bambusa University",
    crest: "bambusa",
    location: "Denver, Colorado",
    country: "United States",
    brandColor: "#1d354f",
    detail: "4-year private · 18,400 learners",
  },
  {
    id: "panda",
    name: "Panda High School",
    crest: "panda",
    location: "Portland, Oregon",
    country: "United States",
    brandColor: "#1f6b4f",
    detail: "Secondary · 1,260 learners",
  },
  {
    id: "meridian",
    name: "Meridian Community College",
    crest: "meridian",
    location: "Tempe, Arizona",
    country: "United States",
    brandColor: "#0f7b74",
    detail: "2-year public · 9,750 learners",
  },
  {
    id: "elbert",
    name: "Mount Elbert University",
    crest: "elbert",
    location: "Leadville, Colorado",
    country: "United States",
    brandColor: "#7d2340",
    detail: "4-year public · 22,100 learners",
  },
];

export function schoolById(id) {
  return ADMIN_SCHOOLS.find((s) => s.id === id);
}

export const SERVICES = {
  transcript: {
    id: "transcript",
    name: "Transcript Services",
    short: "Transcript",
    icon: "file-text",
    description:
      "Manage learners and credentials, and fulfill orders for academic credentials.",
    // Schools this admin administers within this service. Deliberately
    // different per service — the point of scoping schools to the service.
    schools: ["bambusa", "panda", "meridian", "elbert"],
    search: {
      note: "Find learners, credentials, and orders across Transcript Services.",
      placeholder: "Try a name, DOB, or order ID",
      sections: [
      {
        title: "Search learner details",
        icon: "id",
        fields: [
          { label: "First Name", type: "text" },
          { label: "Last Name", type: "text" },
          { label: "Verified ID", type: "text" },
          { label: "Date of Birth", type: "date" },
          { label: "Grad/Leave Year", type: "text" },
          { label: "Email", type: "text" },
        ],
      },
      {
        title: "Search order details",
        icon: "doc",
        fields: [
          { label: "Order ID", type: "text" },
          { label: "Credential Type", type: "select", options: ["Transcript", "Diploma", "Certificate", "Verification"] },
          { label: "Status", type: "select", options: ["New", "In progress", "On hold", "Fulfilled", "Cancelled"] },
          { label: "Delivery Method", type: "select", options: ["Electronic", "Mail", "Pickup"] },
          { label: "Order(s) Placed By", type: "select", options: ["Anyone", "The learner", "A third party", "This school"] },
          { label: "Destination", type: "text" },
          { label: "Select Date Range", type: "select", options: ["Date ordered", "Date fulfilled", "Date updated"] },
          { label: "Start Date (From)", type: "date" },
          { label: "End Date (To)", type: "date" },
        ],
      },
      ],
    },
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
    icon: "award",
    description: "Issue digital and printed diplomas.",
    schools: ["bambusa", "panda"],
    search: {
      note: "Find learners and diplomas across Diploma Services.",
      placeholder: "Try a name, DOB, or diploma ID",
      sections: [
      {
        title: "Search learner details",
        icon: "id",
        fields: [
          { label: "First Name", type: "text" },
          { label: "Last Name", type: "text" },
          { label: "Verified ID", type: "text" },
          { label: "Date of Birth", type: "date" },
          { label: "Grad/Leave Year", type: "text" },
          { label: "Email", type: "text" },
        ],
      },
      {
        title: "Search diploma details",
        icon: "doc",
        fields: [
          { label: "Diploma ID", type: "text" },
          { label: "Award or Degree", type: "text" },
          { label: "Status", type: "select", options: ["Ready to issue", "Issued", "Reprint requested", "Returned"] },
          { label: "Delivery Method", type: "select", options: ["Digital", "Printed", "Digital and printed"] },
          { label: "Issue Event", type: "select", options: ["Any event", "Spring 2026", "Winter 2025", "Spring 2025"] },
          { label: "Print Batch", type: "text" },
          { label: "Select Date Range", type: "select", options: ["Date issued", "Date requested", "Date returned"] },
          { label: "Start Date (From)", type: "date" },
          { label: "End Date (To)", type: "date" },
        ],
      },
      ],
    },
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
    icon: "users",
    description:
      "Enroll learners into dual enrollment courses along with comprehensive enrollment management tools.",
    schools: ["meridian", "elbert", "bambusa"],
    search: {
      note: "Find learners, applications, and courses across Dual Enrollment.",
      placeholder: "Try a name, DOB, or application ID",
      sections: [
      {
        title: "Search learner details",
        icon: "id",
        fields: [
          { label: "First Name", type: "text" },
          { label: "Last Name", type: "text" },
          { label: "Verified ID", type: "text" },
          { label: "Date of Birth", type: "date" },
          { label: "Grad/Leave Year", type: "text" },
          { label: "Email", type: "text" },
        ],
      },
      {
        title: "Search enrollment details",
        icon: "doc",
        fields: [
          { label: "Application ID", type: "text" },
          { label: "Partner Course", type: "text" },
          { label: "Term", type: "select", options: ["Any term", "Fall 2026", "Spring 2026", "Fall 2025"] },
          { label: "Status", type: "select", options: ["New", "Under review", "Approved", "Waitlisted", "Denied"] },
          { label: "Instructor", type: "text" },
          { label: "Partner School", type: "text" },
          { label: "Select Date Range", type: "select", options: ["Date applied", "Date decided", "Date enrolled"] },
          { label: "Start Date (From)", type: "date" },
          { label: "End Date (To)", type: "date" },
        ],
      },
      ],
    },
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
    icon: "cloud-download",
    description: "Automate receiving academic credentials and documents.",
    // One school only. A single-school service shows no switcher on the mark,
    // so moving between services can change whether that control exists.
    schools: ["bambusa"],
    search: {
      note: "Find learners, documents, and orders across Receive.",
      placeholder: "Try a name, DOB, or email",
      sections: [
      {
        title: "Search learner details",
        icon: "id",
        fields: [
          { label: "First Name", type: "text" },
          { label: "Last Name", type: "text" },
          { label: "Verified ID", type: "text" },
          { label: "Date of Birth", type: "date" },
          { label: "Grad/Leave Year", type: "text" },
          { label: "Email", type: "text" },
        ],
      },
      {
        title: "Search document details",
        icon: "doc",
        fields: [
          { label: "School/Organization Name", type: "text" },
          { label: "Credential Type", type: "select", options: ["Transcript", "Diploma", "Certificate", "Verification"] },
          { label: "Document ID", type: "text" },
          { label: "Status", type: "select", options: ["New", "In review", "Processed", "Flagged"] },
          { label: "Delivery Method", type: "select", options: ["Electronic", "Mail", "Upload"] },
          { label: "Order(s) Placed By", type: "select", options: ["Anyone", "The learner", "A third party", "Another school"] },
          { label: "Select Date Range", type: "select", options: ["Date ordered", "Date received", "Date processed"] },
          { label: "Start Date (From)", type: "date" },
          { label: "End Date (To)", type: "date" },
        ],
      },
      {
        title: "Receive options",
        icon: "inbox",
        fields: [
          { label: "Workflow Name", type: "select", options: ["Undergraduate academic transcripts", "Graduate applications", "Transfer credit review"] },
          { label: "Applicant ID", type: "text" },
          { label: "Status", type: "checks", options: ["New", "Complete", "Archived"] },
        ],
      },
      ],
    },
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

/**
 * Admin services in the order they appear in the services switcher. The first
 * entry is also the fallback landing service if the default in `PREFERENCES`
 * ever names a service the account cannot reach.
 */
export const SERVICE_ORDER = [
  "transcript",
  "diploma",
  "dualEnrollment",
  "receive",
];

/**
 * The learner experience, as a destination in the services switcher. It sits
 * alongside the admin services because switching to it is the same kind of
 * move, but it gets its own labelled section in the menu: it is the user's own
 * record rather than work they do on behalf of a school, and an admin should
 * notice the change of hat.
 */
export const LEARNER_DESTINATION = {
  id: "credentials",
  name: "My Credentials",
  description: "Your own credentials, records, and badges.",
};

/**
 * Settings that would live in Platform Settings in production. They stand in
 * for the preferences that make a flat architecture work: without a default
 * service and a default school per service there is nothing to land on.
 */
export const PREFERENCES = {
  defaultServiceId: "transcript",
  defaultSchoolByService: {
    transcript: "bambusa",
    diploma: "panda",
    dualEnrollment: "meridian",
    receive: "bambusa",
  },
};

export function serviceById(id) {
  return SERVICES[id];
}

/**
 * Which services an account can reach, given the prototype's account shape.
 * `singleService` trims an admin down to one service — the case where the
 * services switcher has nothing to offer and hides itself.
 */
export function adminServiceIds({ shape = "both", singleService = false } = {}) {
  if (shape === "learnerOnly") return [];
  return singleService ? [PREFERENCES.defaultServiceId] : SERVICE_ORDER;
}

export function hasLearnerAccess({ shape = "both" } = {}) {
  return shape === "both" || shape === "learnerOnly";
}

/**
 * The school a service opens on: the stored default when it is one of the
 * service's schools, otherwise the service's first school. A default set for a
 * school later removed from the service should not strand the admin.
 */
export function defaultSchoolId(serviceId) {
  const service = SERVICES[serviceId];
  if (!service) return undefined;
  const preferred = PREFERENCES.defaultSchoolByService[serviceId];
  return service.schools.includes(preferred) ? preferred : service.schools[0];
}

/**
 * Schools attached to a service. With `multiSchool` off the admin covers one
 * school everywhere, so every service collapses to its default — that toggle
 * simulates a different account, not a different service configuration.
 */
export function serviceSchools(serviceId, { multiSchool = true } = {}) {
  const service = SERVICES[serviceId];
  if (!service) return [];
  const ids = multiSchool ? service.schools : [defaultSchoolId(serviceId)];
  return ids.map(schoolById).filter(Boolean);
}

/** The tab a service opens in, already scoped to its default school. */
export function serviceTab(serviceId) {
  const service = SERVICES[serviceId];
  if (!service) return null;
  return {
    kind: "service",
    title: service.short,
    dedupeKey: `service:${serviceId}`,
    params: { serviceId, schoolId: defaultSchoolId(serviceId) },
  };
}

/** The tab another Instructure product opens in. */
export function productTab(productId, name) {
  return {
    kind: "product",
    title: name,
    dedupeKey: `product:${productId}`,
    params: { productId },
  };
}

/** The tab the learner experience opens in. */
export function credentialsTab() {
  return {
    kind: "parchmentCredentials",
    title: "Parchment",
    dedupeKey: "parchmentCredentials",
  };
}

/**
 * Everything the services switcher can offer, in menu order: admin services
 * first, then the learner experience under its own heading, then the other
 * Instructure products the account reaches, each on its own.
 *
 * Products sit in the same menu as services because they are the same kind of
 * move for the person making it — leave what you are doing, go somewhere else
 * you have access to. Splitting them across two controls would make the user
 * work out which kind of destination they wanted before they could go there.
 */
export function destinations(session = {}) {
  const list = adminServiceIds(session).map((id) => ({
    id,
    group: "admin",
    name: SERVICES[id].name,
    description: SERVICES[id].description,
    icon: SERVICES[id].icon,
    tab: () => serviceTab(id),
  }));
  if (hasLearnerAccess(session)) {
    list.push({
      id: LEARNER_DESTINATION.id,
      group: "learner",
      name: LEARNER_DESTINATION.name,
      description: LEARNER_DESTINATION.description,
      tab: () => credentialsTab(),
    });
  }
  for (const [id, name, present] of [
    ["mastery", "Mastery", session.hasMastery],
    ["canvas", "Canvas", session.hasCanvas],
  ]) {
    if (present) {
      list.push({
        id,
        group: "product",
        name,
        tab: () => productTab(id, name),
      });
    }
  }
  return list;
}

/**
 * Where sign-in lands. Signing in to Mastery or Canvas lands on that product,
 * which in this prototype is a page saying where it stops — reached inside the
 * simulated browser rather than as a dead end, so the services switcher can
 * still carry the user over to Parchment.
 *
 * Within Parchment, admin access takes precedence, so an account carrying both
 * an admin service and a learner record opens on the default admin service at
 * its default school.
 */
export function landingTab(session = {}) {
  if (session.product && session.product !== "parchment") {
    const name = session.product === "mastery" ? "Mastery" : "Canvas";
    return productTab(session.product, name);
  }
  const adminIds = adminServiceIds(session);
  if (adminIds.length) {
    const preferred = PREFERENCES.defaultServiceId;
    const id = adminIds.includes(preferred) ? preferred : adminIds[0];
    return serviceTab(id);
  }
  return credentialsTab();
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
