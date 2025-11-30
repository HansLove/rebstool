import { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { http } from '@/core/utils/http_request';
import useAuth from '@/core/hooks/useAuth';
import SuccessAnimation from '@/components/animations/success/SuccessAnimation';
import { FiXCircle } from 'react-icons/fi';
import { RUTE_VERIFY_EMAIL } from '@/app/routes/routes';

const EmailVerification = () => {
  const { token } = useParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [userName, setUserName] = useState<string | null>(null);
  const { setToken } = useAuth();
  const hasVerified = useRef(false); // evita múltiples ejecuciones
  const navigate = useNavigate();

  
  useEffect(() => {
    if (!token || hasVerified.current) return;
    hasVerified.current = true;

    const verifyEmail = async () => {
      try {
        const response = await http.get(`${RUTE_VERIFY_EMAIL}/${token}`);

        if (response.status === 201) {
          const user = response?.data?.data?.user;
          const jwt = response?.data?.data?.token;
          if (user && jwt) {
            setToken(user, jwt);
          }
          const possibleName =
            user?.firstName ||
            user?.name ||
            user?.username ||
            null;
          setUserName(possibleName);
          setStatus('success');

          // Smooth redirect to SyncYourAccount
          setTimeout(() => {
            window.location.replace('/syncYourAccount');
          }, 1200);
        } else {
          setStatus('error');
        }
      } catch (error) {
        console.error('Verification error:', error);
        setStatus('error');
      }
    };

    verifyEmail();
  }, [token, navigate, setToken]);

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
      {/* Ambient glow */}
      <div className="floating-top-center" aria-hidden="true" />

      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-16">
        <div className="w-full max-w-lg glass backdrop-blur-enhanced shadow-elegant rounded-2xl border border-white/10 p-8 text-center animate-fade-in">
          {/* Brand */}
          <div className="mb-6">
            <Link to="/" className="inline-flex items-center justify-center gap-2 textcolor text-2xl font-extrabold tracking-tight">
              Rebtools
            </Link>
          </div>

          {status === 'loading' && (
            <>
              <div className="mx-auto mb-6 h-12 w-12 rounded-full border-4 border-teal-400/60 border-t-transparent animate-spin" aria-label="Verifying" />
              <h1 className="text-2xl font-semibold">Verifying your email…</h1>
              <p className="mt-2 text-slate-300">Preparing your account setup…</p>
            </>
          )}

          {status === 'success' && (
            <>
              <div className="animate-scale-in">
                <SuccessAnimation />
              </div>
              <h1 className="mt-6 text-3xl font-extrabold">
                Welcome{userName ? `, ${userName}` : ''}!
              </h1>
              <p className="mt-2 text-slate-300">
                Your email is confirmed. Your master affiliate tools are ready.
              </p>
              <div className="mt-6 flex flex-col items-center gap-3">
                <button
                  type="button"
                  onClick={() => window.location.replace('/syncYourAccount')}
                  className="btn-hover focus-ring inline-flex items-center justify-center rounded-full bg-teal-500 px-6 py-3 text-sm font-semibold text-white shadow-elegant-hover"
                >
                  Go to setup now
                </button>
                <p className="text-xs text-slate-400">Redirecting to setup…</p>
              </div>
            </>
          )}

          {status === 'error' && (
            <>
              <FiXCircle size={48} className="mx-auto mb-4 text-red-500" aria-hidden="true" />
              <h1 className="text-2xl font-bold text-red-400">We couldn’t verify your email</h1>
              <p className="mt-2 text-slate-300">The link may have expired or is invalid.</p>
              <div className="mt-6 flex items-center justify-center gap-3">
                <Link
                  to="/login"
                  className="btn-hover focus-ring inline-flex items-center justify-center rounded-full bg-slate-800 px-5 py-2 text-sm font-semibold text-white"
                >
                  Back to login
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmailVerification;
