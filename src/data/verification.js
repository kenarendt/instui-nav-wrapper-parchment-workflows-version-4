/**
 * Learner ID verification states.
 *
 * Learners are put through an enhanced ID check — they upload a government
 * issued ID. None of that process is built here; what the prototype shows is
 * where a learner stands afterwards, in the account panel, with the action that
 * moves them on.
 *
 * Three states, and the differences between them matter:
 *   - verified: done, and still good. It keeps a Reverify action anyway, since
 *     a learner may need to redo the check after changing their name or ID.
 *   - reverify: they were verified and it has lapsed. Same action, different
 *     urgency.
 *   - unverified: never done. The action is Verify, not Reverify — telling
 *     someone to redo something they have never done is confusing.
 *
 * Admins have no state here at all. Their standing comes from the institution
 * that granted their access, not from an ID check.
 *
 * Wording and colours come from the production design. Each state pairs a
 * colour with an icon and its own words, so none of it rests on colour alone.
 */
export const VERIFICATION = {
  verified: {
    id: "verified",
    label: "Verified",
    color: "success",
    icon: "shield-check",
    action: "Reverify",
  },
  reverify: {
    id: "reverify",
    label: "Reverification Required",
    color: "warning",
    icon: "alert",
    action: "Reverify",
  },
  unverified: {
    id: "unverified",
    label: "Not Verified",
    color: "danger",
    icon: "shield-off",
    action: "Verify",
  },
};

/**
 * Cycle order for the prototype's press-to-cycle affordance: best case, then
 * the two that need something from the learner.
 */
export const VERIFICATION_ORDER = ["verified", "reverify", "unverified"];

export function verificationById(id) {
  return VERIFICATION[id];
}

export function nextVerification(id) {
  const i = VERIFICATION_ORDER.indexOf(id);
  return VERIFICATION_ORDER[(i + 1) % VERIFICATION_ORDER.length];
}
