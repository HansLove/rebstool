/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { http } from '@/core/utils/http_request';
import useAuth from '@/core/hooks/useAuth';
import { RUTE_USER_LOGIN_2FA } from '@/app/routes/routes';
import { FaKey } from 'react-icons/fa6';
import Loading from '@/components/loaders/loading1/Loading';
import SuccessAnimation from '@/components/animations/success/SuccessAnimation';
import { FiXCircle } from 'react-icons/fi';

interface Props {
  email: string; // email del login previo
}

const TwoFactorAuth = ({ email }: Props) => {
  const [code, setCode] = useState('');
  const [status, setStatus] = useState<'idle' | 'verifying' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();
  const { setToken } = useAuth();

  const handleVerify = async () => {
    if (code.length !== 6) return;
    try {
      setStatus('verifying');
      const response = await http.post(RUTE_USER_LOGIN_2FA, { email, code });

      if (response.status !== 200) throw new Error('Invalid response');

      const user = response?.data?.user;
      const token = response?.data?.token;
      if (user && token) setToken(user, token);

      setStatus('success');
      setTimeout(() => navigate('/dashboard'), 1200);
    } catch (err: unknown) {
      const msg = (err as any)?.response?.data?.message || 'Invalid verification code';
      setErrorMsg(msg);
      setStatus('error');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white relative overflow-hidden px-6">
      <div className="relative z-10 w-full max-w-md p-8 rounded-2xl glass border border-white/10 text-center shadow-elegant">
        <Link
          to="/"
          className="inline-flex items-center justify-center gap-2 textcolor text-2xl font-extrabold tracking-tight mb-6"
        >
          Affill
        </Link>

        {status === 'idle' && (
          <>
            <FaKey className="mx-auto text-teal-400 mb-6" size={36} />
            <h1 className="text-2xl font-semibold">Two-Factor Authentication</h1>
            <p className="mt-2 text-slate-300">
              Enter the 6-digit code we sent to <strong>{email}</strong>
            </p>

            {errorMsg && (
              <div className="bg-red-50/10 border border-red-400/30 text-red-300 px-4 py-2 mt-4 rounded-xl text-sm">
                {errorMsg}
              </div>
            )}

            <div className="mt-6">
              <input
                type="text"
                maxLength={6}
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="••••••"
                className="w-full text-center tracking-widest text-xl font-bold py-4 rounded-xl bg-white/10 border border-white/20 placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-teal-400"
              />
            </div>

            <button
              onClick={handleVerify}
              disabled={status === 'verifying' as 'idle' | 'verifying' || code.length < 6}
              className="w-full bg-teal-500 hover:bg-teal-600 mt-6 py-3 rounded-xl font-semibold text-white transition-all disabled:opacity-50"
            >
              {status === 'verifying' as 'idle' | 'verifying' ? (
                <div className="flex items-center justify-center gap-2">
                  <Loading />
                  <span>Verifying...</span>
                </div>
              ) : (
                'Verify Code'
              )}
            </button>
          </>
        )}

        {status === 'verifying' && (
          <div className="flex flex-col items-center justify-center">
            <Loading />
            <p className="mt-4 text-slate-400">Checking your code...</p>
          </div>
        )}

        {status === 'success' && (
          <div className="animate-scale-in">
            <SuccessAnimation />
            <h2 className="mt-6 text-2xl font-bold text-teal-400">Access Granted</h2>
            <p className="mt-2 text-slate-300">Redirecting to your dashboard...</p>
          </div>
        )}

        {status === 'error' && (
          <>
            <FiXCircle size={48} className="mx-auto mb-4 text-red-500" />
            <h2 className="text-2xl font-bold text-red-400">Invalid Code</h2>
            <p className="mt-2 text-slate-400">Please check your email and try again.</p>
            <button
              onClick={() => setStatus('idle')}
              className="mt-6 text-sm text-teal-400 hover:underline"
            >
              Try again
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default TwoFactorAuth;
