import { FaArrowRight } from 'react-icons/fa6';
import { CustodialWalletInfo } from '@/components/CustodialWalletInfo';

interface WalletInfoStepProps {
  walletInfo: {
    publicKey: string;
    temporaryPassword: string;
    mnemonic?: string;
  };
  onContinue: () => void;
  isSubmitting?: boolean;
  errorMessage?: string;
}

function WalletInfoStep({ walletInfo, onContinue, isSubmitting, errorMessage }: WalletInfoStepProps) {
  return (
    <div className="space-y-4">
      {/* Step Indicator */}
      <div className="mb-4 flex justify-center">
        <div className="flex items-center">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-600 text-sm font-bold text-white">
            ✓
          </div>
          <div className="mx-2 h-1 w-16 bg-green-600"></div>
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-600 text-sm font-bold text-white">
            ✓
          </div>
          <div className="mx-2 h-1 w-16 bg-blue-600"></div>
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
            3
          </div>
        </div>
      </div>

      {/* Title */}
      <div className="mb-4 text-center">
        <h3 className="mb-2 text-xl font-bold text-gray-800 dark:text-gray-100">Wallet Created Successfully!</h3>
        <p className="text-sm text-gray-600 dark:text-gray-300">Save this information securely before continuing.</p>
      </div>

      {/* Error Message */}
      {errorMessage && (
        <div className="rounded-md bg-red-100 dark:bg-red-900/30 px-4 py-2 text-center text-sm font-semibold text-red-700 dark:text-red-400">
          {errorMessage}
        </div>
      )}

      {/* Wallet Information */}
      <CustodialWalletInfo {...walletInfo} />

      {/* Continue Button */}
      <button
        onClick={onContinue}
        disabled={isSubmitting}
        className="flex w-full items-center justify-center rounded-lg bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600 py-3 font-semibold text-white transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <span>Complete Registration</span>
        <FaArrowRight className="ml-2" />
      </button>
    </div>
  );
}

export default WalletInfoStep;
