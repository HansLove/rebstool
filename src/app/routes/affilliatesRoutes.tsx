// import { BlockchainProvider } from "../context/BlockchainProvider";
import SyncYourAccount from "@/pages/syncYourAccount/SyncYourAccount";
import { withSuspense } from "./withSuspense";
import {  lazy } from "react";
const UntriggerDeposits = lazy(() => import("../../pages/untrigger/UntriggerDeposits"));
const Settings = lazy(() => import("../../pages/settings/Settings"));
import UsersPage from "@/pages/users/UsersPage";
const ActivyAnalysisPage = lazy(() => import("../../pages/activeInactiveUsers/ActivityAnalysisPage"));
const TopDepositsPage = lazy(() => import("../../pages/topDeposits/TopDepositsPage"));
const WorldMap = lazy(() => import("../../pages/worldMap/WorldMap"));
const Journal = lazy(() => import("../../pages/journal/Journal"));
const AffiliateSettings = lazy(() => import("@/modules/affiliates/pages/AffiliateSettings"));
const VantageScraperPage = lazy(() => import("@/modules/vantage/pages/VantageScraperPage"));
import MasterDashboard from "@/modules/affiliates/MasterDashboard";
import MasterAffiliateDashboard from "@/modules/affiliates/MasterAffiliateDashboard";


export const affiliateRoutes = [
  { path: "dashboard", element: <MasterDashboard/> },
  { path: "syncYourAccount", element: <SyncYourAccount/> },
  { path: "untriggered", element: withSuspense(UntriggerDeposits) },
  { path: "settings", element: withSuspense(Settings) },
  { path: "activyAnalysis", element: <ActivyAnalysisPage /> },
  { path: "topDeposits", element: <TopDepositsPage /> },
  { path: "worldMap", element: <WorldMap /> },
  { path: "journal", element: <Journal /> },
  { path: "users", element: <UsersPage /> },
  { path: "affiliate-settings", element: <AffiliateSettings /> },
  { path: "vantage-scraper", element: withSuspense(VantageScraperPage) },
  // { path: "subs", element: <BlockchainProvider><MasterAffiliateDashboard /></BlockchainProvider> }
  { path: "subs", element: <><MasterAffiliateDashboard /></> }
];