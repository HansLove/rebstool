/**
 * Sub-Affiliate Routes
 * 
 * Organized into logical sections:
 * - CORE: Primary dashboard views (dashboard, resume, one-view)
 * - EARNINGS: Financial tracking (yourEarnings, payouts, performance)
 * - NETWORK: User management (myNetwork, registrations)
 * - RESOURCES: Tools and settings (marketing, tutorial, settings)
 */

import { lazy } from "react";
import { withSuspense } from "./withSuspense";
import { SUBS_ROUTE_PATHS } from "./subsRoutes.config";

// ============================================================================
// CORE ROUTES - Primary Dashboard Views
// ============================================================================
const Payouts = lazy(() =>
  import("@/modules/subAffiliates/pages/Payouts")
);

// Lazy-loaded unified dashboard (new)
const AffillOneViewWireframe = lazy(() =>
  import("@/modules/subAffiliates/pages/AffillOneViewWireframe")
);

// ============================================================================
// EARNINGS ROUTES - Financial Tracking & Performance
// ============================================================================
const YourEarnings = lazy(() =>
  import("@/modules/subAffiliates/pages/PaymentsRegistersTable")
);
const Performance = lazy(() =>
  import("@/modules/analytics/performance/Performance")
);

// ============================================================================
// NETWORK ROUTES - User Network Management
// ============================================================================
const MyNetwork = lazy(() =>
  import("@/pages/myNetwork/Mynetwork")
);
const MyRegistration = lazy(() =>
  import("@/modules/subAffiliates/pages/MyRegistration")
);

// ============================================================================
// RESOURCE ROUTES - Marketing, Tutorials & Settings
// ============================================================================
const MarketingLab = lazy(() =>
  import("@/modules/marketing/MarketingLab")
);
const SubAffiliateTutorial = lazy(() =>
  import("@/modules/subAffiliates/pages/SubAffiliateTutorial")
);
const SubsAffilliatesSettings = lazy(() =>
  import("@/modules/subAffiliates/pages/SubsAffilliateSettings")
);
const LandingPageBuilder = lazy(() =>
  import("@/modules/subAffiliates/pages/LandingPageBuilder")
);

// ============================================================================
// ROUTE DEFINITIONS
// ============================================================================
export const subsRoutes = [
  // CORE - Primary Dashboard Views
  {
    path: SUBS_ROUTE_PATHS.DASHBOARD,
    element: withSuspense(Payouts),
    group: 'core' as const,
  },
  {
    path: SUBS_ROUTE_PATHS.RESUME,
    element: withSuspense(Payouts),
    group: 'core' as const,
  },
  { 
    path: SUBS_ROUTE_PATHS.ONE_VIEW, 
    element: withSuspense(AffillOneViewWireframe),
    group: 'core' as const,
  },

  // EARNINGS - Financial Tracking
  { 
    path: SUBS_ROUTE_PATHS.YOUR_EARNINGS, 
    element: withSuspense(YourEarnings),
    group: 'earnings' as const,
  },
  { 
    path: SUBS_ROUTE_PATHS.PAYOUTS, 
    element: withSuspense(Payouts),
    group: 'earnings' as const,
  },
  { 
    path: SUBS_ROUTE_PATHS.PERFORMANCE, 
    element: withSuspense(Performance),
    group: 'earnings' as const,
  },

  // NETWORK - User Management
  { 
    path: SUBS_ROUTE_PATHS.MY_NETWORK, 
    element: withSuspense(MyNetwork),
    group: 'network' as const,
  },
  { 
    path: SUBS_ROUTE_PATHS.REGISTRATIONS, 
    element: withSuspense(MyRegistration),
    group: 'network' as const,
  },

  // RESOURCES - Tools & Settings
  { 
    path: SUBS_ROUTE_PATHS.MARKETING, 
    element: withSuspense(MarketingLab),
    group: 'resources' as const,
  },
  { 
    path: SUBS_ROUTE_PATHS.TUTORIAL, 
    element: withSuspense(SubAffiliateTutorial),
    group: 'resources' as const,
  },
  { 
    path: SUBS_ROUTE_PATHS.SETTINGS, 
    element: withSuspense(SubsAffilliatesSettings),
    group: 'resources' as const,
  },
  { 
    path: SUBS_ROUTE_PATHS.LANDING_BUILDER, 
    element: withSuspense(LandingPageBuilder),
    group: 'resources' as const,
  },
];
