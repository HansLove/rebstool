import { lazy } from "react";
import { withSuspense } from "./withSuspense";
const EarningsTable = lazy(
  () => import("../../pages/earningsReports/EarningsTable")
);
const Withdrawals = lazy(() => import("../../pages/withdrawals/Withdrawals"));
const PotentialProfit = lazy(
  () => import("../../modules/analytics/potentialProfit/PotentialProfit")
);
export const sharedRoutes = [
  {
    path: "earningReports",
    element: withSuspense(EarningsTable, "Loading reports…"),
  },
  {
    path: "withdrawals",
    element: withSuspense(Withdrawals, "Loading withdrawals…"),
  },
  {
    path: "potential-profit",
    element: withSuspense(PotentialProfit, "Loading potential…"),
  },
];
