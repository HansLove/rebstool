import { createContext, useContext, useState, ReactNode } from "react";
import type { RetailClient, Account } from "../types";

interface UserTab {
  id: string;
  user: RetailClient;
  account?: Account;
}

interface UserTabsContextType {
  tabs: UserTab[];
  activeTabId: string | null;
  addTab: (user: RetailClient, account?: Account) => void;
  removeTab: (tabId: string) => void;
  setActiveTab: (tabId: string | null) => void;
  closeAllTabs: () => void;
  getActiveTab: () => UserTab | null;
}

export const UserTabsContext = createContext<UserTabsContextType | undefined>(undefined);

export function UserTabsProvider({ children }: { children: ReactNode }) {
  const [tabs, setTabs] = useState<UserTab[]>([]);
  const [activeTabId, setActiveTabId] = useState<string | null>(null);

  const addTab = (user: RetailClient, account?: Account) => {
    const tabId = `user-${user.userId}`;
    setTabs((prev) => {
      const exists = prev.find((tab) => tab.id === tabId);
      if (exists) {
        setActiveTabId(tabId);
        return prev;
      }
      return [...prev, { id: tabId, user, account }];
    });
    setActiveTabId(tabId);
  };

  const removeTab = (tabId: string) => {
    setTabs((prev) => {
      const filtered = prev.filter((tab) => tab.id !== tabId);
      if (activeTabId === tabId) {
        setActiveTabId(filtered.length > 0 ? filtered[0].id : null);
      }
      return filtered;
    });
  };

  const setActiveTab = (tabId: string | null) => {
    setActiveTabId(tabId);
  };

  const closeAllTabs = () => {
    setTabs([]);
    setActiveTabId(null);
  };

  const getActiveTab = () => {
    return tabs.find((tab) => tab.id === activeTabId) || null;
  };

  return (
    <UserTabsContext.Provider
      value={{
        tabs,
        activeTabId,
        addTab,
        removeTab,
        setActiveTab,
        closeAllTabs,
        getActiveTab,
      }}
    >
      {children}
    </UserTabsContext.Provider>
  );
}

export function useUserTabs() {
  const context = useContext(UserTabsContext);
  if (context === undefined) {
    throw new Error("useUserTabs must be used within a UserTabsProvider");
  }
  return context;
}

