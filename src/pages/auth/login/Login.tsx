/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useForm } from "react-hook-form";
import { FaEye, FaEyeSlash, FaEnvelope, FaLock, FaKey } from "react-icons/fa6";
import { ILoginForm } from "./types/type";
import { http } from "@/core/utils/http_request";
import useAuth from "@/core/hooks/useAuth";
import SplashPage from "@/components/SplashPage";
import Loading from "@/components/loaders/loading1/Loading";
import { RUTE_USER_LOGIN, RUTE_USER_LOGIN_2FA } from "@/app/routes/routes";

function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ILoginForm>();

  const { setToken } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [requires2FA, setRequires2FA] = useState(false);
  const [email, setEmail] = useState(""); // Guardamos el email del primer paso
  const [code, setCode] = useState(""); // Código 2FA ingresado por el usuario
  const [verifying, setVerifying] = useState(false);

  const onValid = async (data: ILoginForm) => {
    try {
      const response = await http.post(RUTE_USER_LOGIN, {
        email: data.emailOrPhone,
        password: data.password,
      });

      if (response.status !== 200) throw new Error("Login failed");
      console.log("✅ Login successful:", response.data);

      // Si requiere 2FA, no guardamos el token aún
      if (response.data.requires2FA) {
        setRequires2FA(true);
        setEmail(data.emailOrPhone);
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
      if (requires2FA) verify2FA();
      else handleSubmit(onValid)();
    }
  };

  if (showWelcome) return <SplashPage />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center px-6 py-12">
      <div className="relative w-full max-w-md">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-light text-slate-800 mb-2 tracking-wide">
            Rebtools
          </h1>
          <p className="text-slate-500 text-sm font-medium tracking-wider uppercase">
            Network solutions
          </p>
        </div>

        {/* 📦 Main Form Card */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.08)] border border-white/20 p-10">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-light text-slate-800 mb-2">
              {requires2FA ? "Two-Factor Verification" : "Welcome back"}
            </h2>
            <p className="text-slate-500 text-sm">
              {requires2FA
                ? "Enter the 6-digit code sent to your email"
                : "Sign in to your account"}
            </p>
          </div>

          {/* 🔐 Two-Factor Step */}
          {requires2FA ? (
            <div className="space-y-6">
              {errorMessage && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-2xl text-sm text-center font-medium animate-fade-in">
                  {errorMessage}
                </div>
              )}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">
                  Verification Code
                </label>
                <div className="relative group">
                  <FaKey className="absolute top-4 left-4 text-slate-400 group-focus-within:text-blue-500" />
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    onKeyDown={onEnterKeyPress}
                    placeholder="Enter the 6-digit code"
                    maxLength={6}
                    className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-200 text-slate-800 placeholder-slate-400 
                             bg-white/50 backdrop-blur-sm transition-all duration-300 ease-out
                             focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500
                             focus:bg-white focus:shadow-lg hover:border-slate-300 text-center tracking-widest font-semibold text-lg"
                  />
                </div>
              </div>

              <button
                onClick={verify2FA}
                disabled={verifying || code.length < 6}
                className="w-full bg-gradient-to-r from-blue-700 to-slate-700 hover:from-blue-800 hover:to-slate-800 
                         text-white font-semibold py-4 rounded-2xl transition-all duration-300 ease-out
                         transform hover:scale-[1.02] hover:shadow-xl active:scale-[0.98]
                         disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
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
            </div>
          ) : (
            /* 💬 Regular Login Form */
            <form onSubmit={handleSubmit(onValid)} className="space-y-6">
              {errorMessage && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-2xl text-sm text-center font-medium animate-fade-in">
                  {errorMessage}
                </div>
              )}

              {/* Email */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">
                  Email Address
                </label>
                <div className="relative group">
                  <FaEnvelope className="absolute top-4 left-4 text-slate-400 group-focus-within:text-blue-500" />
                  <input
                    type="email"
                    placeholder="Enter your email"
                    {...register("emailOrPhone", { required: "Email is required" })}
                    onKeyDown={onEnterKeyPress}
                    className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-200 text-slate-800 placeholder-slate-400 
                             bg-white/50 backdrop-blur-sm transition-all duration-300 ease-out
                             focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500
                             focus:bg-white focus:shadow-lg hover:border-slate-300"
                  />
                </div>
                {errors?.emailOrPhone && (
                  <p className="text-red-500 text-xs mt-2 ml-1 animate-fade-in">
                    {errors.emailOrPhone.message}
                  </p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">
                  Password
                </label>
                <div className="relative group">
                  <FaLock className="absolute top-4 left-4 text-slate-400 group-focus-within:text-blue-500" />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    {...register("password", { required: "Password is required" })}
                    onKeyDown={onEnterKeyPress}
                    className="w-full pl-12 pr-12 py-4 rounded-2xl border border-slate-200 text-slate-800 placeholder-slate-400 
                             bg-white/50 backdrop-blur-sm transition-all duration-300 ease-out
                             focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500
                             focus:bg-white focus:shadow-lg hover:border-slate-300"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors duration-200 p-1 rounded-lg hover:bg-slate-100"
                  >
                    {showPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                  </button>
                </div>
                {errors?.password && (
                  <p className="text-red-500 text-xs mt-2 ml-1 animate-fade-in">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Links + Submit */}
              <div className="flex justify-between items-center text-sm">
                <a
                  href="/forgot-password"
                  className="text-blue-600 hover:text-blue-700 font-medium hover:underline"
                >
                  Forgot password?
                </a>
                <a
                  href="/contact-us"
                  className="text-slate-600 hover:text-slate-800 font-medium hover:underline"
                >
                  Contact us
                </a>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-blue-700 to-slate-700 hover:from-blue-800 hover:to-slate-800 
                         text-white font-semibold py-4 rounded-2xl transition-all duration-300 ease-out
                         transform hover:scale-[1.02] hover:shadow-xl active:scale-[0.98]
                         disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
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
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default Login;
