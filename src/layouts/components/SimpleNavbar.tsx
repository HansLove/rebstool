/* eslint-disable @typescript-eslint/no-explicit-any */
import { FiLogOut, FiMoon, FiSun } from "react-icons/fi";
import { X, User } from "lucide-react";
import { SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import { MenuLogo } from "@/layouts/components/MenuLogo";
import { LogoIcon } from "@/components/LogoIcon";
import { useLayout } from "@/layouts/hooks/useLayout";
import { useUserTabsSafe } from "@/modules/vantage/hooks/useUserTabsSafe";

interface SimpleNavbarProps {
  menu?: any[];
  logout?: () => void;
  getUser?: () => any;
  open?: boolean;
}

export default function SimpleNavbar({
  menu = [],
  logout,
  open = true,
}: SimpleNavbarProps) {
  const { isDarkMode, toggleDarkMode } = useLayout();
  const userTabsContext = useUserTabsSafe();
  const tabs = userTabsContext?.tabs || [];
  const activeTabId = userTabsContext?.activeTabId || null;
  const setActiveTab = userTabsContext?.setActiveTab || (() => {});
  const removeTab = userTabsContext?.removeTab || (() => {});
  const closeAllTabs = userTabsContext?.closeAllTabs || (() => {});

  return (
    <SidebarBody className="justify-between gap-10 bg-white dark:bg-gray-800 text-black dark:text-white">
      <div className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto">
        {open ? <MenuLogo /> : <LogoIcon />}

        {/* Route Navigation */}
        <div className="mt-8 flex flex-col gap-2">
          {menu.map((link, idx) => (
            <SidebarLink key={idx} link={link} />
          ))}
        </div>

        {/* User Tabs Section */}
        {tabs.length > 0 && (
          <div className="mt-8 border-t border-gray-300 dark:border-gray-700 pt-4">
            <div className="flex items-center justify-between mb-2 px-2">
              <span className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">
                {open ? "User Tabs" : ""}
              </span>
              {tabs.length > 1 && open && (
                <button
                  onClick={closeAllTabs}
                  className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  title="Close All"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>
            <div className="flex flex-col gap-1">
              {tabs.map((tab) => (
                <div
                  key={tab.id}
                  className={`
                    flex items-center justify-between gap-2 px-2 py-1.5 rounded-lg cursor-pointer group
                    ${activeTabId === tab.id 
                      ? "bg-blue-500 text-white" 
                      : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                    }
                  `}
                  onClick={() => setActiveTab(tab.id)}
                >
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <User className={`h-4 w-4 shrink-0 ${activeTabId === tab.id ? "text-white" : "text-gray-500"}`} />
                    {open && (
                      <span className="text-sm truncate">{tab.user.name}</span>
                    )}
                  </div>
                  {open && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeTab(tab.id);
                      }}
                      className={`opacity-0 group-hover:opacity-100 p-0.5 rounded hover:bg-black/10 dark:hover:bg-white/10 transition-opacity ${
                        activeTabId === tab.id ? "opacity-100" : ""
                      }`}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-4">
        <SidebarLink
          link={{
            label: "Logout",
            href: "#",
            icon: <FiLogOut className="h-5 w-5 shrink-0 text-red-500" />,
            onClick: logout,
          }}
        />
        <SidebarLink
          link={{
            label: "Theme",
            href: "#",
            icon: isDarkMode ? (
              <FiSun className="h-5 w-5 shrink-0 text-yellow-500" />
            ) : (
              <FiMoon className="h-5 w-5 shrink-0 text-purple-500" />
            ),
            onClick: toggleDarkMode,
          }}
        />
      </div>
    </SidebarBody>
  );
}

