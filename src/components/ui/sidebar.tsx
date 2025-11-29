/* eslint-disable @typescript-eslint/no-explicit-any */
import { cn } from "@/lib/utils";
import React from "react";
import { AnimatePresence, motion } from "motion/react";
import { Link as RouterLink } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { SidebarProvider, useSidebar } from "@/context/useSidebar";
import { MdOutlineCancel } from "react-icons/md";
import { GiHamburgerMenu } from "react-icons/gi";


interface Links {
  label: string;
  href?: string;
  icon: React.JSX.Element | React.ReactNode;
  onClick?: () => void;
}


export const Sidebar = ({
  children,
  open,
  setOpen,
  animate,
}: {
  children: React.ReactNode;
  open?: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  animate?: boolean;
}) => {
  return (
    <SidebarProvider open={open} setOpen={setOpen} animate={animate}>
      {children}
    </SidebarProvider>
  );
};

export const SidebarBody = (props: React.ComponentProps<typeof motion.div>) => {
  return (
    <>
      <DesktopSidebar {...props} />
      <MobileSidebar {...(props as React.ComponentProps<"div">)} />
    </>
  );
};

export const DesktopSidebar = ({
  className,
  children,
  ...props
}: React.ComponentProps<typeof motion.div>) => {
  const { open, setOpen, animate } = useSidebar();
  return (
    <>
      <motion.div
        className={cn(
          "px-4 py-4 hidden fixed h-screen md:flex md:flex-col bg-slate-800 text-white w-[300px] shrink-0",
          className
        )}
        animate={{
          width: animate ? (open ? "200px" : "55px") : "300px",
        }}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        {...props}
      >
        {children}
      </motion.div>
    </>
  );
};

export const MobileSidebar = ({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) => {
  const { open, setOpen } = useSidebar();
  return (
    <>
      <div
        className={cn(
          "h-10 px-2 py-4 flex flex-row md:hidden items-center justify-between bg-slate-900 w-full"
        )}
        {...props}
      >
        <div className="flex justify-end z-20 w-full">
        <GiHamburgerMenu
            className="text-neutral-200"
            onClick={() => setOpen(!open)}
          />
        </div>
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ x: "-100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "-100%", opacity: 0 }}
              transition={{
                duration: 0.3,
                ease: "easeInOut",
              }}
              className={cn(
                "fixed h-full w-full inset-0 bg-slate-900 p-10 z-[100] flex flex-col justify-between",
                className
              )}
            >
              <div
                className="absolute right-10 top-10 z-50 text-white"
                onClick={() => setOpen(!open)}
              >
                <MdOutlineCancel/>
              </div>
              {children}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export const SidebarLink = ({
  link,
  className,
  ...props
}: {
  link: Links;
  className?: string;
}) => {
  const { open, animate, setOpen } = useSidebar();
  const isLink = !!link.href;
  const Wrapper: any = isLink ? RouterLink : "button";
  const location = useLocation();

  const isActive = isLink && location.pathname === link.href;

  const handleClick = (e: any) => {
    if (link.onClick) {
      e.preventDefault?.();
      link.onClick();
    }

    // Cierra el sidebar si es mobile
    if (window.innerWidth < 768) {
      setOpen(false);
    }
  };

  return (
    <Wrapper
      {...(isLink ? { to: link.href } : {})}
      onClick={handleClick}
      className={cn(
        "flex items-center justify-start gap-2 group/sidebar py-2",
        isActive ? " text-violet-500 font-semibold " : "text-slate-500 dark:text-white ",
        className
      )}
      {...props}
    >
      {link.icon}
      <motion.span
        animate={{
          display: animate ? (open ? "inline-block" : "none") : "inline-block",
          opacity: animate ? (open ? 1 : 0) : 1,
        }}
        className="text-sm group-hover/sidebar:translate-x-1 transition duration-150 whitespace-pre inline-block !p-0 !m-0"
      >
        {link.label}
      </motion.span>
    </Wrapper>
  );
};
