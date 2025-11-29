/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { http } from "@/core/utils/http_request";
import { BACKEND_URL } from "@/core/utils/GlobalVars";

interface UseAffilliateDashboardReturn {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    modal: "user" | "account" | null;
    setModal: React.Dispatch<React.SetStateAction<"user" | "account" | null>>;
    accounts: any[];
    selectedAccountId: number | null;
    setSelectedAccountId: React.Dispatch<React.SetStateAction<number | null>>;
    subAffiliates: any[];
    registrationsReport: any[];
    paymentsRegister: any[];
    loading: boolean;
    loadAccounts: () => Promise<void>;
    isScrapping: boolean;
    scraperError: string | null;
    selectedSubId: string | null;
    setSelectedSubId: React.Dispatch<React.SetStateAction<string | null>>;
    defaultRegistrations: any[];
    customRegistrations: any[];
    runScraper: () => Promise<void>;
}

export default function useAffilliateDashboard(): UseAffilliateDashboardReturn {

    const [open, setOpen] = useState(false);
    const [modal, setModal] = useState<"user" | "account" | null>(null);
    const [accounts, setAccounts] = useState<any[]>([]);
    const [selectedAccountId, setSelectedAccountId] = useState<number | null>(null);
    const [subAffiliates, setSubsAffiliates] = useState<any[]>([]);
    const [registrationsReport, setRegistrationsReport] = useState<any[]>([]);
    const [paymentsRegister, setPaymentsRegister] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isScrapping, setIsScrapping] = useState(false);
    const [scraperError, setScraperError] = useState<string | null>(null);
    const [selectedSubId, setSelectedSubId] = useState<string | null>(null);
    const [defaultRegistrations, setDefaultRegistrations] = useState([]);
    const [customRegistrations, setCustomRegistrations] = useState([]);

  
    const loadAccounts = async () => {
      try {
        const accRes = await http.get("accounts/user");
        const accData = accRes.data.data || [];
        setAccounts(accData);
        if (accData.length > 0) setSelectedAccountId(accData[0].id);
        setLoading(false);
      } catch (e) {
        console.error("Failed to load accounts:", e);
        setLoading(false);
      }
    };
    
    useEffect(() => {
      // let isMounted = true;
      loadAccounts();
      return () => {
        // isMounted = false;
      };
    }, []);
  
useEffect(() => {
  const fetchData = async () => {
    if (!selectedAccountId) return;
    setLoading(true);
    try {
      const subRes = await http.get(`subaffiliate/admin/${selectedAccountId}`);
      setSubsAffiliates(subRes.data.data || []);

      const regRes = await http.get(`users/registrationsReports?account_id=${selectedAccountId}`);
      const payRes = await http.post("payments/getPaymentHistoryForAffilliate", {
        account_id: selectedAccountId,
      });

      const registrations = regRes.data.data || [];

      // ✅ Filtrar registros por tracking_code
      const defaultRegistrations = registrations.filter((r) => r.tracking_code.toLowerCase() === "default");
      const customRegistrations = registrations.filter((r) => r.tracking_code.toLowerCase() !== "default");

      // ✅ Contadores
      const totalDefault = defaultRegistrations.length;
      const totalCustom = customRegistrations.length;

      console.log("Registrations with 'Default':", totalDefault);
      console.log("Registrations with custom tracking:", totalCustom);

      // ✅ Guardarlos si los vas a usar en componentes
      setRegistrationsReport(registrations);
      setPaymentsRegister(payRes.data.data || []);
      setDefaultRegistrations(defaultRegistrations);       // <- si quieres renderizar
      setCustomRegistrations(customRegistrations);         // <- si quieres renderizar
      setLoading(false);
    } catch (err) {
      console.error("Error loading affiliate data:", err);
      setLoading(false);
    }
  };

  fetchData();
}, [selectedAccountId]);

  
    async function runScraper() {
      setScraperError(null);
      if (!selectedAccountId) return;
      setIsScrapping(true);
      try {
        const res = await fetch(`${BACKEND_URL}scraper`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: selectedAccountId }),
        });
        if (!res.ok) {
          const errMsg = await res.text();
          throw new Error(`Server error: ${res.status} - ${errMsg}`);
        }
    
        const { data } = await res.json();
        if (data?.registrations) {
          setRegistrationsReport(data.registrations);
        } else {
          setScraperError("Scraper returned no registrations");
        }
        window.location.reload()
        setIsScrapping(false);
      } catch (err:any) {
        console.error("❌ Scraper error:", err);
        setScraperError("Not able to sync right now, please try again later");
      } finally {
        setIsScrapping(false);
      }
    }
  
    // useEffect(() => {
    //   runScraper();
    //   const iv = setInterval(runScraper, 15 * 60 * 1000);
    //   return () => clearInterval(iv);
    // }, [selectedAccountId]);
  
  
    
    return {
        runScraper,
        isScrapping,
        scraperError,
        subAffiliates,
        accounts,
        selectedAccountId,
        setSelectedAccountId,
        registrationsReport,
        paymentsRegister,
        loading,
        loadAccounts,
        open,
        setOpen,
        modal,
        setModal,
        selectedSubId,
        setSelectedSubId,
        defaultRegistrations,
        customRegistrations
    }
}
