type Registration = {
    customer_name: string;
    country: string;
    first_deposit: number;
    volume: number;
    commission: number;
  };
  
  export type AffiliateNodeType = {
    subAffiliate: {
      id: number;
      amount: number;
      subAffiliateUser: { name: string };
    };
    userData: Registration[];
    children: AffiliateNodeType[];
  };