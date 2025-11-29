/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { JSX, lazy } from "react";
import { Routes, Route } from "react-router-dom";
// Layouts & Providers
import PrivateLayout from "@/components/PrivateLayout";
import SubsLayout from "@/layouts/SubsLayout";
// Routes Shared
import { sharedRoutes } from "./sharedRoutes";
// Public Pages
// import InvitationLinkForNewSubAffilliate from "@/pages/invitationLink/InvitationLinkForNewSubAffilliate";
import EmailVerification from "@/pages/auth/login/EmailVerification";
import Login from "@/pages/auth/login/Login";
import useAuth from "@/core/hooks/useAuth";
import { subsRoutes } from "./subsRoutes";
import { affiliateRoutes } from "./affilliatesRoutes";
import PublicRoute from "./PublicRoute";
import { RequireAuth } from "./RequireAuth";
// import ReferralForm from "@/pages/marketing/forms/ReferralForm";
import MasterAffiliateInvitation from "@/modules/affiliates/components/MasterAffiliateInvitation";
import MasterLayout from "@/layouts/MasterLayout";
import InvitationLinkForNewSubAffilliate from "@/modules/marketing/invitationLink/InvitationLinkForNewSubAffilliate";
import ReferralForm from "@/modules/marketing/forms/ReferralForm";
import TwoFactorAuth from "@/pages/auth/TwoFactorAuth";
// Lazy-Loaded
const LandingPage = lazy(() => import("../../pages/landingPage/LandingPage"));
const HowItWorksDetailed = lazy(() => import("../../pages/landingPage/components/HowItWorksDetailed"));
const PartnerLandingPage = lazy(() => import("../../pages/landingPage/PartnerLandingPage"));


export default function AppRouter(): JSX.Element {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();

  useEffect(() => {
    try {
      const raw = localStorage.getItem("user");
      const parsed = raw ? JSON.parse(raw) : null;
      setUser(parsed);
    } catch (err) {
      console.warn("❌ Failed to parse user from localStorage:", err);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  if (loading)
    return <div className="text-white p-10">Loading user info...</div>;

  // 1 = Affiliate, 2 = Sub-affiliate
  const isAffiliate = user?.rol < 2;
  const LayoutComponent = isAffiliate ? MasterLayout : SubsLayout;
  const routes = isAffiliate ? affiliateRoutes : subsRoutes;

  return (
    <Routes>
      {/* Public */}
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
      
      <Route
        path="/partners"
        element={
          <PublicRoute token={token}>
            <MasterAffiliateInvitation/>
          </PublicRoute>
        }
      />
      
      <Route
        path="/how-it-works"
        element={
          <PublicRoute token={token}>
            <HowItWorksDetailed />
          </PublicRoute>
        }
      />
      <Route
        path="/invite/:code"
        element={
          <PublicRoute token={token}>
            <InvitationLinkForNewSubAffilliate />
          </PublicRoute>
        }
      />

      <Route path="/twofactor" element={<TwoFactorAuth email="" />} />
      {/* Partner Landing Pages - Dynamic Routes */}
      <Route
        path="/partner/:partnerSlug"
        element={
          <PublicRoute token={token}>
            <PartnerLandingPage />
          </PublicRoute>
        }
      />

      <Route
        path="/emailVerification/:token"
        element={
          <PublicRoute token={token}>
            <EmailVerification />
          </PublicRoute>
        }
      />

      <Route
        path="/form"
        element={
          <PublicRoute token={token}>
            <ReferralForm/>
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

      {/* <Route
        path="/signup"
        element={
          <PublicRoute token={token}>
            <Register />
          </PublicRoute>
        }
      /> */}

      {/* Protected */}
      <Route
        element={
          <RequireAuth>
            <PrivateLayout />
          </RequireAuth>
        }
      >
        <Route
          element={
            <RequireAuth>
              <PrivateLayout />
            </RequireAuth>
          }
        >
          <Route element={<LayoutComponent />}>
            {routes.map(({ path, element }) => (
              <Route key={path} path={path} element={element} />
            ))}
            {sharedRoutes.map(({ path, element }) => (
              <Route key={`shared-${path}`} path={path} element={element} />
            ))}
          </Route>
        </Route>
      </Route>

      {/* Fallback */}
      {/* <Route path="*" element={<Navigate to="/" replace />} /> */}
    </Routes>
  );
}
