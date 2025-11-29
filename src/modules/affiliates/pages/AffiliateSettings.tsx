/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/AffiliateSettings.jsx
import { useState, useEffect } from 'react';
import { http } from '@/core/utils/http_request';


const AffiliateSettings = ({ userId }:any) => {
  const [form, setForm] = useState({
    phone: '',
    language: '',
    timezone: '',
    custom_message: '',
    logo_url: '',
    wallet_address: '',
    email_notifications: true,
    preferred_currency: '',
    commission_percentage: 0,
    two_factor_enabled: false,
    block_sub_affiliates: false,
    notification_frequency: 'daily',
    export_csv_enabled: false,
    test_mode_enabled: false,
    webhook_url: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await http.get(`affiliate-settings/${userId}`);
        if (res.data.success) {
          setForm(res.data.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, [userId]);

  const handleChange = (e:any) => {
    const { name, type, value, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e:any) => {
    e.preventDefault();
    setSaving(true);
    try {
      await http.put(`affiliate-settings/${userId}`, form);
      // opcional: mostrar notificación de éxito
    } catch (err) {
      console.error(err);
      // opcional: mostrar notificación de error
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p>Loading settings...</p>;

  return (
    <form onSubmit={handleSubmit} className="p-6 bg-white rounded shadow space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block font-medium mb-1">Phone</label>
          <input
            name="phone"
            value={form.phone}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Language</label>
          <input
            name="language"
            value={form.language}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Timezone</label>
          <input
            name="timezone"
            value={form.timezone}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Custom Message</label>
          <textarea
            name="custom_message"
            value={form.custom_message}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Logo URL</label>
          <input
            name="logo_url"
            value={form.logo_url}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Wallet Address</label>
          <input
            name="wallet_address"
            value={form.wallet_address}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>
        <div className="flex items-center">
          <input
            type="checkbox"
            name="email_notifications"
            checked={form.email_notifications}
            onChange={handleChange}
            className="mr-2"
          />
          <label className="font-medium">Email Notifications</label>
        </div>
        <div>
          <label className="block font-medium mb-1">Preferred Currency</label>
          <input
            name="preferred_currency"
            value={form.preferred_currency}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Commission %</label>
          <input
            type="number"
            step="0.01"
            name="commission_percentage"
            value={form.commission_percentage}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>
        <div className="flex items-center">
          <input
            type="checkbox"
            name="two_factor_enabled"
            checked={form.two_factor_enabled}
            onChange={handleChange}
            className="mr-2"
          />
          <label className="font-medium">2FA Enabled</label>
        </div>
        <div className="flex items-center">
          <input
            type="checkbox"
            name="block_sub_affiliates"
            checked={form.block_sub_affiliates}
            onChange={handleChange}
            className="mr-2"
          />
          <label className="font-medium">Block Sub-Affiliates</label>
        </div>
        <div>
          <label className="block font-medium mb-1">Notification Frequency</label>
          <select
            name="notification_frequency"
            value={form.notification_frequency}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="never">Never</option>
          </select>
        </div>
        <div className="flex items-center">
          <input
            type="checkbox"
            name="export_csv_enabled"
            checked={form.export_csv_enabled}
            onChange={handleChange}
            className="mr-2"
          />
          <label className="font-medium">Export CSV</label>
        </div>
        <div className="flex items-center">
          <input
            type="checkbox"
            name="test_mode_enabled"
            checked={form.test_mode_enabled}
            onChange={handleChange}
            className="mr-2"
          />
          <label className="font-medium">Test Mode</label>
        </div>
        <div>
          <label className="block font-medium mb-1">Webhook URL</label>
          <input
            name="webhook_url"
            value={form.webhook_url}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>
      </div>
      <button
        type="submit"
        disabled={saving}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        {saving ? 'Saving...' : 'Save Settings'}
      </button>
    </form>
  );
};

export default AffiliateSettings;
