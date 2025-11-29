// src/components/PaymentHistoryTable.tsx
import  { FC } from 'react';

export interface User {
  id: number;
  name: string;
  email: string;
  rol: number;
  slug: string;
  status: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Registration {
  id: number;
  ce_user_id: string;
  account_id: number;
  registration_date: string;
  brand: string;
  tracking_code: string;
  afp: string;
  language: string;
  type: string;
  size: string;
  name: string;
  nci: number;
  status: string;
  qualification_date: string;
  country: string;
  volume: number;
  first_deposit: number;
  first_deposit_date: string;
  withdrawals: number;
  net_deposits: number;
  generic1: string;
  customer_name: string;
  commission: number;
  createdAt: string;
  updatedAt: string;
  user: User;
}

export interface PaymentHistory {
  id: number;
  amount: number;
  mainAddress: string;
  ce_user_id: string;
  hash: string;
  createdAt: string;
  updatedAt: string;
  registration: Registration;
}

interface Props {
  data: PaymentHistory[];
}

const PaymentHistoryTable: FC<Props> = ({ data }) => {
 return( <div className="overflow-x-auto">
    <table className="min-w-full bg-white dark:bg-slate-800">
      <thead className="bg-slate-50 dark:bg-slate-700">
        <tr>
          <th className="px-4 py-3 text-left text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 uppercase tracking-wider">#</th>
          <th className="px-4 py-3 text-left text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 uppercase tracking-wider">Amount</th>
          <th className="px-4 py-3 text-left text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 uppercase tracking-wider">Address</th>
          <th className="px-4 py-3 text-left text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 uppercase tracking-wider">Hash</th>
          {/* <th className="px-4 py-3 text-left text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 uppercase tracking-wider">Track. Code</th> */}
          <th className="px-4 py-3 text-left text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 uppercase tracking-wider">Customer</th>
          {/* <th className="px-4 py-3 text-left text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 uppercase tracking-wider">User</th>
          <th className="px-4 py-3 text-left text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 uppercase tracking-wider">User Email</th> */}
          <th className="px-4 py-3 text-left text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 uppercase tracking-wider">Date</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
        {data.map((ph) => ph&&(
          <tr key={ph.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
            <td className="px-4 py-3 text-sm text-slate-800 dark:text-slate-200">{ph?.id}</td>
            <td className="px-4 py-3 text-sm font-semibold text-slate-800 dark:text-slate-200">${ph?.amount?.toFixed(2)}</td>
            <td className="px-4 py-3 text-sm text-slate-700 dark:text-slate-300 font-mono truncate max-w-xs">{ph?.mainAddress}</td>
            <td className="px-4 py-3 text-xs text-slate-600 dark:text-slate-400 font-mono truncate max-w-xs">{ph?.hash}</td>
            {/* <td className="px-4 py-3 text-sm text-slate-800 dark:text-slate-200">{ph.registration.tracking_code}</td> */}
            <td className="px-4 py-3 text-sm text-slate-800 dark:text-slate-200">{ph.registration?.customer_name}</td>
            {/* <td className="px-4 py-3 text-sm text-slate-800 dark:text-slate-200">{ph.registration.user.name}</td>
            <td className="px-4 py-3 text-sm text-slate-800 dark:text-slate-200">{ph.registration.user.email}</td> */}
            <td className="px-4 py-3 text-sm text-slate-700 dark:text-slate-300">{new Date(ph?.createdAt).toLocaleString()}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>)
};

export default PaymentHistoryTable;
