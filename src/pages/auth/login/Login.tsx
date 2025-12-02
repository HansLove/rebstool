/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, FormEvent } from "react";
import { FaEye, FaEyeSlash, FaEnvelope, FaLock, FaKey } from "react-icons/fa6";
import { http } from "@/core/utils/http_request";
import useAuth from "@/core/hooks/useAuth";
import SplashPage from "@/components/SplashPage";
import Loading from "@/components/loaders/loading1/Loading";
import { RUTE_USER_LOGIN, RUTE_USER_LOGIN_2FA } from "@/app/routes/routes";
import { RebToolsLogo } from "@/components/RebToolsLogo";
import { motion } from "motion/react";

function Login() {
  const { setToken } = useAuth();
  
  // Form state
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  
  // UI state
  const [showWelcome, setShowWelcome] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // 2FA state
  const [requires2FA, setRequires2FA] = useState(false);
  const [email, setEmail] = useState(""); // Guardamos el email del primer paso
  const [code, setCode] = useState(""); // Código 2FA ingresado por el usuario
  const [verifying, setVerifying] = useState(false);

  // Validation
  const validateForm = (): boolean => {
    if (!emailOrPhone.trim()) {
      setErrorMessage("Email is required");
      return false;
    }
    if (!password.trim()) {
      setErrorMessage("Password is required");
      return false;
    }
    setErrorMessage("");
    return true;
  };

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      setIsSubmitting(true);
      setErrorMessage("");
      
      const response = await http.post(RUTE_USER_LOGIN, {
        email: emailOrPhone,
        password: password,
      });

      if (response.status !== 200) throw new Error("Login failed");
      console.log("✅ Login successful:", response.data);

      // Si requiere 2FA, no guardamos el token aún
      if (response.data.requires2FA) {
        setRequires2FA(true);
        setEmail(emailOrPhone);
        return;
      }

      // Si no requiere 2FA, login normal
      setToken(response.data.data.user, response.data.data.token);
      setShowWelcome(true);
      setTimeout(() => (window.location.href = "/dashboard"), 2000);
    } catch (error: any) {
      const msg = error?.response?.data?.message || "Login failed";
      console.error("❌ Login error:", msg);
      setErrorMessage(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const verify2FA = async () => {
    try {
      setVerifying(true);
      const response = await http.post(RUTE_USER_LOGIN_2FA, {
        email,
        code,
      });

      if (response.status !== 201) throw new Error("Verification failed");
      console.log("✅ 2FA verified:", response.data);

      setToken(response.data.data.user, response.data.data.token);
      setShowWelcome(true);
      setTimeout(() => (window.location.href = "/dashboard"), 2000);
    } catch (error: any) {
      const msg = error?.response?.data?.message || "Invalid code";
      console.error("❌ Verification error:", msg);
      setErrorMessage(msg);
    } finally {
      setVerifying(false);
    }
  };

  const onEnterKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      if (requires2FA) {
        verify2FA();
      } else {
        const form = event.currentTarget.closest("form");
        if (form) {
          form.requestSubmit();
        }
      }
    }
  };

  if (showWelcome) return <SplashPage />;

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-sky-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center px-6 py-12 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-sky-400/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="relative w-full max-w-md z-10">
        {/* Logo and Branding */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <div className="flex justify-center mb-4">
            <RebToolsLogo width={180} height={54} />
          </div>
          <p className="text-slate-600 dark:text-slate-400 text-sm font-medium">
            Professional Rebates Analysis Platform
          </p>
        </motion.div>

        {/* Main Form Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-200/50 dark:border-slate-700/50 p-8 sm:p-10"
        >
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-2">
              {requires2FA ? "Two-Factor Verification" : "Welcome Back"}
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm">
              {requires2FA
                ? "Enter the 6-digit code sent to your email"
                : "Sign in to access your dashboard"}
            </p>
          </div>

          {/* Two-Factor Step */}
          {requires2FA ? (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
              className="space-y-6"
            >
              {errorMessage && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded-xl text-sm text-center font-medium"
                >
                  {errorMessage}
                </motion.div>
              )}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Verification Code
                </label>
                <div className="relative group">
                  <FaKey className="absolute top-4 left-4 text-slate-400 dark:text-slate-500 group-focus-within:text-sky-500 transition-colors" />
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    onKeyDown={onEnterKeyPress}
                    placeholder="000000"
                    maxLength={6}
                    className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 
                             bg-slate-50 dark:bg-slate-700/50 transition-all duration-200
                             focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 dark:focus:border-sky-400
                             focus:bg-white dark:focus:bg-slate-700 hover:border-slate-300 dark:hover:border-slate-600 
                             text-center tracking-[0.5em] font-bold text-xl"
                  />
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 text-center">
                  Check your email for the verification code
                </p>
              </div>

              <button
                onClick={verify2FA}
                disabled={verifying || code.length < 6}
                className="w-full bg-gradient-to-r from-sky-600 to-emerald-600 hover:from-sky-700 hover:to-emerald-700 
                         text-white font-semibold py-4 rounded-xl transition-all duration-200
                         transform hover:scale-[1.02] hover:shadow-lg active:scale-[0.98]
                         disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-md"
              >
                {verifying ? (
                  <div className="flex items-center justify-center space-x-2">
                    <Loading />
                    <span>Verifying...</span>
                  </div>
                ) : (
                  "Verify Code"
                )}
              </button>
            </motion.div>
          ) : (
            /* Regular Login Form */
            <motion.form
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
              onSubmit={handleLogin}
              className="space-y-5"
            >
              {errorMessage && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded-xl text-sm text-center font-medium"
                >
                  {errorMessage}
                </motion.div>
              )}

              {/* Email */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Email Address
                </label>
                <div className="relative group">
                  <FaEnvelope className="absolute top-4 left-4 text-slate-400 dark:text-slate-500 group-focus-within:text-sky-500 transition-colors" />
                  <input
                    type="email"
                    placeholder="you@example.com"
                    value={emailOrPhone}
                    onChange={(e) => {
                      setEmailOrPhone(e.target.value);
                      setErrorMessage(""); // Clear error on change
                    }}
                    onKeyDown={onEnterKeyPress}
                    className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 
                             bg-slate-50 dark:bg-slate-700/50 transition-all duration-200
                             focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 dark:focus:border-sky-400
                             focus:bg-white dark:focus:bg-slate-700 hover:border-slate-300 dark:hover:border-slate-600"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Password
                </label>
                <div className="relative group">
                  <FaLock className="absolute top-4 left-4 text-slate-400 dark:text-slate-500 group-focus-within:text-sky-500 transition-colors" />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setErrorMessage(""); // Clear error on change
                    }}
                    onKeyDown={onEnterKeyPress}
                    className="w-full pl-12 pr-12 py-4 rounded-xl border-2 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 
                             bg-slate-50 dark:bg-slate-700/50 transition-all duration-200
                             focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 dark:focus:border-sky-400
                             focus:bg-white dark:focus:bg-slate-700 hover:border-slate-300 dark:hover:border-slate-600"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute top-4 right-4 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition-colors duration-200 p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700"
                  >
                    {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                  </button>
                </div>
              </div>

              {/* Links */}
              <div className="flex justify-between items-center text-sm pt-2">
                <a
                  href="/forgot-password"
                  className="text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300 font-medium hover:underline transition-colors"
                >
                  Forgot password?
                </a>
                <a
                  href="/contact-us"
                  className="text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 font-medium hover:underline transition-colors"
                >
                  Need help?
                </a>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-sky-600 to-emerald-600 hover:from-sky-700 hover:to-emerald-700 
                         text-white font-semibold py-4 rounded-xl transition-all duration-200
                         transform hover:scale-[1.02] hover:shadow-lg active:scale-[0.98]
                         disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-md mt-6"
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center space-x-2">
                    <Loading />
                    <span>Signing in...</span>
                  </div>
                ) : (
                  "Sign In"
                )}
              </button>
            </motion.form>
          )}
        </motion.div>

        {/* Footer text */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mt-8"
        >
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            Don't have an account?{" "}
            <a href="/register" className="text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300 font-medium hover:underline">
              Contact administrator
            </a>
          </p>
        </motion.div>
      </div>
    </div>
  );
}

export default Login;
