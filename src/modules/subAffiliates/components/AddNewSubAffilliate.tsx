/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, ChangeEvent } from "react";
import { createSubAffiliateService } from "@/services/api";
import { IFormData } from "@/interfaces/interface";
import { FiUser, FiX, FiSave } from "react-icons/fi";
import { CgSpinner } from "react-icons/cg";

interface AddUserModalProps {
  show: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddNewSubAffilliate({ show, onClose, onSuccess }: AddUserModalProps) {
  const [formData, setFormData] = useState<IFormData>({
    name: "",
    email: "",
    code: "",
    password: "",
    confirmPassword: "",
    slug: ""
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const createNewSubAffiliate = async (e:any) => {
    e.preventDefault();
    setLoading(true);
    setError("");
  
    try {
      const data = await createSubAffiliateService(formData);
  
      if (data.success) {
        onSuccess();
        onClose();
        setFormData({ name: "", code: "",email: "", password: "",confirmPassword: "", slug: "" });
      }
    } catch (err:any) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };
  
  if (!show) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-50 transition-all duration-300">
      <div className="bg-white rounded-2xl border border-gray-200 w-full max-w-md shadow-xl overflow-hidden transform transition-all duration-300 scale-100">
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h3 className="text-xl font-semibold text-gray-800 flex items-center">
            <FiUser className="h-5 w-5 mr-2 text-blue-500" />
            Create a new Sub-Affiliate
          </h3>
          <button 
            onClick={onClose} 
            className="text-gray-500 hover:text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-full p-2 transition-colors duration-200"
            aria-label="Cerrar"
          >
            <FiX className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={createNewSubAffiliate} className="px-6 py-5 space-y-5">
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm flex items-center border border-red-200">
              {error}
            </div>
          )}

          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              name="name"
              className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2.5 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter name"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2.5 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              value={formData.email}
              onChange={handleChange}
              placeholder="example@email.com"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              name="password"
              className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2.5 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Slug</label>
            <input
              name="slug"
              className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2.5 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              value={formData.slug}
              onChange={handleChange}
              placeholder="your-slug-name"
              required
            />
          </div>

          <div className="flex justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="boton px-6 py-2.5 hover:bg-gray-100 transition-all duration-200 font-medium"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="boton-user px-6 py-2.5 transition-all duration-200 font-medium flex items-center justify-center"
            >
              {loading ? (
                <>
                  <CgSpinner className="animate-spin mr-2 h-4 w-4" />
                  Guardando...
                </>
              ) : (
                <>
                  <FiSave className="mr-2 h-4 w-4" />
                  Guardar
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}