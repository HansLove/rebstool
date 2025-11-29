import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  FiUser, FiSave, FiSettings, FiKey, FiShield, 
  FiLink, FiUsers, FiEye, FiEyeOff, FiRefreshCw
} from "react-icons/fi";
import { FaWallet, FaNetworkWired } from "react-icons/fa6";
import { FaCog } from "react-icons/fa";
import { http } from "@/core/utils/http_request";
import { useGlobalProvider } from "@/context/GlobalProvider";
import { toast } from "react-hot-toast";
import useAuth from "@/core/hooks/useAuth";

interface AffiliateSettings {
  phone: string;
  language: string;
  timezone: string;
  custom_message: string;
  logo_url: string;
  wallet_address: string;
  email_notifications: boolean;
  preferred_currency: string;
  commission_percentage: number;
  two_factor_enabled: boolean;
  block_sub_affiliates: boolean;
  notification_frequency: 'daily' | 'weekly' | 'never';
  export_csv_enabled: boolean;
  test_mode_enabled: boolean;
  webhook_url: string;
}

export default function Settings() {
  const { getUser, getToken } = useAuth();
  const { username, setUsername, email, setEmail } = useGlobalProvider();
  
  // Form states
  const [profileForm, setProfileForm] = useState({
    name: username || "",
    email: email || "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  
  const [affiliateSettings, setAffiliateSettings] = useState<AffiliateSettings>({
    phone: "",
    language: "en",
    timezone: "UTC",
    custom_message: "",
    logo_url: "",
    wallet_address: "",
    email_notifications: true,
    preferred_currency: "USD",
    commission_percentage: 0,
    two_factor_enabled: false,
    block_sub_affiliates: false,
    notification_frequency: "daily",
    export_csv_enabled: false,
    test_mode_enabled: false,
    webhook_url: ""
  });

  // UI states
  const [activeTab, setActiveTab] = useState("profile");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [copied, setCopied] = useState(false);

  const user = getUser();
  const userId = user?.id;

  const fetchSettings = useCallback(async () => {
    try {
      setLoading(true);
      const [userRes, settingsRes] = await Promise.all([
        http.post("users/me", {}, { headers: { Authorization: `Bearer ${getToken()}` } }),
        http.get(`affiliate-settings/${userId}`).catch(() => ({ data: { success: false } }))
      ]);

      if (userRes.data.success) {
        const userData = userRes.data.data;
        setProfileForm(prev => ({
          ...prev,
          name: userData.name || "",
          email: userData.email || ""
        }));
        setUsername(userData.name || "");
        setEmail(userData.email || "");
      }

      if (settingsRes.data.success) {
        setAffiliateSettings(prev => ({
          ...prev,
          ...settingsRes.data.data
        }));
      }
    } catch (error) {
      console.error("Failed to fetch settings:", error);
      toast.error("Failed to load settings");
    } finally {
      setLoading(false);
    }
  // }, [userId, getToken]);
  }, [userId]);

  useEffect(() => {
    if (userId) {
      fetchSettings();
    }
  }, [userId, fetchSettings]);

  const handleProfileSave = async () => {
    if (profileForm.newPassword && profileForm.newPassword !== profileForm.confirmPassword) {
      toast.error("New passwords don't match");
      return;
    }

    if (profileForm.newPassword && profileForm.newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setSaving(true);
    try {
      const payload: {
        name: string;
        email: string;
        password?: string;
      } = {
        name: profileForm.name,
        email: profileForm.email
      };

      if (profileForm.newPassword) {
        payload.password = profileForm.newPassword;
      }

      await http.put("users/me", payload, {
        headers: { Authorization: `Bearer ${getToken()}` }
      });

      setUsername(profileForm.name);
      setEmail(profileForm.email);
      setProfileForm(prev => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      }));
      toast.success("Profile updated successfully");
    } catch (error) {
      console.error("Failed to update profile:", error);
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleAffiliateSettingsSave = async () => {
    setSaving(true);
    try {
      await http.put(`affiliate-settings/${userId}`, affiliateSettings);
      toast.success("Affiliate settings updated successfully");
    } catch (error) {
      console.error("Failed to update affiliate settings:", error);
      toast.error("Failed to update affiliate settings");
    } finally {
      setSaving(false);
    }
  };

  const handleCopyInviteLink = async () => {
    const baseUrl = window.location.origin;
    const inviteUrl = `${baseUrl}/partners`;
    
    try {
      await navigator.clipboard.writeText(inviteUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast.success("Invite link copied to clipboard");
    } catch (error) {
      console.error("Failed to copy invite link:", error);
      toast.error("Failed to copy invite link");
    }
  };

  const tabs = [
    { id: "profile", label: "Profile", icon: FiUser },
    { id: "affiliate", label: "Affiliate", icon: FaNetworkWired },
    { id: "security", label: "Security", icon: FiShield },
    { id: "network", label: "Network", icon: FiUsers },
    { id: "integrations", label: "Integrations", icon: FaCog }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex items-center gap-3">
          <FiRefreshCw className="w-6 h-6 animate-spin text-blue-600" />
          <span className="text-lg text-gray-600">Loading settings...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center px-4 py-2 mb-6 text-sm font-semibold text-blue-700 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300 rounded-full">
            <FiSettings className="w-4 h-4 mr-2" />
            Master Affiliate Settings
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Account Settings
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Manage your profile, affiliate preferences, and network settings
          </p>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col sm:flex-row gap-4 justify-center mb-8"
        >
          <button
            onClick={handleCopyInviteLink}
            className="inline-flex items-center px-6 py-3 text-lg font-semibold text-blue-600 dark:text-blue-400 bg-white dark:bg-slate-800 border-2 border-blue-200 dark:border-blue-700 hover:border-blue-300 dark:hover:border-blue-600 rounded-full transition-all duration-200 hover:scale-105"
          >
            <FiLink className="mr-2 w-5 h-5" />
            {copied ? "Copied!" : "Copy Invite Link"}
          </button>
        </motion.div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-lg p-6">
              <nav className="space-y-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200 ${
                        activeTab === tab.id
                          ? "bg-blue-600 text-white shadow-lg"
                          : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{tab.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Content Area */}
          <div className="lg:col-span-3">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-lg overflow-hidden"
              >
                {/* Profile Tab */}
                {activeTab === "profile" && (
                  <div className="p-8">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                      <FiUser className="w-6 h-6 text-blue-600" />
                      Profile Settings
                    </h2>
                    
                    <div className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Username
                          </label>
                          <input
                            type="text"
                            value={profileForm.name}
                            onChange={(e) => setProfileForm(prev => ({ ...prev, name: e.target.value }))}
                            className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all duration-200"
                            placeholder="Enter your username"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Email Address
                          </label>
                          <input
                            type="email"
                            value={profileForm.email}
                            onChange={(e) => setProfileForm(prev => ({ ...prev, email: e.target.value }))}
                            className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all duration-200"
                            placeholder="you@example.com"
                          />
                        </div>
                      </div>

                      <div className="border-t border-gray-200 dark:border-slate-700 pt-6">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Change Password</h3>
                        <div className="grid md:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              Current Password
                            </label>
                            <div className="relative">
                              <input
                                type={showPassword ? "text" : "password"}
                                value={profileForm.currentPassword}
                                onChange={(e) => setProfileForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                                className="w-full px-4 py-3 pr-10 border border-gray-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all duration-200"
                                placeholder="Current password"
                              />
                              <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                              >
                                {showPassword ? <FiEyeOff className="w-5 h-5 text-gray-400" /> : <FiEye className="w-5 h-5 text-gray-400" />}
                              </button>
                            </div>
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              New Password
                            </label>
                            <input
                              type="password"
                              value={profileForm.newPassword}
                              onChange={(e) => setProfileForm(prev => ({ ...prev, newPassword: e.target.value }))}
                              className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all duration-200"
                              placeholder="New password"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              Confirm Password
                            </label>
                            <input
                              type="password"
                              value={profileForm.confirmPassword}
                              onChange={(e) => setProfileForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                              className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all duration-200"
                              placeholder="Confirm password"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-end pt-6">
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={handleProfileSave}
                          disabled={saving}
                          className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <FiSave className="mr-2 w-5 h-5" />
                          {saving ? "Saving..." : "Save Changes"}
                        </motion.button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Affiliate Tab */}
                {activeTab === "affiliate" && (
                  <div className="p-8">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                      <FaNetworkWired className="w-6 h-6 text-blue-600" />
                      Affiliate Preferences
                    </h2>
                    
                    <div className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Commission Percentage
                          </label>
                          <div className="relative">
                            <input
                              type="number"
                              step="0.01"
                              min="0"
                              max="100"
                              value={affiliateSettings.commission_percentage}
                              onChange={(e) => setAffiliateSettings(prev => ({ ...prev, commission_percentage: parseFloat(e.target.value) || 0 }))}
                              className="w-full px-4 py-3 pr-12 border border-gray-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all duration-200"
                              placeholder="0.00"
                            />
                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                              <span className="text-gray-500">%</span>
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Preferred Currency
                          </label>
                          <select
                            value={affiliateSettings.preferred_currency}
                            onChange={(e) => setAffiliateSettings(prev => ({ ...prev, preferred_currency: e.target.value }))}
                            className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all duration-200"
                          >
                            <option value="USD">USD - US Dollar</option>
                            <option value="EUR">EUR - Euro</option>
                            <option value="GBP">GBP - British Pound</option>
                            <option value="MXN">MXN - Mexican Peso</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Custom Welcome Message
                        </label>
                        <textarea
                          value={affiliateSettings.custom_message}
                          onChange={(e) => setAffiliateSettings(prev => ({ ...prev, custom_message: e.target.value }))}
                          rows={4}
                          className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all duration-200"
                          placeholder="Welcome message for new sub-affiliates..."
                        />
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Language
                          </label>
                          <select
                            value={affiliateSettings.language}
                            onChange={(e) => setAffiliateSettings(prev => ({ ...prev, language: e.target.value }))}
                            className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all duration-200"
                          >
                            <option value="en">English</option>
                            <option value="es">Spanish</option>
                            <option value="fr">French</option>
                          </select>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Timezone
                          </label>
                          <select
                            value={affiliateSettings.timezone}
                            onChange={(e) => setAffiliateSettings(prev => ({ ...prev, timezone: e.target.value }))}
                            className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all duration-200"
                          >
                            <option value="UTC">UTC</option>
                            <option value="America/New_York">Eastern Time</option>
                            <option value="America/Chicago">Central Time</option>
                            <option value="America/Denver">Mountain Time</option>
                            <option value="America/Los_Angeles">Pacific Time</option>
                          </select>
                        </div>
                      </div>

                      <div className="flex justify-end pt-6">
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={handleAffiliateSettingsSave}
                          disabled={saving}
                          className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <FiSave className="mr-2 w-5 h-5" />
                          {saving ? "Saving..." : "Save Settings"}
                        </motion.button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Security Tab */}
                {activeTab === "security" && (
                  <div className="p-8">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                      <FiShield className="w-6 h-6 text-blue-600" />
                      Security Settings
                    </h2>
                    
                    <div className="space-y-6">
                      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-6">
                        <div className="flex items-start gap-3">
                          <FiShield className="w-6 h-6 text-yellow-600 mt-1" />
                          <div>
                            <h3 className="text-lg font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
                              Two-Factor Authentication
                            </h3>
                            <p className="text-yellow-700 dark:text-yellow-300 mb-4">
                              Enhance your account security by enabling two-factor authentication.
                            </p>
                            <button className="inline-flex items-center px-4 py-2 bg-yellow-600 text-white font-medium rounded-lg hover:bg-yellow-700 transition-colors duration-200">
                              <FiKey className="mr-2 w-4 h-4" />
                              Enable 2FA
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6">
                        <div className="flex items-start gap-3">
                          <FaWallet className="w-6 h-6 text-blue-600 mt-1" />
                          <div>
                            <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-200 mb-2">
                              Wallet Security
                            </h3>
                            <p className="text-blue-700 dark:text-blue-300 mb-4">
                              Manage your connected wallets and security preferences.
                            </p>
                            <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200">
                              <FiSettings className="mr-2 w-4 h-4" />
                              Manage Wallets
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Network Tab */}
                {activeTab === "network" && (
                  <div className="p-8">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                      <FiUsers className="w-6 h-6 text-blue-600" />
                      Network Preferences
                    </h2>
                    
                    <div className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-xl p-6">
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Email Notifications</h3>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={affiliateSettings.email_notifications}
                                onChange={(e) => setAffiliateSettings(prev => ({ ...prev, email_notifications: e.target.checked }))}
                                className="sr-only peer"
                              />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 dark:peer-focus:ring-purple-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-purple-600"></div>
                            </label>
                          </div>
                          <p className="text-gray-600 dark:text-gray-300 text-sm">
                            Receive email notifications about network activities and earnings.
                          </p>
                        </div>
                        
                        <div className="bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-xl p-6">
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Block Sub-Affiliates</h3>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={affiliateSettings.block_sub_affiliates}
                                onChange={(e) => setAffiliateSettings(prev => ({ ...prev, block_sub_affiliates: e.target.checked }))}
                                className="sr-only peer"
                              />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 dark:peer-focus:ring-purple-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-purple-600"></div>
                            </label>
                          </div>
                          <p className="text-gray-600 dark:text-gray-300 text-sm">
                            Temporarily block sub-affiliates from your network.
                          </p>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Notification Frequency
                        </label>
                        <select
                          value={affiliateSettings.notification_frequency}
                          onChange={(e) => setAffiliateSettings(prev => ({ ...prev, notification_frequency: e.target.value as 'daily' | 'weekly' | 'never' }))}
                          className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all duration-200"
                        >
                          <option value="daily">Daily</option>
                          <option value="weekly">Weekly</option>
                          <option value="never">Never</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {/* Integrations Tab */}
                {activeTab === "integrations" && (
                  <div className="p-8">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                      <FaCog className="w-6 h-6 text-blue-600" />
                      Integrations & API
                    </h2>
                    
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Webhook URL
                        </label>
                        <input
                          type="url"
                          value={affiliateSettings.webhook_url}
                          onChange={(e) => setAffiliateSettings(prev => ({ ...prev, webhook_url: e.target.value }))}
                          className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all duration-200"
                          placeholder="https://your-domain.com/webhook"
                        />
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                          Receive real-time notifications about network activities.
                        </p>
                      </div>

                      <div className="bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-xl p-6">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">API Access</h3>
                        <p className="text-gray-600 dark:text-gray-300 mb-4">
                          Access your affiliate data programmatically through our REST API.
                        </p>
                        <button className="inline-flex items-center px-4 py-2 bg-gray-600 text-white font-medium rounded-lg hover:bg-gray-700 transition-colors duration-200">
                          <FiKey className="mr-2 w-4 h-4" />
                          Generate API Key
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
