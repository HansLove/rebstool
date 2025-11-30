import { FaCalendarWeek } from "react-icons/fa6";
import { MdDashboard } from "react-icons/md";

// Menú simplificado para RebTools - Solo Dashboard (Vantage Scraper) y Journal
export const simpleMenuLinks = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: <MdDashboard className="h-5 w-5 shrink-0" />,
  },
  {
    label: "Journal",
    href: "/journal",
    icon: <FaCalendarWeek className="h-5 w-5 shrink-0" />,
  },
];

// Mantener los menús antiguos por compatibilidad temporal (se eliminarán después)
import { FaUpDownLeftRight } from "react-icons/fa6";
import { GiMoneyStack, GiProfit } from "react-icons/gi";
import { MdHealthAndSafety, MdOutlineRunningWithErrors } from "react-icons/md";
import { FaUsers } from "react-icons/fa6";

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

export const menu_links = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: <MdDashboard className="h-5 w-5 shrink-0" />,
  },
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
    adminOnly: true,
  },
];

export const menu_links_subs = [
  {
    label: "My Dashboard",
    href: "/user",
    icon: <MdDashboard className="h-5 w-5 shrink-0" />,
  },
  ...commonMenuItems,
];
