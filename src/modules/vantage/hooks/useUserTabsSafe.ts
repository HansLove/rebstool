import { useContext } from "react";
import { UserTabsContext } from "../context/UserTabsContext";

/**
 * Safe hook to use UserTabs context - returns null values if context not available
 * This allows the sidebar to work on pages that don't have the UserTabsProvider
 */
export function useUserTabsSafe() {
  try {
    const context = useContext(UserTabsContext);
    return context || null;
  } catch {
    return null;
  }
}

