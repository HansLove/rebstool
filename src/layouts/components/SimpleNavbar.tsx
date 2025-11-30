/* eslint-disable @typescript-eslint/no-explicit-any */
import { FiLogOut, FiMoon, FiSun } from "react-icons/fi";
import { SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import { MenuLogo } from "@/layouts/components/MenuLogo";
import { LogoIcon } from "@/components/LogoIcon";
import { useLayout } from "@/layouts/hooks/useLayout";

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

  return (
    <SidebarBody className="justify-between gap-10 bg-white dark:bg-gray-800 text-black dark:text-white">
      <div className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto">
        {open ? <MenuLogo /> : <LogoIcon />}

        <div className="mt-8 flex flex-col gap-2">
          {menu.map((link, idx) => (
            <SidebarLink key={idx} link={link} />
          ))}
        </div>
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

