/* eslint-disable @typescript-eslint/no-explicit-any */

import { getNestedValue } from "@/core/utils/object";

export class UserAnalyzer {
  private rawData: any[];
  private minDeposit = 300;
  private minVolume = 1;
  // private commissionRequired = false;
  private sortBy = '';
  private sortOrder: 'asc' | 'desc' = 'asc';

  constructor(data: any[] = []) {
    this.rawData = data;
  }

  withMinDeposit(value: number) {
    this.minDeposit = value;
    return this;
  }

  withMinVolume(value: number) {
    this.minVolume = value;
    return this;
  }

  withCommissionRequired() {
    // this.commissionRequired = true;
    return this;
  }

  withSort(by: string, order: 'asc' | 'desc') {
    this.sortBy = by;
    this.sortOrder = order;
    return this;
  }

  getPotentialProfitUsers() {
    const result: any[] = [];
    let missingDepositSum = 0;
    let missingVolumeSum = 0;
  
    for (const entry of this.rawData) {
      const net = entry.net_deposits || 0;
      const vol = entry.volume || 0;
      const commission = entry?.commission || 0;
      const withdrawals = entry?.ActivityReport?.Withdrawals || 0;
  
      if (withdrawals > 0) continue;
      if (commission > 0) continue;
  
      const needsDeposit = net < this.minDeposit;
      const needsVolume = vol < this.minVolume;
  
      // if (!needsDeposit && !needsVolume) continue;
      if (!needsDeposit && !needsVolume) continue;
  
      const missingDeposit = needsDeposit ? this.minDeposit - net : 0;
      const missingVolume = needsVolume ? this.minVolume - vol : 0;
  
      missingDepositSum += missingDeposit;
      missingVolumeSum += missingVolume;
  
      result.push({
        ce_user_id: entry.ce_user_id,
        customer_name: entry?.customer_name || "N/A",
        net_deposits: net,
        volume: vol,
        commission,
        missingDeposit,
        missingVolume,
        registration_date: entry.registration_date,
      });
    }
  
    // Sorting
    if (this.sortBy) {
      result.sort((a, b) => {
        const aVal = getNestedValue(a, this.sortBy);
        const bVal = getNestedValue(b, this.sortBy);
  
        if (typeof aVal === 'string' && typeof bVal === 'string') {
          return this.sortOrder === 'asc'
            ? aVal.localeCompare(bVal)
            : bVal.localeCompare(aVal);
        }
  
        if (aVal instanceof Date && bVal instanceof Date) {
          return this.sortOrder === 'asc'
            ? aVal.getTime() - bVal.getTime()
            : bVal.getTime() - aVal.getTime();
        }
  
        const aNum = Number(aVal);
        const bNum = Number(bVal);
        if (!isNaN(aNum) && !isNaN(bNum)) {
          return this.sortOrder === 'asc' ? aNum - bNum : bNum - aNum;
        }
  
        return 0;
      });
    }
  
    return {
      potentialProfitList: result,
      totalMissingDeposit: missingDepositSum,
      totalMissingVolume: missingVolumeSum,
      averageMissingDeposit: result.length ? missingDepositSum / result.length : 0,
      averageMissingVolume: result.length ? missingVolumeSum / result.length : 0,
    };
  }
  

  getUntriggeredDeposits() {
    const filtered = this.rawData.filter((item: any) => {
      const withdrawals = item?.ActivityReport?.Withdrawals || 0;
      const net = item.net_deposits || 0;
      const vol = item.volume || 0;
      const commission = item?.commission || 0;

      return withdrawals === 0 && net >= this.minDeposit && vol >= this.minVolume &&  commission == 0;
    });

    const stats = filtered.reduce(
      (acc, item) => {
        const net = item.net_deposits || 0;
        const vol = item.volume || 0;
        const commission = item?.commission || 0;

        acc.totalNetDeposits += net;
        acc.totalVolume += vol;

        if (vol >= 1) {
          acc.validTriggerCount += 1;
          acc.validTriggerAmount += commission;
        }

        return acc;
      },
      {
        count: filtered.length,
        totalNetDeposits: 0,
        totalVolume: 0,
        validTriggerCount: 0,
        validTriggerAmount: 0,
      }
    );

    stats.potentialCommission = stats.validTriggerAmount;

    const sortedList = [...filtered];
    if (this.sortBy) {
      sortedList.sort((a: any, b: any) => {
        const valA = this.sortBy === 'customer_name' ? a?.customer_name || '' : a[this.sortBy] || 0;
        const valB = this.sortBy === 'customer_name' ? b?.customer_name || '' : b[this.sortBy] || 0;

        return typeof valA === 'string'
          ? this.sortOrder === 'asc'
            ? valA.localeCompare(valB)
            : valB.localeCompare(valA)
          : this.sortOrder === 'asc'
          ? valA - valB
          : valB - valA;
      });
    }

    return {
      untriggerList: sortedList,
      summaryUntrigger: stats
    };
  }
}
