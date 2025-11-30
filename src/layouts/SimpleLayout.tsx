import { Outlet } from "react-router-dom";
import { Sidebar } from "@/components/ui/sidebar";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { simpleMenuLinks } from "./menu";
import SimpleNavbar from "./components/SimpleNavbar";
import useAuth from "@/core/hooks/useAuth";
import { useIsMobile } from "./hooks/useIsMobile";
import { useState } from "react";

export default function SimpleLayout() {
  const { logout, getUser } = useAuth();
  const userData = getUser();
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(!isMobile);

  // Filter admin-only menu items (only show for rol === 1)
  const menu = simpleMenuLinks.filter((item: any) => {
    if (item.adminOnly) {
      return userData?.rol === 1;
    }
    return true;
  });

  return (
    <div
      className={cn(
        'relative mx-auto flex h-screen w-full flex-1 flex-col overflow-auto md:flex-row',
        'bg-slate-100 text-slate-500 dark:bg-gray-900 dark:text-white'
      )}
    >
      <Sidebar open={open} setOpen={setOpen}>
        <motion.div
          animate={{ paddingLeft: isMobile ? 0 : open ? 200 : 55 }}
          transition={{ duration: 0.3 }}
          className="w-full"
        >
          <Outlet />
        </motion.div>

        <SimpleNavbar
          menu={menu}
          logout={logout}
          getUser={getUser}
          open={open}
        />
      </Sidebar>
    </div>
  );
}

