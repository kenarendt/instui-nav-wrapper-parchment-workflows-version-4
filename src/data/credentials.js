/**
 * Learner credentials data for the Parchment Credentials screen.
 *
 * A learner collects records across the schools they attend. Each school has
 * its own credentials, badges, insights, directory, and order options.
 *
 * The dashboard shows one school at a time, chosen with the same school
 * switcher the admin side uses. The two views that span schools — all
 * credentials, and badges earned outside any school — are their own pages in
 * the nav rail rather than tabs, since neither belongs to a school.
 *
 * `brandColor` matches the same school on the admin side, so a learner and an
 * admin looking at Bambusa University see the same colour. A school sets this
 * itself, so treat it as decoration: the crest, name and location carry the
 * identity on their own.
 */

export const SCHOOLS = [
  {
    id: "bambusa",
    name: "Bambusa University",
    crest: "bambusa",
    location: "Denver, Colorado",
    country: "United States",
    brandColor: "#1d354f",
    credentials: [
      {
        type: "Diploma",
        title: "Bachelor of Engineering",
        issuer: "Bambusa University School of Engineering",
        date: "May 29, 2026",
        thumb: "diploma",
      },
      {
        type: "Diploma Verification",
        title: "Bachelor of Engineering",
        issuer: "Bambusa University School of Engineering",
        date: "June 12, 2026",
        thumb: "verification",
      },
      {
        type: "Certificate",
        title: "Academic Excellence",
        issuer: "Bambusa University",
        date: "September 22, 2025",
        thumb: "certificate",
      },
    ],
    badges: [
      { title: "Tech Innovator", issuer: "Bambusa University", date: "January 2, 2026" },
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
      {
        type: "Diploma",
        title: "High School Diploma",
        issuer: "Panda High School",
        date: "June 6, 2022",
        thumb: "diploma",
      },
      {
        type: "Transcript",
        title: "Official Academic Transcript",
        issuer: "Panda High School",
        date: "June 10, 2022",
        thumb: "verification",
      },
      {
        type: "Certificate",
        title: "Honor Roll — Senior Year",
        issuer: "Panda High School",
        date: "May 18, 2022",
        thumb: "certificate",
      },
    ],
    badges: [
      { title: "Robotics Club Captain", issuer: "Panda High School", date: "April 3, 2022" },
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
  { title: "Data Analysis with Python", issuer: "Coursera", date: "March 14, 2025" },
  { title: "Project Management Basics", issuer: "LinkedIn Learning", date: "November 2, 2024" },
  { title: "First Aid & CPR", issuer: "American Red Cross", date: "August 20, 2024" },
  { title: "Volunteer Leadership", issuer: "City of Portland", date: "July 9, 2023" },
];

export function schoolById(id) {
  return SCHOOLS.find((s) => s.id === id);
}

/** All credentials across schools, tagged with their source school. */
export function allCredentials() {
  return SCHOOLS.flatMap((s) =>
    s.credentials.map((c) => ({ ...c, school: s.name }))
  );
}

export const ALL_DONUT = {
  total: "17",
  segments: [
    { label: "Certificates", value: 50, color: "#0f7b74" },
    { label: "Diplomas", value: 24, color: "#c54396" },
    { label: "Badges", value: 26, color: "#273540" },
  ],
};
