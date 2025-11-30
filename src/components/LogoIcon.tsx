import { RebToolsLogo } from "./RebToolsLogo";

export const LogoIcon = () => (
    <a
      href="/"
      className="relative z-20 flex items-center space-x-2 py-1 text-sm text-slate-500 dark:text-white"
    >
       <RebToolsLogo variant="icon-only" width={16} height={16} />
    </a>
  );