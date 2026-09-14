import ProductMark from "../components/ProductMark.jsx";
import Button from "../components/Button.jsx";
import { productById } from "../data/products.js";
import "./SignIn.css";

/**
 * ProductBoundary — where the prototype stops.
 *
 * The account check is honest about Mastery and Canvas, so the chooser offers
 * them and signing in to one has to go somewhere. This says plainly that the
 * prototype covers Parchment rather than mocking up a product we have not
 * built. A hollow imitation would invite feedback on a design that does not
 * exist, which is worse than an empty hallway.
 */
export default function ProductBoundary({ product, onBack }) {
  const p = productById(product);
  return (
    <div className="signin">
      <div className="signin__bg" aria-hidden="true" />
      <div className="signin__content">
        <div className="signin__card signin__card--boundary">
          <ProductMark product={product} size={64} />
          <h1 className="signin__title">{p?.name ?? "This product"}</h1>
          <p className="signin__subtitle">
            You signed in to {p?.name ?? "this product"}. This prototype covers
            the Parchment experience, so there is nothing further to see here
            yet.
          </p>
          <Button variant="primary" onClick={onBack}>
            Back to sign in
          </Button>
        </div>
      </div>
    </div>
  );
}
