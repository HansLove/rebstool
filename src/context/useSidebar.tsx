import React, {
  createContext,
  useContext,
  useState,
  useMemo,
  ReactNode,
  Dispatch,
  SetStateAction,
} from "react";

interface SidebarContextProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  animate: boolean;
}

interface SidebarProviderProps {
  children: ReactNode;
  open?: boolean;
  setOpen?: Dispatch<SetStateAction<boolean>>;
  animate?: boolean;
}

const SidebarContext = createContext<SidebarContextProps | undefined>(undefined);

export function useSidebar() {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
}

export const SidebarProvider: React.FC<SidebarProviderProps> = ({
  children,
  open: controlledOpen,
  setOpen: controlledSetOpen,
  animate = true,
}) => {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);

  const open = controlledOpen ?? uncontrolledOpen;

  const setOpen: Dispatch<SetStateAction<boolean>> =
    controlledSetOpen ?? setUncontrolledOpen;

  // Opcional: evita recrear el objeto en cada render
  const value: SidebarContextProps = useMemo(
    () => ({ open, setOpen, animate }),
    [open, setOpen, animate]
  );
  

  return (
    <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>
  );
};
