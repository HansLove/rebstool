/* eslint-disable @typescript-eslint/no-explicit-any */
import { FaCirclePlus } from "react-icons/fa6";
import { Link } from "react-router-dom";
import t4Logo from "/assets/images/logos/t4.png";
import PuPrimeLogo from "/assets/images/logos/pu-prime.png";
import FxGiantLogo from "/assets/images/logos/fxgiants.webp";

interface AccountSelectorProps {
  accounts: any[];
  selectedAccountId: number | null;
  setSelectedAccountId: (id: number) => void;
}

export default function AccountSelector({
  accounts,
  selectedAccountId,
  setSelectedAccountId,
}: AccountSelectorProps) {
  const getLogo = (url: string) => {
    const lower = url.toLowerCase();
    if (lower.includes("puprime")) return PuPrimeLogo;
    if (lower.includes("t4trade")) return t4Logo;
    if (lower.includes("fxgiants")) return FxGiantLogo;
    return null;
  };

  const current = accounts.find((a) => a.id === selectedAccountId);
  const logo = current ? getLogo(current.url_base) : null;

  return (
    <div className="px-6 pt-6">
      <div className="flex items-center justify-between mb-2">
        <label className="text-sm font-medium text-gray-800 dark:text-white">
          Active Account
        </label>
        <Link
          to="syncYourAccount"
          className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1"
        >
          <FaCirclePlus className="h-4 w-4" />
        </Link>
      </div>

      {current && (
        <div className="flex items-center gap-3 mb-3 p-3 rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          {logo && (
            <img
              src={logo}
              alt="Broker Logo"
              className="h-10 w-10 rounded-md object-contain"
            />
          )}
          <div className="flex flex-col text-sm">
           
          <span className="text-gray-600 dark:text-gray-400 text-xs  max-w-[20px] block">
            {/* {current.url_base} */}
            {current.login_ce}
            </span>

          </div>
        </div>
      )}

      <select
        className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md px-4 py-3 text-sm text-gray-900 dark:text-white shadow-sm focus:ring-2 focus:ring-blue-500"
        value={selectedAccountId ?? undefined}
        onChange={(e) => setSelectedAccountId(parseInt(e.target.value))}
      >
        <option value="" disabled>
          — Select an account —
        </option>
        {accounts.map((acc) => (
          <option key={acc.id} value={acc.id}>
            {acc.login_ce} — {acc.url_base}
          </option>
        ))}
      </select>
    </div>
  );
}
