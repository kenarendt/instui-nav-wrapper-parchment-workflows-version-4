/**
 * Learner credentials data for the Parchment Credential Dashboard.
 *
 * A learner collects records across the schools they attend. Each school has
 * its own credentials, badges, insights, directory, and order options.
 *
 * The dashboard shows one school at a time, chosen with the same school
 * switcher the admin side uses. All Credentials spans every school, and the
 * badges a learner earned outside any school sit in their own section on that
 * same page.
 *
 * `brandColor` matches the same school on the admin side, so a learner and an
 * admin looking at Bambusa University see the same colour. A school sets this
 * itself, so treat it as decoration: the crest, name and location carry the
 * identity on their own.
 *
 * Every item carries three things the lists depend on:
 *   - `id`, stable, so a selection survives filtering and sorting.
 *   - `earned`, an ISO date, because "most recently earned" cannot sort a
 *     display string like "May 29, 2026" reliably.
 *   - `date`, that same date written for people to read.
 *
 * The counts are deliberate: 12 items at Bambusa and 5 at Panda, 17 in all,
 * matching what the credential-type donut claims. A school's badges count
 * towards its total, which is why All Credentials lists them alongside the
 * credentials rather than only in the school view.
 */

export const REGISTRATION_SCHOOL = {
  id: "appletree",
  name: "Apple Tree High School",
  crest: "appletree",
  location: "100 Main Street, Scottsdale, AZ 85093",
  country: "United States",
  brandColor: "#1f8a4c",
  credentials: [
    { id: "at-c1", type: "Transcript", title: "Official Academic Transcript", issuer: "Apple Tree High School", date: "May 28, 2026", earned: "2026-05-28", thumb: "verification" },
    { id: "at-c2", type: "Diploma", title: "High School Diploma", issuer: "Apple Tree High School", date: "May 22, 2026", earned: "2026-05-22", thumb: "diploma" },
  ],
  badges: [
    { id: "at-b1", title: "Perfect Attendance", issuer: "Apple Tree High School", date: "June 1, 2026", earned: "2026-06-01" },
  ],
  insights: [
    { value: "0", label: "Collections", hint: "Active credential collections" },
    { value: "2", label: "Public credentials", hint: "Public credentials" },
    { value: "0", label: "Public views & shares", hint: "Total credential views" },
  ],
  donut: {
    total: "3",
    segments: [
      { label: "Diplomas", value: 34, color: "#0f7b74" },
      { label: "Transcripts", value: 33, color: "#c54396" },
      { label: "Badges", value: 33, color: "#273540" },
    ],
  },
  orderPills: ["Transcripts", "Diplomas", "Verifications"],
  directory: [
    { name: "Marcus Webb", role: "Registrar", initials: "MW" },
    { name: "Dana Ruiz", role: "Counselor", initials: "DR" },
  ],
};

export const SCHOOLS = [
  {
    id: "bambusa",
    name: "Bambusa University",
    crest: "bambusa",
    location: "Denver, Colorado",
    country: "United States",
    brandColor: "#1d354f",
    credentials: [
      { id: "bu-c1", type: "Diploma", title: "Bachelor of Engineering", issuer: "Bambusa University School of Engineering", date: "May 29, 2026", earned: "2026-05-29", thumb: "diploma" },
      { id: "bu-c2", type: "Diploma Verification", title: "Bachelor of Engineering", issuer: "Bambusa University School of Engineering", date: "June 12, 2026", earned: "2026-06-12", thumb: "verification" },
      { id: "bu-c3", type: "Transcript", title: "Official Academic Transcript", issuer: "Bambusa University", date: "June 2, 2026", earned: "2026-06-02", thumb: "verification" },
      { id: "bu-c4", type: "Certificate", title: "Dean's List, Spring 2026", issuer: "Bambusa University", date: "May 15, 2026", earned: "2026-05-15", thumb: "certificate" },
      { id: "bu-c5", type: "Certificate", title: "Undergraduate Research Fellow", issuer: "Bambusa University", date: "November 8, 2025", earned: "2025-11-08", thumb: "certificate" },
      { id: "bu-c6", type: "Certificate", title: "Academic Excellence", issuer: "Bambusa University", date: "September 22, 2025", earned: "2025-09-22", thumb: "certificate" },
      { id: "bu-c7", type: "Certificate", title: "Teaching Assistant, Thermodynamics", issuer: "Bambusa University", date: "March 14, 2025", earned: "2025-03-14", thumb: "certificate" },
      { id: "bu-c8", type: "Transcript", title: "Interim Academic Transcript", issuer: "Bambusa University", date: "January 20, 2025", earned: "2025-01-20", thumb: "verification" },
      { id: "bu-c9", type: "Certificate", title: "Study Abroad, Kyoto", issuer: "Bambusa University", date: "August 30, 2024", earned: "2024-08-30", thumb: "certificate" },
    ],
    badges: [
      { id: "bu-b1", title: "Capstone Team Lead", issuer: "Bambusa University", date: "April 18, 2026", earned: "2026-04-18" },
      { id: "bu-b2", title: "Tech Innovator", issuer: "Bambusa University", date: "January 2, 2026", earned: "2026-01-02" },
      { id: "bu-b3", title: "Hackathon Finalist", issuer: "Bambusa University", date: "October 11, 2025", earned: "2025-10-11" },
    ],
    insights: [
      { value: "2", label: "Collections", hint: "Active credential collections" },
      { value: "6", label: "Public credentials", hint: "Public credentials" },
      { value: "1,240", label: "Public views & shares", hint: "Total credential views" },
    ],
    donut: {
      total: "12",
      segments: [
        { label: "Certificates", value: 55, color: "#0f7b74" },
        { label: "Diplomas", value: 20, color: "#c54396" },
        { label: "Badges", value: 25, color: "#273540" },
      ],
    },
    orderPills: ["Diplomas", "Certificates", "Digital Badges", "Verifications"],
    directory: [
      { name: "Dr. Samantha Pratt", role: "Admissions", initials: "SP" },
      { name: "Kathy Bailey", role: "Registrar", initials: "KB" },
      { name: "Jenny Thompson", role: "Advisor", initials: "JT" },
    ],
  },
  {
    id: "panda",
    name: "Panda High School",
    crest: "panda",
    location: "Portland, Oregon",
    country: "United States",
    brandColor: "#1f6b4f",
    credentials: [
      { id: "ph-c1", type: "Transcript", title: "Official Academic Transcript", issuer: "Panda High School", date: "June 10, 2022", earned: "2022-06-10", thumb: "verification" },
      { id: "ph-c2", type: "Diploma", title: "High School Diploma", issuer: "Panda High School", date: "June 6, 2022", earned: "2022-06-06", thumb: "diploma" },
      { id: "ph-c3", type: "Certificate", title: "Honor Roll, Senior Year", issuer: "Panda High School", date: "May 18, 2022", earned: "2022-05-18", thumb: "certificate" },
      { id: "ph-c4", type: "Certificate", title: "State Science Fair, Second Place", issuer: "Panda High School", date: "March 26, 2022", earned: "2022-03-26", thumb: "certificate" },
    ],
    badges: [
      { id: "ph-b1", title: "Robotics Club Captain", issuer: "Panda High School", date: "April 3, 2022", earned: "2022-04-03" },
    ],
    insights: [
      { value: "1", label: "Collections", hint: "Active credential collections" },
      { value: "3", label: "Public credentials", hint: "Public credentials" },
      { value: "412", label: "Public views & shares", hint: "Total credential views" },
    ],
    donut: {
      total: "5",
      segments: [
        { label: "Certificates", value: 40, color: "#0f7b74" },
        { label: "Diplomas", value: 40, color: "#c54396" },
        { label: "Badges", value: 20, color: "#273540" },
      ],
    },
    orderPills: ["Diplomas", "Transcripts", "Certificates"],
    directory: [
      { name: "Mr. David Okafor", role: "Counselor", initials: "DO" },
      { name: "Ms. Elena Reyes", role: "Registrar", initials: "ER" },
    ],
  },
];

/** Standalone badges not tied to an attended school. */
export const OTHER_BADGES = [
  { id: "ob-1", title: "Data Analysis with Python", issuer: "Coursera", date: "March 14, 2025", earned: "2025-03-14" },
  { id: "ob-2", title: "Project Management Basics", issuer: "LinkedIn Learning", date: "November 2, 2024", earned: "2024-11-02" },
  { id: "ob-3", title: "First Aid and CPR", issuer: "American Red Cross", date: "August 20, 2024", earned: "2024-08-20" },
  { id: "ob-4", title: "Volunteer Leadership", issuer: "City of Portland", date: "July 9, 2023", earned: "2023-07-09" },
];

export function schoolById(id) {
  if (id === REGISTRATION_SCHOOL.id) return REGISTRATION_SCHOOL;
  return SCHOOLS.find((s) => s.id === id);
}

/**
 * Everything the learner holds from the schools they attend, credentials and
 * school-issued badges together, each tagged with where it came from.
 *
 * Badges are in here because a school's badges count towards the figure its
 * donut shows. Leaving them out made the list say six where the chart said 17.
 */
export function allCredentials(schools = SCHOOLS) {
  return schools.flatMap((s) => [
    ...s.credentials.map((c) => ({ ...c, schoolId: s.id, school: s.name })),
    ...s.badges.map((b) => ({
      ...b,
      type: "Badge",
      thumb: "badge",
      schoolId: s.id,
      school: s.name,
    })),
  ]);
}

/** One colour per credential type, so a type looks the same in every chart. */
export const TYPE_COLORS = {
  Certificate: "#0f7b74",
  Diploma: "#c54396",
  Transcript: "#7f77dd",
  "Diploma Verification": "#8f4200",
  Badge: "#273540",
};

/**
 * Donut segments counted from a set of items rather than written by hand, so
 * the chart cannot drift from the list beside it — including when a filter
 * takes rows out of that list.
 *
 * Values are raw counts; DonutChart normalises them itself.
 */
export function donutFor(items) {
  const counts = new Map();
  for (const item of items) {
    counts.set(item.type, (counts.get(item.type) ?? 0) + 1);
  }
  const segments = [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .map(([type, value]) => ({
      label: value === 1 ? type : `${type}s`,
      value,
      color: TYPE_COLORS[type] ?? "#6a7883",
    }));
  return { total: String(items.length), segments };
}
