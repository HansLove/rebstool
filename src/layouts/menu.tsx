import { FaCalendarWeek, FaUpDownLeftRight } from "react-icons/fa6";
import { GiMoneyStack, GiProfit } from "react-icons/gi";
import { MdDashboard, MdHealthAndSafety, MdOutlineRunningWithErrors } from "react-icons/md";
import { FaUsers } from "react-icons/fa6";

// Ítems que son idénticos en ambos menús
const commonMenuItems = [
  {
    label: "Earnings Reports",
    href: "/earningReports",
    icon: <GiMoneyStack className="h-5 w-5 shrink-0" />,
  },
  {
    label: "Untrigger",
    href: "/untriggered",
    icon: <FaUpDownLeftRight className="h-5 w-5 shrink-0" />,
  },
  {
    label: "Withdraws",
    href: "/withdrawals",
    icon: <MdOutlineRunningWithErrors className="h-5 w-5 shrink-0" />,
  },
  {
    label: "Potential Profit",
    href: "/potential-profit",
    icon: <GiProfit className="h-5 w-5 shrink-0" />,
  },
  {
    label: "Journal",
    href: "/journal",
    icon: <FaCalendarWeek className="h-5 w-5 shrink-0" />,
  },
];

// Menú para rol < 3 (affiliate)
export const menu_links = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: <MdDashboard className="h-5 w-5 shrink-0" />,
  },
  // Items comunes
  ...commonMenuItems,
  {
    label: "Subs",
    href: "/subs",
    icon: <FaUsers className="h-5 w-5 shrink-0" />,
  },
  {
    label: "Vantage Scraper",
    href: "/vantage-scraper",
    icon: <MdHealthAndSafety className="h-5 w-5 shrink-0" />,
    adminOnly: true, // Only show for admin users (rol === 1)
  },
];

// Menú para rol >= 3 (sub-affiliate)
export const menu_links_subs = [
  {
    label: "My Dashboard",
    href: "/user",
    icon: <MdDashboard className="h-5 w-5 shrink-0" />,
  },
  // Items comunes (sin el “Subs” al final)
  ...commonMenuItems,
];
