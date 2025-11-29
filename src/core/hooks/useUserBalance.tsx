import { useContext } from "react";
import { UserBalanceContext } from "@/context/UserBalanceProvider";

/**
 * Custom hook to access user balance context
 *
 * Must be used within a UserBalanceProvider component.
 * Provides access to total balance, deposits, withdrawals, network breakdown, loading state, and refresh function.
 *
 * @returns User balance context with balance data and methods
 * @throws Error if used outside of UserBalanceProvider
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { totalBalance, totalDeposits, totalWithdrawals, networks, isLoadingBalance, refreshBalance } = useUserBalance();
 *
 *   return (
 *     <div>
 *       <p>Balance: ${totalBalance}</p>
 *       <p>Deposits: ${totalDeposits} | Withdrawals: ${totalWithdrawals}</p>
 *       {Object.entries(networks).map(([network, data]) => (
 *         <div key={network}>
 *           <h3>{network}</h3>
 *           <p>Balance: ${data.balance}</p>
 *         </div>
 *       ))}
 *       {isLoadingBalance && <Loading />}
 *       <button onClick={refreshBalance}>Refresh</button>
 *     </div>
 *   );
 * }
 * ```
 */
export default function useUserBalance() {
  const context = useContext(UserBalanceContext);

  if (!context) {
    throw new Error(
      "useUserBalance must be used within a UserBalanceProvider"
    );
  }

  return context;
}
