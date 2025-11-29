import { MdCenterFocusStrong } from "react-icons/md";
import { motion } from "motion/react";


export const MenuLogo = () => (
    <a
      href="/"
      className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-slate-500 dark:text-white"
    >
      <MdCenterFocusStrong className="w-4 h-4" />
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-medium whitespace-pre text-slate-500 dark:text-white"
      >
        Afill
      </motion.span>
    </a>
  );