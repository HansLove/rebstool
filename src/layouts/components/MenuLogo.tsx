import { motion } from "motion/react";
import { RebToolsLogo } from "@/components/RebToolsLogo";


export const MenuLogo = () => (
    <a
      href="/"
      className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal"
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <RebToolsLogo variant="icon-only" width={24} height={24} />
      </motion.div>
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-medium whitespace-pre text-slate-500 dark:text-white"
      >
        RebTools
      </motion.span>
    </a>
  );