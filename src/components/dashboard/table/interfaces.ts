export interface UserData {
  id: number;
  ce_user_id: string;
  account_id: number;
  registration_date: string;
  tracking_code: string;
  customer_name: string;
  net_deposits: number;
  volume: number;
  commission: number;
  withdrawals: number;
  status: string;
  qualification_date: string | null;
}

export interface SubAffiliate {
  id: number;
  name: string;
  email: string;
  createdAt: string;
  data: UserData[];
}

export interface SubAffiliatesProps {
  affiliates: SubAffiliate[];
}