import ServiceDashboard from "../screens/ServiceDashboard.jsx";
import LearnerDashboard from "../screens/LearnerDashboard.jsx";
import PlatformSettings from "../screens/PlatformSettings.jsx";
import ParchmentCredentials from "../screens/ParchmentCredentials.jsx";
import ProductPlaceholder from "../screens/ProductPlaceholder.jsx";

/**
 * Maps a tab `kind` to the page component that renders inside the tab.
 *
 * Version 4 removed three kinds. `adminHub` and `learnerHub` were the two
 * welcome-mat screens; sign-in now resolves straight to a destination, so
 * neither has anything to sit between. The school selection interstitial went
 * with them: a service opens on its default school, and the switcher on the
 * nav's institution mark handles the rest, so a service tab always has a
 * school and always shows a dashboard.
 */
export function renderPage(tab) {
  switch (tab.kind) {
    case "service":
      return <ServiceDashboard serviceId={tab.params?.serviceId} />;
    case "learnerDashboard":
      return <LearnerDashboard params={tab.params} />;
    case "platformSettings":
      return <PlatformSettings />;
    case "parchmentCredentials":
      return <ParchmentCredentials />;
    case "product":
      return <ProductPlaceholder productId={tab.params?.productId} />;
    default:
      return null;
  }
}
