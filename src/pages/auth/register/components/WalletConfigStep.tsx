import { useForm } from 'react-hook-form';
import { FaWallet, FaArrowLeft } from 'react-icons/fa6';
import { IRegisterForm } from '@/pages/auth/register/types/type';
import { useAccount, useDisconnect } from 'wagmi';

import Loading from '@/components/loaders/loading1/Loading';
import CustomConnectButton from './CustomConnectButton';
import { WalletService } from '@/services/walletService';
import { generateTemporaryPassword } from '@/services/cryptoService';

import '@/pages/auth/register/animations.css';

interface IWalletConfigStepProps {
  onPrevious: () => void;
  onSubmit: (
    data: Pick<IRegisterForm, 'useOwnWallet' | 'walletType' | 'publicKey'> & {
      encryptedPrivateKey?: string;
      temporaryPassword?: string;
      mnemonic?: string;
    }
  ) => void;
  initialData?: Partial<IRegisterForm>;
  isSubmitting?: boolean;
  errorMessage?: string;
}

function WalletConfigStep({ onPrevious, onSubmit, initialData, isSubmitting, errorMessage }: IWalletConfigStepProps) {
  const { handleSubmit, watch, setValue } = useForm<Pick<IRegisterForm, 'useOwnWallet' | 'publicKey'>>({
    defaultValues: {
      useOwnWallet: initialData?.useOwnWallet ?? false,
      publicKey: initialData?.publicKey || '',
    },
  });

  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();

  const watchUseOwnWallet = watch('useOwnWallet');

  const handleWalletOptionChange = (useOwnWallet: boolean) => {
    setValue('useOwnWallet', useOwnWallet);
    if (useOwnWallet && isConnected && address) {
      setValue('publicKey', address);
    } else if (!useOwnWallet && isConnected) {
      // Desconectar wallet cuando el usuario elige que Affill la maneje
      disconnect();
      setValue('publicKey', '');
    }
  };

  const onValid = (data: Pick<IRegisterForm, 'useOwnWallet' | 'publicKey'>) => {
    const finalData = { ...data } as Pick<IRegisterForm, 'useOwnWallet' | 'walletType' | 'publicKey'> & {
      encryptedPrivateKey?: string;
      temporaryPassword?: string;
      mnemonic?: string;
      generatedPublicKey?: string;
    };

    // Si el usuario eligió usar su propia wallet y está conectado, usar la dirección conectada
    if (data.useOwnWallet && isConnected && address) {
      finalData.walletType = 'self_managed';
      finalData.publicKey = address;
      // Para wallets propias, ir al paso de firma primero
      onSubmit(finalData);
    }
    // Si el usuario eligió flujo custodio, generar wallet
    else if (!data.useOwnWallet) {
      const tempPassword = generateTemporaryPassword();
      const custodialWallet = WalletService.generateCustodialWallet(tempPassword);

      finalData.walletType = 'custodial';
      finalData.publicKey = ''; // Dejar vacío para custodial - backend detectará por walletType
      finalData.encryptedPrivateKey = custodialWallet.encryptedPrivateKey;
      finalData.temporaryPassword = tempPassword;
      finalData.mnemonic = custodialWallet.mnemonic;

      // Guardar la dirección generada para mostrar al usuario
      finalData.generatedPublicKey = custodialWallet.publicKey;

      // Para wallets custodiales, ir directo al registro sin firma
      onSubmit(finalData);
    }
  };

  return (
    <div className="space-y-5">
      {/* Step Indicator */}
      <div className="mb-6 flex justify-center">
        <div className="flex items-center">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-600 text-sm font-bold text-white">
            ✓
          </div>
          <div className="mx-2 h-1 w-16 bg-green-600"></div>
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
            2
          </div>
          <div className="mx-2 h-1 w-16 bg-gray-300 dark:bg-gray-600"></div>
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-300 dark:bg-gray-600 text-sm font-bold text-gray-500 dark:text-gray-400">
            3
          </div>
        </div>
      </div>

      {/* Title */}
      <div className="mb-6 text-center">
        <h3 className="mb-2 text-2xl font-bold text-gray-800 dark:text-gray-100">Wallet Configuration</h3>
        <p className="text-sm text-gray-600 dark:text-gray-300">Set up how you want to receive your affiliate earnings</p>
      </div>

      <form onSubmit={handleSubmit(onValid)} className="space-y-5">
        {/* Error Message */}
        {errorMessage && (
          <div className="rounded-md bg-red-100 dark:bg-red-900/30 px-4 py-2 text-center text-sm font-semibold text-red-700 dark:text-red-400">
            {errorMessage}
          </div>
        )}

        {/* Wallet Option Selection */}
        <div className="space-y-4">
          {/* Let Affill manage your wallet */}
          <div
            className={`cursor-pointer rounded-lg border p-4 transition-all duration-200 ${
              !watchUseOwnWallet ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 dark:border-blue-400' : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
            }`}
            onClick={() => handleWalletOptionChange(false)}
          >
            <label className="flex cursor-pointer items-start space-x-3">
              <input
                type="checkbox"
                checked={!watchUseOwnWallet}
                onChange={() => handleWalletOptionChange(false)}
                className="mt-1 h-4 w-4 rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500"
              />
              <div className="flex-1">
                <div className="flex items-center">
                  <FaWallet className="mr-2 text-gray-600 dark:text-gray-400" />
                  <span className="font-medium text-gray-800 dark:text-gray-200">Let Affill manage it</span>
                </div>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                  We'll create and manage a wallet for you. You can withdraw anytime.
                </p>
              </div>
            </label>
          </div>

          {/* Use own wallet */}
          <div
            className={`cursor-pointer rounded-lg border p-4 transition-all duration-200 ${
              watchUseOwnWallet ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 dark:border-blue-400' : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
            }`}
            onClick={() => handleWalletOptionChange(true)}
          >
            <label className="flex cursor-pointer items-start space-x-3">
              <input
                type="checkbox"
                checked={watchUseOwnWallet}
                onChange={() => handleWalletOptionChange(true)}
                className="mt-1 h-4 w-4 rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500"
              />
              <div className="flex-1">
                <div className="flex items-center">
                  <FaWallet className="mr-2 text-blue-600 dark:text-blue-400" />
                  <span className="font-medium text-gray-800 dark:text-gray-200">Use my own wallet</span>
                </div>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                  Provide your own public key to receive payments directly to your wallet
                </p>
              </div>
            </label>
          </div>
        </div>

        {/* Public Key Input with CSS Animation */}
        <div className={`wallet-input-container ${watchUseOwnWallet ? 'wallet-input-visible' : 'wallet-input-hidden'}`}>
          <CustomConnectButton />
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3 pt-4">
          <button
            type="button"
            onClick={onPrevious}
            className="flex items-center justify-center rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-2 text-gray-700 dark:text-gray-200 transition-all duration-200 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            <FaArrowLeft className="mr-2" />
            Back
          </button>
          <button
            type="submit"
            disabled={isSubmitting || (watchUseOwnWallet && !isConnected)}
            className="flex-1 rounded-lg bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 py-2 font-semibold text-white transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting && <Loading />}
            {!isSubmitting && watchUseOwnWallet && !isConnected && 'Connect Wallet First'}
            {!isSubmitting && watchUseOwnWallet && isConnected && 'Create Account'}
            {!isSubmitting && !watchUseOwnWallet && 'Generate Wallet'}
          </button>{' '}
        </div>
      </form>
    </div>
  );
}

export default WalletConfigStep;
