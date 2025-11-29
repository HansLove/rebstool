// src/core/hooks/useUserAnalyzer.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useState } from "react";
import { UserAnalyzer } from "@/core/analyzers/UserAnalyzer.ts";

export function useUserAnalyzer(dataList: any[] = [], config: { commissionRequired?: boolean } = {}) {
  const [nameFilter, setNameFilter] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const [minDeposit, setMinDeposit] = useState(300);
  const [minVolume, setMinVolume] = useState(1);

  // Aplica primero el filtro de nombre
  const listAfterNameFilter = useMemo(() => {
    if (!nameFilter) return dataList;
    return dataList.filter(item =>
      item.customer_name
        ?.toString()
        .toLowerCase()
        .includes(nameFilter.toLowerCase())
    );
  }, [dataList, nameFilter]);

  const analyzer = useMemo(() => {

    const a = new UserAnalyzer(listAfterNameFilter)
      .withMinDeposit(minDeposit)
      .withMinVolume(minVolume)
      .withSort(sortBy, sortOrder);

    if (config.commissionRequired) a.withCommissionRequired();
    return a;
  }, [listAfterNameFilter, minDeposit, minVolume, sortBy, sortOrder]);

  const summary = useMemo(() => analyzer.getPotentialProfitUsers(), [analyzer]);
  const {untriggerList,summaryUntrigger} = useMemo(() => analyzer.getUntriggeredDeposits(), [analyzer]);

  const handleSort = (key: string) => {
    if (sortBy === key) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(key);
      setSortOrder("asc");
    }
  };

  return {
    getPotentialProfitUsers: () => summary.potentialProfitList,
    getSummary: () => summary,
    getUntriggerDeposits:() => untriggerList,
    getSummaryUntrigger: () => summaryUntrigger,
    sortBy,
    sortOrder,
    setSortBy,
    setSortOrder,
    minDeposit,
    setMinDeposit,
    minVolume,
    setMinVolume,
    handleSort,
    nameFilter,
    setNameFilter,
   };
}
