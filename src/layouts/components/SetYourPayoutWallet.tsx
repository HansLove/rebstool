// import React from 'react'
import NeonModal from '@/components/modals/NeonModal';
import { http } from '@/core/utils/http_request';
import { useState } from 'react';

export default function SetYourPayoutWallet({
  setSaving,
  walletModalOpen,
  setWalletModalOpen,
  currentAddress,
  setCurrentAddress,
  getToken,
}: {
  currentAddress: string;
  setSaving: (saving: boolean) => void;
  walletModalOpen: boolean;
  setWalletModalOpen: (isOpen: boolean) => void;
  setCurrentAddress: (address: string) => void;
  getToken: () => string | null;
}) {
  const [newWallet, setNewWallet] = useState('');

  
  const handleWalletSave = async () => {
    setSaving(true);
    try {
      const token = getToken();
      const payload = {
        // address: currentAddress,
        mainAddress: currentAddress,
      };

      await http.put('users/me', payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      //   toast.success("✅ Settings updated successfully");
      setCurrentAddress(newWallet);
    } catch (err) {
      console.error(err);
      //   toast.error("❌ Failed to update settings");
    } finally {
      setSaving(false);
    }
  };


  return (
    <NeonModal
      onClose={() => setWalletModalOpen(false)}
      isActive={walletModalOpen}
      bgColor="bg-slate-950"
      width="w-full max-w-md"
      height="h-auto"
    >
      <div className="space-y-6 p-8 text-center">
        <h2 className="text-2xl font-bold text-white">Set Your Payout Wallet</h2>

        <p className="text-gray-300">Enter the address where you'd like to receive your USDT payments.</p>

        <input
          type="text"
          value={newWallet}
          onChange={e => setNewWallet(e.target.value)}
          placeholder="0x1234...abcd"
          className="w-full rounded-lg border border-slate-600 bg-slate-800 px-4 py-3 text-white placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
        />
        <div className="text-xs text-slate-400">
          Supported Networks: <span className="font-medium text-indigo-400">Ethereum</span>,{' '}
          <span className="font-medium text-yellow-400">BSC</span>,{' '}
          <span className="font-medium text-blue-400">Polygon</span>
        </div>

        <button
          onClick={handleWalletSave}
          className="mt-4 w-full rounded-lg bg-blue-600 py-3 font-semibold text-white transition-all hover:bg-blue-700"
        >
          💾 Save Wallet
        </button>
      </div>
    </NeonModal>
  );
}
