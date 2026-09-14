/**
 * SchoolCrest — fictional school crest placeholders. Original artwork, not any
 * real institution. `variant` selects the school treatment.
 */
export default function SchoolCrest({ size = 40, variant = "bambusa" }) {
  if (variant === "generic") {
    // No single school — used where an admin's view spans all of their schools.
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 40 40"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <rect x="4" y="4" width="32" height="32" rx="8" fill="#e3e7ec" />
        <path d="M20 10 L29 15 H11 Z" fill="#6a7883" />
        <rect x="12.5" y="16.5" width="15" height="10" rx="1.2" fill="#8d959f" />
        <rect x="15" y="19" width="3" height="3" rx="0.6" fill="#e3e7ec" />
        <rect x="22" y="19" width="3" height="3" rx="0.6" fill="#e3e7ec" />
        <rect x="18.5" y="22.5" width="3" height="4" rx="0.6" fill="#e3e7ec" />
        <rect x="10" y="27.5" width="20" height="2.2" rx="1.1" fill="#6a7883" />
      </svg>
    );
  }

  if (variant === "panda") {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 40 40"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          d="M20 3 L34 8 V19 C34 28 28 34 20 37 C12 34 6 28 6 19 V8 Z"
          fill="#1f6b4f"
          stroke="#124832"
          strokeWidth="1"
        />
        {/* panda face */}
        <circle cx="20" cy="19" r="8.5" fill="#ffffff" />
        <ellipse cx="13.5" cy="12.5" rx="3" ry="3.4" fill="#173a2a" />
        <ellipse cx="26.5" cy="12.5" rx="3" ry="3.4" fill="#173a2a" />
        <ellipse cx="16.6" cy="18" rx="2" ry="2.6" fill="#173a2a" />
        <ellipse cx="23.4" cy="18" rx="2" ry="2.6" fill="#173a2a" />
        <circle cx="20" cy="22.4" r="1.5" fill="#173a2a" />
      </svg>
    );
  }
  if (variant === "meridian") {
    // Meridian Community College — teal shield with a rising-sun arc.
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 40 40"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          d="M20 3 L34 8 V19 C34 28 28 34 20 37 C12 34 6 28 6 19 V8 Z"
          fill="#0f7b74"
          stroke="#0a544f"
          strokeWidth="1"
        />
        <path d="M10 25 H30" stroke="#ffffff" strokeWidth="1.8" strokeLinecap="round" />
        <path
          d="M12.5 25 A7.5 7.5 0 0 1 27.5 25"
          fill="none"
          stroke="#f2c14e"
          strokeWidth="2.2"
        />
        <path d="M20 11 V14" stroke="#f2c14e" strokeWidth="1.6" strokeLinecap="round" />
        <path d="M13.5 13.5 L15.4 15.6" stroke="#f2c14e" strokeWidth="1.6" strokeLinecap="round" />
        <path d="M26.5 13.5 L24.6 15.6" stroke="#f2c14e" strokeWidth="1.6" strokeLinecap="round" />
        <rect x="12" y="28.5" width="16" height="3.5" rx="1" fill="#ffffff" opacity="0.9" />
      </svg>
    );
  }

  if (variant === "appletree") {
    // Apple Tree High School — a green roundel with a tree, matching the
    // registration reference. Original artwork, like the rest of these.
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 40 40"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <circle cx="20" cy="20" r="17" fill="#ffffff" stroke="#1f8a4c" strokeWidth="1.6" />
        <circle cx="20" cy="20" r="13.5" fill="#ffffff" stroke="#1f8a4c" strokeWidth="1" />
        <circle cx="20" cy="17" r="6.6" fill="#1f8a4c" />
        <circle cx="15.2" cy="19.4" r="4.2" fill="#1f8a4c" />
        <circle cx="24.8" cy="19.4" r="4.2" fill="#1f8a4c" />
        <rect x="18.9" y="21" width="2.2" height="7" rx="1" fill="#2f6b43" />
        <path d="M13 28.5 H27" stroke="#1f8a4c" strokeWidth="1.4" strokeLinecap="round" />
      </svg>
    );
  }

  if (variant === "elbert") {
    // Mount Elbert University — maroon shield with a snow-capped peak.
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 40 40"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          d="M20 3 L34 8 V19 C34 28 28 34 20 37 C12 34 6 28 6 19 V8 Z"
          fill="#7d2340"
          stroke="#55162b"
          strokeWidth="1"
        />
        <path d="M9 27 L17 14 L22 21 L25.5 16 L31 27 Z" fill="#ffffff" opacity="0.92" />
        <path d="M14.6 18 L17 14 L19.4 18 Z" fill="#e7b73b" />
        <rect x="12" y="29" width="16" height="3" rx="1" fill="#ffffff" opacity="0.75" />
      </svg>
    );
  }

  // Bambusa University — navy shield with gold mortarboard and banner.
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M20 3 L34 8 V19 C34 28 28 34 20 37 C12 34 6 28 6 19 V8 Z"
        fill="#1d354f"
        stroke="#12233a"
        strokeWidth="1"
      />
      <path d="M20 13 L29 16.5 L20 20 L11 16.5 Z" fill="#e7b73b" />
      <path d="M20 20 L20 24" stroke="#e7b73b" strokeWidth="1.4" strokeLinecap="round" />
      <circle cx="20" cy="24.4" r="1.2" fill="#e7b73b" />
      <path
        d="M24 18 V22 C24 23.4 22.2 24.4 20 24.4 C17.8 24.4 16 23.4 16 22 V18"
        fill="none"
        stroke="#e7b73b"
        strokeWidth="1.4"
      />
      <rect x="12" y="27.5" width="16" height="4.5" rx="1" fill="#ffffff" opacity="0.9" />
    </svg>
  );
}
