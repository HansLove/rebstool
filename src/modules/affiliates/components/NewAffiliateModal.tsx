/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, ChangeEvent, FormEvent } from "react";
import { createAffiliateService } from "@/services/api";
import { FiUser, FiX, FiSave, FiKey } from "react-icons/fi";
import { CgSpinner } from "react-icons/cg";

interface NewAffiliateModalProps {
  show: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function NewAffiliateModal({ show, onClose, onSuccess }: NewAffiliateModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    slug: "",
    login_ce: "",
    password_ce: "",
    url_base: ""
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const createNewAffilliate = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const data = await createAffiliateService(formData);

      if (data.success) {
        onSuccess();
        onClose();
        setFormData({
          name: "",
          email: "",
          password: "",
          slug: "",
          login_ce: "",
          password_ce: "",
          url_base: ""
        });
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "An error occurred while creating the affiliate.");
    } finally {
      setLoading(false);
    }
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="bg-white rounded-2xl border border-gray-200 w-full max-w-md shadow-xl overflow-hidden">
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
            <FiUser className="h-5 w-5 text-blue-500" />
            Create New Affiliate
          </h2>
          <button 
            onClick={onClose} 
            className="text-gray-500 hover:text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-full p-2 transition-colors duration-200"
          >
            <FiX className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6">
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm flex items-center border border-red-200">
              {error}
            </div>
          )}

          <form onSubmit={createNewAffilliate} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2.5 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                placeholder="John Doe"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2.5 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                placeholder="john@example.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2.5 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                placeholder="••••••••"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Slug (username)</label>
              <input
                name="slug"
                value={formData.slug}
                onChange={handleChange}
                className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2.5 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                placeholder="john-affiliate"
                required
              />
            </div>

            <div className="border-t border-gray-200 pt-4">
              <h3 className="text-sm font-semibold mb-3 text-gray-700 flex items-center gap-2">
                <span className="bg-blue-100 text-blue-600 p-1 rounded-lg">
                  <FiKey className="h-4 w-4" />
                </span>
                Cellxpert Credentials
              </h3>

              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">Login</label>
                <input
                  name="login_ce"
                  value={formData.login_ce}
                  onChange={handleChange}
                  className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2.5 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  placeholder="Cellxpert login"
                  required
                />
              </div>

              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input
                  type="password"
                  name="password_ce"
                  value={formData.password_ce}
                  onChange={handleChange}
                  className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2.5 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  placeholder="Cellxpert password"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Base URL</label>
                <input
                  name="url_base"
                  value={formData.url_base}
                  onChange={handleChange}
                  className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2.5 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  placeholder="https://example.cellxpert.com"
                  required
                />
              </div>
            </div>

            <div className="flex justify-center gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="boton px-6 py-2.5 hover:bg-gray-100 transition-all duration-200 font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="boton-user px-6 py-2.5 transition-all duration-200 font-medium flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <CgSpinner className="animate-spin mr-2 h-4 w-4" />
                    Creating...
                  </>
                ) : (
                  <>
                    <FiSave className="mr-2 h-4 w-4" />
                    Create Affiliate
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}