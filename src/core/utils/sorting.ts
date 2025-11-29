import { getNestedValue } from "./object";

export type SortOrder = 'asc' | 'desc';

export function createHandleSort(
  sortBy: string,
  setSortBy: (key: string) => void,
  sortOrder: SortOrder,
  setSortOrder: (order: SortOrder) => void
) {
  return (key: string) => {
    if (sortBy === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(key);
      setSortOrder("asc");
    }
  };
}

export function universalSort<T = any>(
  data: T[],
  sortBy: string,
  sortOrder: 'asc' | 'desc'
): T[] {
  if (!Array.isArray(data)) return [];

  return [...data].sort((a, b) => {
    const valA = getNestedValue(a, sortBy);
    const valB = getNestedValue(b, sortBy);

    // 1. Convert Dates
    const aDate = new Date(valA);
    const bDate = new Date(valB);
    if (!isNaN(aDate.getTime()) && !isNaN(bDate.getTime())) {
      return sortOrder === "asc" ? aDate.getTime() - bDate.getTime() : bDate.getTime() - aDate.getTime();
    }

    // 2. String comparison
    if (typeof valA === 'string' && typeof valB === 'string') {
      return sortOrder === "asc" ? valA.localeCompare(valB) : valB.localeCompare(valA);
    }

    // 3. Number comparison (fallback)
    const numA = Number(valA ?? 0);
    const numB = Number(valB ?? 0);

    if (!isNaN(numA) && !isNaN(numB)) {
      return sortOrder === "asc" ? numA - numB : numB - numA;
    }

    return 0;
  });
}
