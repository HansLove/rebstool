/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { http } from "@/core/utils/http_request";
import useAuth from "@/core/hooks/useAuth";

/**
 * Custom hook for fetching sub-affiliate dashboard data
 * 
 * Centralizes data fetching logic for the SubsLayout component.
 * Returns registration reports, deal information, and loading/error states.
 */

interface SubsDashboardData {
  registrationsReport: any[];
  deal: number;
  isLoading: boolean;
  error: string | null;
}

export function useSubsDashboardData(): SubsDashboardData {
  const [registrationsReport, setRegistrationsReport] = useState<any[]>([]);
  const [deal, setCurrentDeal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { getUser } = useAuth();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const accountId = getUser()?.id;
        
        if (!accountId) {
          throw new Error("No account ID found");
        }

        const response = await http.get(`subaffiliate/dashboard/${accountId}`);
        
        console.log("📊 Sub-affiliate dashboard data:", response.data);
        
        setCurrentDeal(response.data.deal || 0);
        setRegistrationsReport(response.data.data || []);
      } catch (err: any) {
        const errorMessage = err.message || "Failed to fetch dashboard data";
        console.error("❌ Dashboard data fetch error:", errorMessage);
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [getUser]);

  return {
    registrationsReport,
    deal,
    isLoading,
    error,
  };
}

