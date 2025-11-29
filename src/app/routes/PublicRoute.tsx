import { JSX } from "react";
import { Navigate, useLocation } from "react-router-dom";

export default function PublicRoute(
    {
        token,
        children,
    }: {
        token: string | null;
        children: JSX.Element;
    }
) {
    const location = useLocation();
    return token ? (
        <Navigate to="/dashboard" state={{ from: location }} replace />
      ) : (
        children
      );
}
