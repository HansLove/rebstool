import { useState } from 'react';
import { FaCopy, FaEye, FaEyeSlash } from 'react-icons/fa6';
import toast from 'react-hot-toast';

interface Props {
  publicKey: string;
  temporaryPassword: string;
  mnemonic?: string;
}

export function CustodialWalletInfo({ publicKey, temporaryPassword, mnemonic }: Props) {
  const [showPassword, setShowPassword] = useState(false);
  const [showMnemonic, setShowMnemonic] = useState(false);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast.success(`${label} copied to clipboard!`);
    }).catch(() => {
      toast.error('Failed to copy to clipboard');
    });
  };

  return (
    <div className="space-y-3 rounded-lg bg-blue-50 dark:bg-blue-900/30 p-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Public Address:</label>
        <div className="flex items-center space-x-2">
          <code className="flex-1 rounded bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 p-2 text-xs break-all">{publicKey}</code>
          <button 
            onClick={() => copyToClipboard(publicKey, 'Public address')}
            className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
          >
            <FaCopy />
          </button>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Temporary Password:</label>
        <div className="flex items-center space-x-2">
          <code className="flex-1 rounded bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 p-2 text-xs break-all">
            {showPassword ? temporaryPassword : '••••••••••••'}
          </code>
          <button 
            onClick={() => setShowPassword(!showPassword)}
            className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
          <button 
            onClick={() => copyToClipboard(temporaryPassword, 'Temporary password')}
            className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
          >
            <FaCopy />
          </button>
        </div>
      </div>

      {mnemonic && (
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Recovery Phrase:</label>
          <div className="flex items-center space-x-2">
            <code className="flex-1 rounded bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 p-2 text-xs">
              {showMnemonic ? mnemonic : '••• ••• ••• •••••••••••••'}
            </code>
            <button 
              onClick={() => setShowMnemonic(!showMnemonic)}
              className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
            >
              {showMnemonic ? <FaEyeSlash /> : <FaEye />}
            </button>
            <button 
              onClick={() => copyToClipboard(mnemonic, 'Recovery phrase')}
              className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
            >
              <FaCopy />
            </button>
          </div>
        </div>
      )}

      <div className="rounded bg-yellow-100 dark:bg-yellow-900/30 p-2 text-sm text-yellow-800 dark:text-yellow-200">
        <strong>⚠️ Important:</strong> Save this information securely. You'll need the temporary password to access your private key later.
      </div>
    </div>
  );
}