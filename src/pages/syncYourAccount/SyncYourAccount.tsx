/* eslint-disable @typescript-eslint/no-explicit-any */
import { useOutletContext } from "react-router-dom";
import { useMemo, useState } from "react";
import ConnectCellxpertForm from "@/modules/affiliates/pages/ConnectCellxpertForm";
import SuccessAnimation from "@/components/animations/success/SuccessAnimation";

export default function SyncYourAccount() {
  const { loadAccounts, accounts, setSelectedAccountId } = useOutletContext<any>();
  const [success, setSuccess] = useState(false);
  const [redirecting, setRedirecting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showVaultAlert, setShowVaultAlert] = useState(true);

  const progressPct = success ? 100 : 33;

  const steps = useMemo(
    () => [
      { key: "connect", label: "Connect", active: !success, done: success },
      { key: "verify", label: "Verify", active: false, done: success },
      { key: "explore", label: "Explore", active: false, done: success },
    ],
    [success]
  );

  const handleSuccess = async () => {
    setErrorMessage(null);
    setSuccess(true);

    setTimeout(async () => {
      await loadAccounts();

      const latestAccount = accounts[accounts.length - 1];
      if (latestAccount) {
        setSelectedAccountId(latestAccount.id);
      }

      setRedirecting(true);

      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 2200);
    }, 1200);
  };

  return (
    <>
      {/* Vault Contract Creation Alert */}
      {showVaultAlert && (
        <div className="fixed top-0 right-0 left-0 z-[9999] transform transition-all duration-300 ease-out">
          <div className="w-full border-b border-blue-200 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 shadow-lg dark:border-slate-700 dark:from-slate-800 dark:via-slate-800 dark:to-slate-800">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between py-3">
                {/* Icon and Message */}
                <div className="flex items-center space-x-3">
                  {/* Loading/Info Icon */}
                  <div className="flex-shrink-0">
                    <div className="relative">
                      <div className="h-6 w-6 animate-spin rounded-full border-2 border-blue-600 border-t-transparent dark:border-blue-400"></div>
                      <div className="absolute inset-0 flex h-6 w-6 items-center justify-center">
                        <div className="h-2 w-2 rounded-full bg-blue-600 dark:bg-blue-400"></div>
                      </div>
                    </div>
                  </div>

                  {/* Message Text */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2">
                    <span className="text-sm font-medium text-slate-800 dark:text-slate-200">
                      Creating vault contract
                    </span>
                    <span className="text-sm text-slate-600 dark:text-slate-400">
                      • Once completed, you'll be able to deposit earnings
                    </span>
                  </div>
                </div>

                {/* Close Button */}
                <div className="flex-shrink-0">
                  <button
                    onClick={() => setShowVaultAlert(false)}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/80 transition-colors duration-200 hover:bg-white focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none dark:bg-slate-700/80 dark:hover:bg-slate-700 dark:focus:ring-blue-400 dark:focus:ring-offset-slate-800"
                    aria-label="Close alert"
                  >
                    <svg
                      className="h-4 w-4 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="h-1 bg-gradient-to-r from-blue-200 via-indigo-200 to-purple-200 dark:from-slate-700 dark:via-slate-700 dark:to-slate-700">
              <div className="h-full animate-pulse bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 dark:from-blue-400 dark:via-indigo-400 dark:to-purple-400"></div>
            </div>
          </div>
        </div>
      )}

      <section className="relative flex min-h-[80vh] items-center justify-center overflow-hidden px-6 py-24 pb-16">
        {/* Ambient gradient orbs */}
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-gradient-to-br from-indigo-400/30 to-fuchsia-400/30 blur-3xl" />
          <div className="absolute -right-16 -bottom-16 h-72 w-72 rounded-full bg-gradient-to-tr from-emerald-400/30 to-cyan-400/30 blur-3xl" />
        </div>

        <div className="mx-auto w-full max-w-5xl">
          {/* Header */}
          <div className="mb-10 text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/60 px-3 py-1 text-xs font-medium text-gray-700 shadow-sm backdrop-blur dark:border-white/10 dark:bg-slate-900/40 dark:text-gray-200">
              <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
              Master Affiliate • Secure Sync
            </div>
            <h1 className="mt-4 bg-gradient-to-r from-indigo-600 via-fuchsia-600 to-cyan-500 bg-clip-text text-3xl font-extrabold tracking-tight text-transparent sm:text-4xl">
              Connect your CellXpert account
            </h1>
            <p className="mx-auto mt-3 max-w-2xl text-sm text-gray-600 dark:text-gray-300">
              Bring your data to life. Securely link your master affiliate credentials to unlock real‑time dashboards,
              payouts, and growth insights.
            </p>
          </div>

          {/* Content Grid */}
          <div className="grid items-start gap-6 sm:grid-cols-2">
            {/* Benefits / Steps */}
            <div className="order-2 sm:order-1">
              {/* Stepper */}
              <div className="mb-6 rounded-2xl border border-white/30 bg-white/60 p-4 shadow-sm backdrop-blur dark:border-white/10 dark:bg-slate-900/50">
                <div className="mb-3 flex items-center justify-between text-xs font-medium text-gray-600 dark:text-gray-300">
                  <span>Setup progress</span>
                  <span>{progressPct}%</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200/70 dark:bg-slate-700/70">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-fuchsia-500 to-cyan-500 transition-all duration-700"
                    style={{ width: `${progressPct}%` }}
                  />
                </div>

                <div className="mt-4 flex items-center justify-between">
                  {steps.map((s, idx) => (
                    <div key={s.key} className="flex flex-col items-center text-center">
                      <span
                        className={
                          'flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold transition ' +
                          (success
                            ? 'bg-emerald-500 text-white shadow'
                            : idx === 0
                              ? 'bg-indigo-600 text-white shadow'
                              : 'bg-gray-200 text-gray-600 dark:bg-slate-700 dark:text-gray-300')
                        }
                      >
                        {idx + 1}
                      </span>
                      <span className="mt-2 text-xs text-gray-700 dark:text-gray-300">{s.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Value points */}
              <ul className="space-y-3">
                {[
                  {
                    title: 'Instant insights',
                    desc: 'See registrations, deposits and revenue trends as they happen.',
                  },
                  {
                    title: 'Secure by design',
                    desc: 'Your credentials are encrypted. You’re always in control.',
                  },
                  {
                    title: 'Effortless payouts',
                    desc: 'Track balances and initiate payouts without spreadsheets.',
                  },
                ].map(item => (
                  <li
                    key={item.title}
                    className="group flex items-start gap-3 rounded-xl border border-white/30 bg-white/60 p-4 shadow-sm backdrop-blur transition hover:translate-x-0.5 hover:shadow-md dark:border-white/10 dark:bg-slate-900/50"
                  >
                    <span className="mt-1 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-fuchsia-500 text-[10px] font-bold text-white shadow">
                      ✓
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-gray-800 dark:text-white">{item.title}</p>
                      <p className="mt-0.5 text-xs text-gray-600 dark:text-gray-300">{item.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Form Card / Success */}
            <div className="order-1 sm:order-2">
              {!success ? (
                <div className="group relative rounded-2xl border border-white/30 bg-white/70 p-6 shadow-xl backdrop-blur-lg transition hover:shadow-2xl dark:border-white/10 dark:bg-slate-900/60">
                  {/* subtle glow */}
                  <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-white/10" />
                  <div className="absolute -inset-px -z-10 rounded-2xl bg-gradient-to-br from-indigo-500/0 via-fuchsia-500/0 to-cyan-500/0 opacity-0 blur-xl transition group-hover:from-indigo-500/10 group-hover:via-fuchsia-500/10 group-hover:to-cyan-500/10 group-hover:opacity-100" />

                  <h2 className="mb-2 text-left text-lg font-bold text-gray-900 dark:text-white">
                    Link your credentials
                  </h2>
                  <p className="mb-5 text-left text-xs text-gray-600 dark:text-gray-300">
                    We’ll securely connect to CellXpert. This takes less than a minute.
                  </p>

                  {errorMessage && (
                    <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-left text-xs text-red-700 dark:border-red-900/40 dark:bg-red-900/30 dark:text-red-200">
                      {errorMessage}
                    </div>
                  )}

                  <ConnectCellxpertForm
                    onSuccess={handleSuccess}
                    onError={error => {
                      console.error('❌ Connection failed:', error);
                      setErrorMessage('Connection failed. Please verify your credentials and try again.');
                    }}
                  />

                  <div className="mt-5 flex items-center gap-2 text-[11px] text-gray-500 dark:text-gray-400">
                    <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />
                    End‑to‑end encrypted • You can revoke access anytime
                  </div>
                </div>
              ) : (
                <div className="relative overflow-hidden rounded-2xl border border-white/30 bg-white/70 p-8 text-center shadow-xl backdrop-blur-lg dark:border-white/10 dark:bg-slate-900/60">
                  <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-br from-emerald-400/10 via-indigo-400/10 to-fuchsia-400/10" />
                  <SuccessAnimation />
                  <h2 className="mt-4 text-xl font-extrabold text-gray-900 dark:text-white">Account connected</h2>
                  <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                    Setting up your dashboard and pulling fresh data…
                  </p>
                  <div className="mt-5 h-2 w-full overflow-hidden rounded-full bg-gray-200/70 dark:bg-slate-700/70">
                    <div className="h-full w-full animate-[progress_2s_ease-in-out_infinite] rounded-full bg-gradient-to-r from-emerald-500 via-indigo-500 to-fuchsia-500 [background-size:200%]" />
                  </div>
                  {redirecting && (
                    <p className="mt-3 text-xs text-emerald-600 dark:text-emerald-400">Redirecting to dashboard…</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Keyframes for shimmering progress (inline for portability) */}
        <style>{`@keyframes progress {0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}`}</style>
      </section>
    </>
  );
}
