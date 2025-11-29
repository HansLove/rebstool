/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { IRegisterForm } from '@/pages/auth/register/types/type';
import { http } from '@/core/utils/http_request';
import useAuth from '@/core/hooks/useAuth';
import BasicInformationStep from '@/pages/auth/register/components/BasicInformatonStep';
import WalletConfigStep from '@/pages/auth/register/components/WalletConfigStep';
import WalletInfoStep from '@/pages/auth/register/components/WalletInfoStep';
import SignatureStep from '@/pages/auth/register/components/SignatureStep';

type RegisterPhase = 'step1' | 'step2' | 'wallet_info' | 'signature' | 'submitting' | 'email_sent';

interface MasterAffiliateRegisterProps {
  onPhaseChange?: (phase: RegisterPhase) => void;
}

function MasterAffiliateRegister({ onPhaseChange }: MasterAffiliateRegisterProps) {
  const { setToken } = useAuth();
  const [activeStep, setActiveStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [registerPhase, setRegisterPhase] = useState<RegisterPhase>('step1');
  const [countdown, setCountdown] = useState<number>(60);
  const [emailSentTo, setEmailSentTo] = useState<string | null>(null);
  const resendTimerRef = useRef<number | null>(null);
  const countdownIntervalRef = useRef<number | null>(null);

  

  // Store form data across steps
  const [formData, setFormData] = useState<Partial<IRegisterForm>>({});
  const [custodialWalletInfo, setCustodialWalletInfo] = useState<{
    publicKey: string;
    temporaryPassword: string;
    mnemonic?: string;
  } | null>(null);

  const handleStep1Next = (data: Omit<IRegisterForm, 'useOwnWallet' | 'publicKey'>) => {
    setFormData(prev => ({ ...prev, ...data }));
    setActiveStep(2);
    setRegisterPhase('step2');
    onPhaseChange?.('step2');
  };

  const handleStep2Previous = () => {
    setActiveStep(1);
    setRegisterPhase('step1');
    onPhaseChange?.('step1');
  };

  const handleStep2Submit = (
    data: Pick<IRegisterForm, 'useOwnWallet' | 'walletType' | 'publicKey'> & {
      encryptedPrivateKey?: string;
      temporaryPassword?: string;
      mnemonic?: string;
      generatedPublicKey?: string;
    }
  ) => {
    const finalData = { ...formData, ...data } as IRegisterForm;
    setFormData(finalData);

    // Si es flujo custodio y se generó wallet, ir al paso 3 (info de wallet)
    if (finalData.walletType === 'custodial' && finalData.encryptedPrivateKey) {
      setCustodialWalletInfo({
        publicKey: (data as any).generatedPublicKey, // Usar la dirección generada para mostrar
        temporaryPassword: finalData.temporaryPassword!,
        mnemonic: finalData.mnemonic,
      });
      setActiveStep(3);
      setRegisterPhase('wallet_info');
      onPhaseChange?.('wallet_info');
    }
    // Si es wallet propia, ir al paso 3 (firma)
    else if (finalData.walletType === 'self_managed') {
      setActiveStep(3);
      setRegisterPhase('signature');
      onPhaseChange?.('signature');
    }
  };

  const handleStep3Previous = () => {
    setActiveStep(2);
    setRegisterPhase('step2');
    onPhaseChange?.('step2');
  };

  const handleStep3Continue = () => {
    handleFinalSubmit(formData as IRegisterForm);
  };

  const handleSignatureComplete = (signature: string, message: string) => {
    const updatedData = {
      ...formData,
      signature,
      signedMessage: message,
    } as IRegisterForm;
    setFormData(updatedData);
    handleFinalSubmit(updatedData);
  };

  const handleFinalSubmit = async (finalData: IRegisterForm) => {
    setIsSubmitting(true);
    setErrorMessage('');
    setRegisterPhase('submitting');
    onPhaseChange?.('submitting');

    try {
      const payload: any = {
        name: finalData.name,
        email: finalData.email,
        password: finalData.password,
        rol: 1, // Master Affiliate
        walletType: finalData.walletType, // Bandera explícita para el backend
        publicKey: finalData.publicKey || '', // Vacío para custodial, con dirección para self_managed
        // vaultAddress: vaultAddress || '', // Include vault address if created

        // AGREGAR campos custodiales cuando aplique:
        ...(finalData.encryptedPrivateKey && {
          encryptedPrivateKey: finalData.encryptedPrivateKey,
          temporaryPassword: finalData.temporaryPassword,
          mnemonic: finalData.mnemonic,
        }),

        // AGREGAR campos de firma para wallets propias:
        ...(finalData.signature && {
          signature: finalData.signature,
          signedMessage: finalData.signedMessage,
        }),
      };

      console.log('🔨 Register payload:', payload);

      const response = await http.post('auth/register', payload);

      console.log('✅ Register response:', response.data);
      if (response.status !== 201) throw new Error('Registration failed');
      // Si el backend retorna token/usuario, lo guardamos; si no, continuamos sin bloquear el flujo
      const maybeToken = (response as any)?.data?.data?.token;
      const maybeUser = (response as any)?.data?.data?.user;
      if (maybeToken && maybeUser) {
        setToken(maybeUser, maybeToken);
      }

      // Mostrar estado de correo enviado y preparar reenvío automático a los 60s
      setEmailSentTo(finalData.email);
      setRegisterPhase('email_sent');
      onPhaseChange?.('email_sent');
      setCountdown(60);

      if (countdownIntervalRef.current) window.clearInterval(countdownIntervalRef.current);
      countdownIntervalRef.current = window.setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            if (countdownIntervalRef.current) window.clearInterval(countdownIntervalRef.current);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      if (resendTimerRef.current) window.clearTimeout(resendTimerRef.current);
      resendTimerRef.current = window.setTimeout(async () => {
        try {
          if (finalData.email) {
            await http.post('resend-verification', { email: finalData.email });
          }
        } catch {
          // silencioso; el usuario aún puede reintentar manualmente
        }
      }, 60_000);
    } catch (error: any) {
      const msg = error?.response?.data?.message || error?.message || 'Registration failed';
      console.error('❌ Register error:', msg);
      setErrorMessage(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleManualResend = async () => {
    if (!emailSentTo) return;
    try {
      await http.post('resend-verification', { email: emailSentTo });
      setCountdown(60);
      if (countdownIntervalRef.current) window.clearInterval(countdownIntervalRef.current);
      countdownIntervalRef.current = window.setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            if (countdownIntervalRef.current) window.clearInterval(countdownIntervalRef.current);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch {
      // opcional: mostrar mensaje de error
    }
  };

  useEffect(() => {
    return () => {
      if (resendTimerRef.current) window.clearTimeout(resendTimerRef.current);
      if (countdownIntervalRef.current) window.clearInterval(countdownIntervalRef.current);
    };
  }, []);

  const stepTitle = useMemo(() => {
    if (activeStep === 1) return 'Master Affiliate Onboarding';
    if (activeStep === 2) return 'Wallet Setup';
    if (activeStep === 3 && formData.walletType === 'custodial') return 'Wallet Information';
    if (activeStep === 3 && formData.walletType === 'self_managed') return 'Verify Ownership';
    return 'Master Affiliate Onboarding';
  }, [activeStep, formData.walletType]);

  const progressPercent = useMemo(() => {
    if (activeStep === 1) return 33;
    if (activeStep === 2) return 66;
    return 100;
  }, [activeStep]);



  return (
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-full max-w-md overflow-hidden rounded-2xl border border-white/10 dark:border-gray-700 bg-white/90 dark:bg-gray-900/95 p-6 shadow-2xl backdrop-blur md:p-8"
      >
        <div className="mb-6">
          <h2 className="text-center text-3xl font-bold text-gray-900 dark:text-white">{stepTitle}</h2>
          <p className="mt-1 text-center text-sm text-gray-600 dark:text-gray-300">Lead your network as a Master Affiliate. Smooth, secure onboarding.</p>
          {registerPhase !== 'email_sent' && (
            <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-gray-200/60 dark:bg-gray-700/60">
              <motion.div
                key={progressPercent}
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="h-full rounded-full bg-violet-600 dark:bg-blue-500 shadow-[0_0_12px_rgba(124,58,237,0.6)] dark:shadow-[0_0_12px_rgba(59,130,246,0.6)]"
              />
            </div>
          )}
          {errorMessage && (
            <div className="mt-3 rounded-lg bg-red-50 dark:bg-red-900/30 px-3 py-2 text-sm text-red-700 dark:text-red-400">{errorMessage}</div>
          )}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeStep + String(formData.walletType)}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
          >
            {registerPhase === 'email_sent' && (
                            <div className="text-center">
                <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-emerald-500/15 dark:bg-emerald-500/20 ring-1 ring-emerald-500/40 dark:ring-emerald-400/50 flex items-center justify-center">
                  <span className="text-emerald-500 dark:text-emerald-400 text-xl">✉️</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Verification email sent</h3>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                  {emailSentTo ? `We sent a verification link to ${emailSentTo}.` : 'We sent a verification link to your email.'}
                  <br />
                  Please check your inbox and spam folder.
                </p>
                <div className="mt-5">
                  <button
                    type="button"
                    onClick={handleManualResend}
                    disabled={countdown > 0}
                    className="inline-flex items-center justify-center rounded-full bg-violet-600 hover:bg-violet-700 dark:bg-blue-600 dark:hover:bg-blue-700 px-5 py-2 text-sm font-semibold text-white disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {countdown > 0 ? `Resend in ${countdown}s` : 'Resend email'}
                  </button>
                </div>
                <div className="mt-4 text-xs text-gray-500 dark:text-gray-400">
                  This helps us verify it's really you. Your dashboard unlocks after confirmation.
                </div>
              </div>
            )}

            {registerPhase !== 'email_sent' && activeStep === 1 && (
              <BasicInformationStep onNext={handleStep1Next} initialData={formData} />
            )}

            {registerPhase !== 'email_sent' && activeStep === 2 && (
              <WalletConfigStep
                onPrevious={handleStep2Previous}
                onSubmit={handleStep2Submit}
                initialData={formData}
                isSubmitting={false}
                errorMessage=""
              />
            )}

            {registerPhase !== 'email_sent' && activeStep === 3 && formData.walletType === 'custodial' && custodialWalletInfo && (
              <WalletInfoStep
                walletInfo={custodialWalletInfo}
                onContinue={handleStep3Continue}
                isSubmitting={isSubmitting}
                errorMessage={errorMessage}
              />
            )}

            {registerPhase !== 'email_sent' && activeStep === 3 && formData.walletType === 'self_managed' && (
              <SignatureStep
                onPrevious={handleStep3Previous}
                onSignatureComplete={handleSignatureComplete}
                isSubmitting={isSubmitting}
                errorMessage={errorMessage}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </motion.div>
   
  );
}

export default MasterAffiliateRegister;