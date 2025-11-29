import { Navigate, useLocation } from "react-router-dom";
import useAuth from "@/core/hooks/useAuth";
import { JSX } from "react";

export function RequireAuth({
  children,
}:
{
  children: JSX.Element;
}) {
  const { token } = useAuth();

  const location = useLocation();
  return token ? (
    children
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
}
