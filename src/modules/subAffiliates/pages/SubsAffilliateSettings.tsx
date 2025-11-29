// import useAuth from "../../core/hooks/useAuth";
import { useState } from "react";
import { FiUser, FiMail, FiSave, FiSettings, FiKey } from "react-icons/fi";
import { http } from "@/core/utils/http_request";
import { useGlobalProvider } from "@/context/GlobalProvider";
import { toast } from "react-hot-toast";

// const currencyOptions = ["USD", "EUR", "GBP", "MXN"];

export default function SubsAffiliatesSettings() {
  // const { getToken } = useAuth();
  const {
    username,
    setUsername,
    email,
    setEmail,
    currency,
    // setCurrency,
  } = useGlobalProvider();

  const [saving, setSaving] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSave = async () => {
    if (password && password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (password && password.length < 4) {
      toast.error("Password must be at least 4 characters");
      return;
    }

    if (confirmPassword && confirmPassword.length < 4) {
      toast.error("Confirmation must be at least 4 characters");
      return;
    }

    setSaving(true);
    try {
      // const token = getToken();
      const payload = {
        name: username,
        email,
        currency,
        ...(password ? { password } : {})
      };

      await http.put("users/me", payload, {
        // headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("✅ Settings updated successfully");
    } catch (err) {
      console.error(err);
      toast.error("❌ Failed to update settings");
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="max-w-3xl mx-auto px-6 py-10">
      <header className="flex items-center gap-3 mb-10">
        <div className="bg-indigo-600/20 dark:bg-indigo-600/20 p-3 rounded-xl">
          <FiSettings className="text-indigo-600 dark:text-indigo-400 w-6 h-6" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Account Settings</h2>
      </header>

      <div className="bg-white dark:bg-gradient-to-tr dark:from-slate-800 dark:to-slate-900 shadow-2xl rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700">
        <div className="p-6 space-y-6">
          {/* Username */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-white mb-1">Username</label>
            <div className="flex items-center bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-2">
              <FiUser className="text-indigo-600 dark:text-indigo-400 mr-2" />
              <input
                type="text"
                className="flex-1 bg-transparent text-slate-900 dark:text-white outline-none placeholder-slate-400 dark:placeholder-slate-500"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-white mb-1">Email</label>
            <div className="flex items-center bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-2">
              <FiMail className="text-pink-500 dark:text-pink-400 mr-2" />
              <input
                type="email"
                className="flex-1 bg-transparent text-slate-900 dark:text-white outline-none placeholder-slate-400 dark:placeholder-slate-500"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          {/* Password Change */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-white mb-1">New Password</label>
            <div className="flex items-center bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-2">
              <FiKey className="text-yellow-500 dark:text-yellow-400 mr-2" />
              <input
                type="password"
                className="flex-1 bg-transparent text-slate-900 dark:text-white outline-none placeholder-slate-400 dark:placeholder-slate-500"
                placeholder="••••••••"
                minLength={4}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-white mb-1">Confirm Password</label>
            <div className="flex items-center bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-2">
              <FiKey className="text-yellow-500 dark:text-yellow-400 mr-2" />
              <input
                type="password"
                className="flex-1 bg-transparent text-slate-900 dark:text-white outline-none placeholder-slate-400 dark:placeholder-slate-500"
                placeholder="••••••••"
                minLength={4}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          </div>

          {/* Currency Selection */}
          {/* <div>
            <label className="block text-sm font-medium text-white mb-1">Preferred Currency</label>
            <div className="flex items-center bg-slate-800 border border-slate-600 rounded-lg px-3 py-2">
              <FaMoneyBillWave className="text-emerald-400 mr-2" />
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="flex-1 bg-transparent text-white outline-none"
              >
                {currencyOptions.map((curr) => (
                  <option key={curr} value={curr} className="text-black">
                    {curr}
                  </option>
                ))}
              </select>
            </div>
          </div> */}

          {/* Save Button */}
          <div className="pt-4 flex justify-end">
            <button
              onClick={handleSave}
              type="submit"
              disabled={saving}
              className="bg-blue-600 hover:bg-blue-700 transition px-6 py-2.5 rounded-lg text-white font-semibold disabled:opacity-50 flex items-center gap-2"
            >
              <FiSave className="h-5 w-5" />
              {saving ? "Saving..." : "Save Settings"}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
