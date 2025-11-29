/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo, useState } from "react";
import { http } from "@/core/utils/http_request";
import useAuth from "./useAuth";

export function usePayouts(registrationsReport: any[]) {
  const { getUser } = useAuth();
  const [payments, setPayments] = useState<any[]>([]);
  const [filter, setFilter] = useState<"all" | "paid" | "unpaid">("all");

  const enrichedRegistrations = useMemo(() => {
    const merged = registrationsReport.map((reg) => {
      const payment = payments.find((p) => p.ce_user_id === reg.ce_user_id);
      return {
        ...reg,
        paid: !!payment,
        paymentDetails: payment || null,
      };
    });

    return merged.sort((a, b) =>
      new Date(b.registration_date).getTime() - new Date(a.registration_date).getTime()
    );
  }, [registrationsReport, payments]);

  const filteredData = useMemo(() => {
    if (filter === "paid") return enrichedRegistrations.filter((r) => r.paid);
    if (filter === "unpaid") return enrichedRegistrations.filter((r) => !r.paid);
    return enrichedRegistrations;
  }, [filter, enrichedRegistrations]);

  useEffect(() => {

    if (getUser().rol == 3) {
      (async () => {
        try {

          // const res = await http.get("subaffiliate/byUser/" + getUser().id);
          const res = await http.post("payments/getPaymentHistoryForUser",
            {
              slug: getUser().slug,
            });
          setPayments(res.data.data || []);
        } catch (err: any) {
          console.error("Payment fetch error:", err);
        }
      })();
    }
    else {
      (async () => {
        try {
          const res = await http.post("payments/getPaymentHistoryForUser", {
            slug: getUser().slug,
          });
          setPayments(res.data.data || []);
        } catch (err: any) {
          console.error("Payment fetch error:", err);
        }
      })();
    }


  }, []);

  return {
    filteredData,
    filter,
    setFilter,
    payments,
  };
}
