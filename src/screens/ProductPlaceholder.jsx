import Wrapper from "../components/Wrapper.jsx";
import Panel from "../components/blocks/Panel.jsx";
import ProductMark from "../components/ProductMark.jsx";
import { account } from "../data/experiences.js";
import { productById } from "../data/products.js";
import "./ProductPlaceholder.css";

/**
 * ProductPlaceholder — where the prototype stops, for Mastery and Canvas.
 *
 * The account check is honest about which products an address reaches, and the
 * services switcher offers them, so picking one has to go somewhere. This says
 * plainly that the prototype covers Parchment rather than mocking up a product
 * we have not built: a hollow imitation would invite feedback on a design that
 * does not exist, which is worse than an empty hallway.
 *
 * It renders inside the simulated browser, in the shared page shell, so the
 * services switcher is still in the top right and the way back to Parchment is
 * exactly where it is on every other screen. A dead end would have made the
 * boundary feel like a fault.
 */
export default function ProductPlaceholder({ productId }) {
  const product = productById(productId);
  if (!product) return null;

  return (
    <Wrapper
      navProps={{
        institutionName: product.name,
        logo: <ProductMark product={productId} size={40} />,
        username: account.name,
        userRole: account.learnerRole,
        // No nav items: every item would belong to a product that isn't built,
        // and a rail of things that do nothing teaches the user nothing.
        items: [],
        productLogo: productId,
      }}
      title={product.name}
      description={product.description}
    >
      <Panel title="Not part of this prototype">
        <div className="prodph">
          <ProductMark product={productId} size={72} />
          <p className="prodph__text">
            This prototype covers the Parchment experience. {product.name} is
            here so the account check and the services switcher can be honest
            about what this email reaches, not to stand in for the real product.
          </p>
          <p className="prodph__text prodph__text--muted">
            Use the services button at the top right to go back to Parchment.
          </p>
        </div>
      </Panel>
    </Wrapper>
  );
}
