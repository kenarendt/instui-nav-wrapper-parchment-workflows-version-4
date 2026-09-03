import AdminHub from "../screens/AdminHub.jsx";
import LearnerHub from "../screens/LearnerHub.jsx";
import ServiceDashboard from "../screens/ServiceDashboard.jsx";
import SchoolSelect from "../screens/SchoolSelect.jsx";
import LearnerDashboard from "../screens/LearnerDashboard.jsx";
import PlatformSettings from "../screens/PlatformSettings.jsx";
import ParchmentCredentials from "../screens/ParchmentCredentials.jsx";
import { useBrowser } from "./BrowserContext.jsx";

/**
 * ServiceTab — a service tab shows its dashboard, or the school selection
 * interstitial while it still needs a school.
 *
 * An admin who works for several schools has to say which one before the
 * dashboard means anything. That choice used to be a modal over whatever was
 * behind it; now it's the tab's own page until a school is set, and clearing
 * the school ("Change schools" in the account menu) brings it back.
 */
function ServiceTab({ tab }) {
  const { multiSchool } = useBrowser();
  const serviceId = tab.params?.serviceId;
  if (multiSchool && !tab.params?.schoolId) {
    return <SchoolSelect serviceId={serviceId} />;
  }
  return <ServiceDashboard serviceId={serviceId} />;
}

/**
 * Maps a tab `kind` to the page component that renders inside the tab.
 */
export function renderPage(tab) {
  switch (tab.kind) {
    case "adminHub":
      return <AdminHub />;
    case "learnerHub":
      return <LearnerHub />;
    case "service":
      return <ServiceTab tab={tab} />;
    case "learnerDashboard":
      return <LearnerDashboard params={tab.params} />;
    case "platformSettings":
      return <PlatformSettings />;
    case "parchmentCredentials":
      return <ParchmentCredentials />;
    default:
      return null;
  }
}
