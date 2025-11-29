import { useState, useRef } from 'react';
import { FaSignature, FaArrowLeft, FaCheck } from 'react-icons/fa6';
import { useSignMessage, useAccount } from 'wagmi';
import Loading from '@/components/loaders/loading1/Loading';

interface ISignatureStepProps {
  onPrevious: () => void;
  onSignatureComplete: (signature: string, message: string) => void;
  isSubmitting?: boolean;
  errorMessage?: string;
}

function SignatureStep({ onPrevious, onSignatureComplete, isSubmitting, errorMessage }: ISignatureStepProps) {
  const { address } = useAccount();
  const [localError, setLocalError] = useState('');
  const [isSigningComplete, setIsSigningComplete] = useState(false);
  const messageRef = useRef<string>('');
  const signatureRef = useRef<string>('');

  // Generar mensaje con timestamp
  const generateMessage = () => {
    const timestamp = Date.now();
    return `Please sign this message to verify address ownership.\n\nTimestamp: ${timestamp}`;
  };

  const { signMessage, isPending } = useSignMessage({
    mutation: {
      onSuccess: signature => {
        signatureRef.current = signature;
        setIsSigningComplete(true);
      },
      onError: error => {
        console.error('❌ Signature failed:', error);
        setLocalError(error.message || 'Failed to sign message');
      },
    },
  });

  const handleSignMessage = () => {
    setLocalError('');
    const message = generateMessage();
    messageRef.current = message;
    console.log('📝 Generated message for signing:', message);
    signMessage({ message, connector: undefined });
  };

  const displayError = errorMessage || localError;

  return (
    <div className="space-y-5">
      {/* Step Indicator */}
      <div className="mb-6 flex justify-center">
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
      <div className="mb-6 text-center">
        <h3 className="mb-2 text-2xl font-bold text-gray-800 dark:text-gray-100">Verify Wallet Ownership</h3>
        <p className="text-sm text-gray-600 dark:text-gray-300">Sign a message to prove you own this wallet address</p>
      </div>

      {/* Error Message */}
      {displayError && (
        <div className="rounded-md bg-red-100 dark:bg-red-900/30 px-4 py-2 text-center text-sm font-semibold text-red-700 dark:text-red-400">
          {displayError}
        </div>
      )}

      {/* Wallet Info */}
      <div className="rounded-lg bg-gray-50 dark:bg-gray-800 p-4">
        <h4 className="mb-2 font-semibold text-gray-800 dark:text-gray-200">Connected Wallet:</h4>
        <p className="font-mono text-sm break-all text-gray-600 dark:text-gray-300">{address}</p>
      </div>

      {/* Signature Status */}
      {isSigningComplete && (
        <div className="rounded-lg border border-green-200 dark:border-green-700 bg-green-50 dark:bg-green-900/30 p-4 text-center">
          <FaCheck className="mx-auto mb-2 text-2xl text-green-600 dark:text-green-400" />
          <p className="font-semibold text-green-800 dark:text-green-300">Signature verified successfully!</p>
          <p className="mt-1 text-sm text-green-600 dark:text-green-400">Ready to finish account creation.</p>

          {/* Botón Finish: solo presionable si isSigningComplete === true */}
          <div className="mt-4">
            <button
              type="button"
              onClick={() => onSignatureComplete(signatureRef.current, messageRef.current)}
              disabled={!isSigningComplete}
              className="mx-auto inline-flex items-center justify-center rounded-lg bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 px-4 py-2 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              Continue
            </button>
          </div>
        </div>
      )}

      {/* Sign Message Section */}
      {!isSigningComplete && (
        <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
          <div className="mb-3 flex items-center">
            <FaSignature className="mr-2 text-blue-600 dark:text-blue-400" />
            <span className="font-semibold text-gray-800 dark:text-gray-200">Digital Signature Required</span>
          </div>
          <p className="mb-4 text-sm text-gray-600 dark:text-gray-300">
            To ensure the security of your account and verify wallet ownership, please sign a message. This is free and
            doesn't require any gas fees.
          </p>

          <button
            onClick={handleSignMessage}
            disabled={isPending || isSubmitting}
            className="w-full rounded-lg bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 py-3 font-semibold text-white transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isPending && (
              <div className="flex items-center justify-center">
                <Loading />
                <span className="ml-2">Signing Message...</span>
              </div>
            )}
            {!isPending && !isSubmitting && (
              <div className="flex items-center justify-center">
                <FaSignature className="mr-2" />
                Sign Message
              </div>
            )}
            {isSubmitting && (
              <div className="flex items-center justify-center">
                <Loading />
                <span className="ml-2">Creating Account...</span>
              </div>
            )}
          </button>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex space-x-3 pt-4">
        <button
          type="button"
          onClick={onPrevious}
          disabled={isPending || isSubmitting || isSigningComplete}
          className="flex items-center justify-center rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-2 text-gray-700 dark:text-gray-200 transition-all duration-200 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <FaArrowLeft className="mr-2" />
          Back
        </button>
      </div>
    </div>
  );
}

export default SignatureStep;
