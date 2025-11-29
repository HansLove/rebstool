import { AffiliateNodeType } from "@/modules/subAffiliates/types";

export function calculateAffiliateMetrics(node: AffiliateNodeType) {
    const registrations = node.userData || [];
    const totalRegistrations = registrations.length;
    const activeUsers = registrations.filter(r => (r.first_deposit > 0 || r.volume > 0) && r.commission > 0).length;
    const grossProfit = registrations.reduce((sum, r) => sum + (r.commission || 0), 0);
    const netProfit = grossProfit; // Adjust if there are costs
    const investment = node.subAffiliate.amount || 0;
    const roi = investment > 0 ? ((netProfit / investment) * 100).toFixed(1) : "0";
    
    return { 
      totalRegistrations, 
      activeUsers, 
      grossProfit, 
      netProfit, 
      roi,
      conversionRate: totalRegistrations > 0 ? ((activeUsers / totalRegistrations) * 100).toFixed(1) : "0"
    };
  }