import Dashboard from "../components/Dashboard";
import { UserTabsProvider } from "../context/UserTabsContext";

export default function VantageScraperPage() {
  return (
    <UserTabsProvider>
      <Dashboard />
    </UserTabsProvider>
  );
}

