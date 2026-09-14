/**
 * Products an account can be tied to.
 *
 * Sign-in starts with an email address and works out what that address can
 * reach before asking for anything else. One product and it goes straight to
 * the password; more than one and it asks which, because the password is per
 * product and guessing wrong wastes an attempt.
 *
 * Only Parchment is built out in this prototype. Mastery and Canvas exist here
 * so the account check has something to find and the chooser has something to
 * show; choosing one lands on a page that says plainly where the prototype
 * stops, rather than a hollow imitation of a product we have not built.
 */

export const PRODUCTS = {
  parchment: {
    id: "parchment",
    name: "Parchment",
    description: "Credentials, transcripts, and academic records.",
    built: true,
  },
  mastery: {
    id: "mastery",
    name: "Mastery",
    description: "Standards-based assessment and mastery tracking.",
    built: false,
  },
  canvas: {
    id: "canvas",
    name: "Canvas",
    description: "Courses, assignments, and coursework.",
    built: false,
  },
};

/** The order the chooser lists them in. */
export const PRODUCT_ORDER = ["parchment", "mastery", "canvas"];

export function productById(id) {
  return PRODUCTS[id];
}

/**
 * What the account check turns up for an email address. In production this is
 * a lookup; here the prototype panel says what to find.
 */
export function productsForAccount({ hasMastery = false, hasCanvas = false } = {}) {
  return PRODUCT_ORDER.filter(
    (id) =>
      id === "parchment" ||
      (id === "mastery" && hasMastery) ||
      (id === "canvas" && hasCanvas)
  ).map((id) => PRODUCTS[id]);
}
