/* eslint-disable @typescript-eslint/no-explicit-any */
// src/pages/potentialProfit/PotentialProfit.tsx
import { useOutletContext } from "react-router-dom";
import { useUserAnalyzer } from "@/core/hooks/useUserAnalyzer";
import { FilterControls } from "./FilterControls";
import { SummaryCards } from "./SummaryCards";
import { ProfitTable } from "./ProfitTable";

export default function PotentialProfit() {
  const { registrationsReport } = useOutletContext<any>();

  const {
    getPotentialProfitUsers,
    getSummary,
    sortBy,
    sortOrder,
    minDeposit,
    setMinDeposit,
    minVolume,
    setMinVolume,
    handleSort,
    nameFilter,
    setNameFilter,
  } = useUserAnalyzer(registrationsReport, { commissionRequired: true });

  const { potentialProfitList } = getSummary();
  const summary = getSummary();

  return (
    <div className="w-full py-8 px-4 mb-20">
      <h1 className="text-2xl text-gray-600 dark:text-slate-100 font-bold mb-6">Users Missing Requirements to Trigger Commissions</h1>

        <FilterControls
        minDeposit={minDeposit}
        setMinDeposit={setMinDeposit}
        minVolume={minVolume}
        setMinVolume={setMinVolume}
        nameFilter={nameFilter}
        setNameFilter={setNameFilter}
      />

      <SummaryCards
        count={potentialProfitList.length}
        totalMissingDeposit={summary.totalMissingDeposit}
        totalMissingVolume={summary.totalMissingVolume}
        averageMissingDeposit={summary.averageMissingDeposit}
        averageMissingVolume={summary.averageMissingVolume}
      />

      <ProfitTable
        data={getPotentialProfitUsers()}
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSort={handleSort}
      />
    </div>
  );
}
