// src/components/PrivateLayout.tsx
import { Navigate, Outlet } from "react-router-dom";
import useAuth from "@/core/hooks/useAuth";
import { GlobalProvider } from "@/context/GlobalProvider";

export default function PrivateLayout() {
  const { isLoggedIn } = useAuth();
  return isLoggedIn() ? <GlobalProvider><Outlet /></GlobalProvider>  : <Navigate to="/" />;
}