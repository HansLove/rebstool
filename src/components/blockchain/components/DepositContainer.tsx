import { FaDollarSign, FaUnlock, FaCheckCircle, FaRegCopy } from "react-icons/fa";
import useDeposits from "./useDeposits";
import { useBlockchainContext } from "../../../context/BlockchainProvider";
import { splitDecimals } from "../../../core/utils/splitDecimals";
import { useState } from "react";
import QRCode from "react-qr-code";

export default function DepositContainer() {
  const {
    vaultAddress,
    transactionSuccess,
    setTransactionSuccess,
    checkingVault,
    handleCreateVault,
    hasVault,
    vaultUSDTBalance,
  } = useBlockchainContext();

  const {
    sendMoney,
    isSubmitting,
    step,
    handleQuickSelect,
    setDepositAmount,
    depositAmount,
    withdrawMoney,
  } = useDeposits(setTransactionSuccess);

  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(vaultAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (checkingVault) {
    return (
      <div className="text-center text-gray-700 dark:text-white p-6 animate-pulse">
        <p className="text-lg font-medium">🔍 Checking your vault status...</p>
      </div>
    );
  }

  if (!hasVault) {
    return (
      <div className="max-w-md mx-auto bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-xl text-center">
        <h2 className="text-3xl font-extrabold text-gray-800 dark:text-white mb-4">
          🚀 Deploy Your Vault
        </h2>
        <p className="text-gray-500 dark:text-gray-300 mb-6 text-lg">
          To begin managing affiliate funds and earning commissions, deploy your vault contract now.
        </p>
        <button
          onClick={handleCreateVault}
          className="bg-gradient-to-r from-blue-500 to-purple-700 hover:from-blue-600 hover:to-purple-800 text-white font-bold py-4 px-8 rounded-xl w-full text-lg transition duration-200 shadow-lg"
        >
          Activate Vault
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto bg-white dark:bg-gray-900 p-10 rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700">
      <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white text-center">
        💼 Vault Management Panel
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div>
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="font-semibold text-gray-700 dark:text-gray-300">Vault Address</span>
            <button
              onClick={handleCopy}
              className="text-xs text-blue-500 hover:underline flex items-center gap-1"
            >
              <FaRegCopy /> {copied ? "Copied!" : "Copy"}
            </button>
          </div>
          <p className="bg-gray-100 dark:bg-gray-800 font-mono text-xs p-3 rounded-xl break-words text-blue-700 dark:text-blue-300">
            {vaultAddress}
          </p>
        </div>

        <div className="flex flex-col items-center justify-center">
          <QRCode value={vaultAddress} size={100} />
          <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
            Scan to deposit directly
          </p>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex justify-between items-center text-lg">
          <span className="text-gray-700 dark:text-gray-300 font-medium">Vault Balance</span>
          <span className="text-green-500 font-semibold flex items-center gap-1 text-xl">
            <FaDollarSign /> {isNaN(parseInt(vaultUSDTBalance)) ? 0 : splitDecimals(vaultUSDTBalance)} USDT
          </span>
        </div>
      </div>

      <div className="mb-6">
        <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
          Deposit Amount
        </label>
        <input
          type="number"
          step="0.01"
          min="0"
          value={depositAmount}
          onChange={(e) => setDepositAmount(e.target.value)}
          placeholder="e.g. 10 USDT"
          className="w-full px-5 py-3 text-lg rounded-xl border border-gray-300 bg-gray-100 dark:bg-gray-800 dark:border-gray-600 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <div className="grid grid-cols-4 gap-2 mb-6">
        {[25, 50, 75, 100].map((p) => (
          <button
            key={p}
            onClick={() => handleQuickSelect(p)}
            className="py-2 text-sm bg-indigo-100 dark:bg-gray-700 hover:bg-indigo-200 dark:hover:bg-gray-600 rounded-xl font-semibold text-indigo-700 dark:text-white"
          >
            {p}%
          </button>
        ))}
      </div>

      {step === "approving" && (
        <p className="text-blue-500 text-center mb-2 animate-pulse">🔐 Approving USDT for vault...</p>
      )}
      {step === "depositing" && (
        <p className="text-blue-500 text-center mb-2 animate-pulse">💸 Depositing into vault...</p>
      )}
      {step === "withdrawing" && (
        <p className="text-red-500 text-center mb-2 animate-pulse">🔓 Processing withdrawal...</p>
      )}
      {transactionSuccess && (
        <div className="flex items-center justify-center gap-2 text-green-600 bg-green-50 border border-green-200 rounded-lg px-4 py-3 mb-4 text-center">
          <FaCheckCircle className="text-xl" />
          <span className="font-medium">Transaction successful!</span>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={sendMoney}
          disabled={isSubmitting || !depositAmount}
          className={`flex-1 py-4 rounded-xl font-bold text-white text-lg transition duration-200 shadow-lg ${
            isSubmitting || !depositAmount
              ? "bg-slate-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {isSubmitting ? "Processing..." : "💰 Deposit"}
        </button>

        <button
          onClick={withdrawMoney}
          // disabled={isSubmitting}
          className="flex-1 py-4 rounded-xl font-bold text-white bg-red-500 hover:bg-red-600 text-lg shadow-lg"
        >
          <FaUnlock className="inline mr-2" /> Withdraw
        </button>
      </div>
    </div>
  );
}
