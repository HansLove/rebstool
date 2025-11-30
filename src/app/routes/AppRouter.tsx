/* eslint-disable @typescript-eslint/no-explicit-any */
import { JSX, lazy } from "react";
import { Routes, Route } from "react-router-dom";
// Layouts & Providers
import PrivateLayout from "@/components/PrivateLayout";
import SimpleLayout from "@/layouts/SimpleLayout";
// Public Pages
import EmailVerification from "@/pages/auth/login/EmailVerification";
import Login from "@/pages/auth/login/Login";
import PublicRoute from "./PublicRoute";
import { RequireAuth } from "./RequireAuth";
import TwoFactorAuth from "@/pages/auth/TwoFactorAuth";
import { withSuspense } from "./withSuspense";
import useAuth from "@/core/hooks/useAuth";
// Lazy-Loaded
const LandingPage = lazy(() => import("../../pages/landingPage/LandingPage"));
const VantageScraperPage = lazy(() => import("@/modules/vantage/pages/VantageScraperPage"));
const Journal = lazy(() => import("../../pages/journal/Journal"));

export default function AppRouter(): JSX.Element {
  const { token } = useAuth();

  return (
    <Routes>
      {/* Public Routes */}
      {["/", "/home"].map((path) => (
        <Route
          key={path}
          path={path}
          element={
            <PublicRoute token={token}>
              <LandingPage />
            </PublicRoute>
          }
        />
      ))}

      <Route path="/twofactor" element={<TwoFactorAuth email="" />} />

      <Route
        path="/emailVerification/:token"
        element={
          <PublicRoute token={token}>
            <EmailVerification />
          </PublicRoute>
        }
      />

      <Route
        path="/login"
        element={
          <PublicRoute token={token}>
            <Login />
          </PublicRoute>
        }
      />

      {/* Protected Routes */}
      <Route
        element={
          <RequireAuth>
            <PrivateLayout />
          </RequireAuth>
        }
      >
        <Route element={<SimpleLayout />}>
          <Route path="dashboard" element={withSuspense(VantageScraperPage)} />
          <Route path="journal" element={withSuspense(Journal)} />
        </Route>
      </Route>

      {/* Fallback */}
      {/* <Route path="*" element={<Navigate to="/dashboard" replace />} /> */}
    </Routes>
  );
}
