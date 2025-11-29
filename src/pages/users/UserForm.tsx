/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/users/UserForm.tsx
import React, { FC, useState, useEffect } from 'react';
import { User } from '@/interfaces/User';
import { FiUser, FiMail, FiLock, FiSave, FiCheckCircle} from 'react-icons/fi';

interface Props {
  initialData?: Partial<User>;
  onSubmit: (payload: {
    id?: number;
    name: string;
    email: string;
    password?: string;
    rol: number;
    status: boolean;
  }) => Promise<void>;
  onCancel: () => void;
}

const UserForm: FC<Props> = ({ initialData = {}, onSubmit, onCancel }) => {
  const [name, setName] = useState(initialData.name || '');
  const [email, setEmail] = useState(initialData.email || '');
  const [password, setPassword] = useState('');
  const [rol, setRol] = useState<number>(initialData.rol ?? 3);
  const [status, setStatus] = useState<boolean>(initialData.status ?? true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    // Si inicializamos con datos distintos
    setName(initialData.name || '');
    setEmail(initialData.email || '');
    setRol(initialData.rol ?? 3);
    setStatus(initialData.status ?? true);
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim() || !email.trim()) {
      setError('Name and email are required.');
      return;
    }

    setSaving(true);
    try {
      await onSubmit({
        id: initialData.id,
        name: name.trim(),
        email: email.trim(),
        password: password || undefined, // solo si se ingresó
        rol,
        status,
      });
    } catch (err: any) {
      setError(err.message || 'An error occurred.');
    } finally {
      setSaving(false);
    }
  };

  return (
  //   <div className="max-w-md w-full bg-white p-6 rounded-lg shadow-lg fixed  inset-1">
  <div className="fixed inset-0 m-auto max-w-md w-full h-fit bg-white p-6 rounded-lg shadow-lg">

      <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
        {initialData.id ? (
          <>
            <FiCheckCircle className="text-green-500" /> Edit User #{initialData.id}
          </>
        ) : (
          <>
            <FiSave className="text-blue-500" /> Create New User
          </>
        )}
      </h3>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <div className="space-y-1">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
          <div className="flex items-center border border-gray-300 rounded px-3 py-2 focus-within:ring-2 focus-within:ring-indigo-500">
            <FiUser className="text-gray-400 mr-2" />
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="flex-1 bg-transparent focus:outline-none text-gray-900"
              placeholder="Full Name"
              required
            />
          </div>
        </div>

        {/* Email */}
        <div className="space-y-1">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
          <div className="flex items-center border border-gray-300 rounded px-3 py-2 focus-within:ring-2 focus-within:ring-indigo-500">
            <FiMail className="text-gray-400 mr-2" />
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 bg-transparent focus:outline-none text-gray-900"
              placeholder="user@example.com"
              required
            />
          </div>
        </div>

        {/* Password (solo para crear o cambiar) */}
        <div className="space-y-1">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            {initialData.id ? 'New Password (leave blank to keep)' : 'Password'}
          </label>
          <div className="flex items-center border border-gray-300 rounded px-3 py-2 focus-within:ring-2 focus-within:ring-indigo-500">
            <FiLock className="text-gray-400 mr-2" />
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="flex-1 bg-transparent focus:outline-none text-gray-900"
              placeholder={initialData.id ? '•••••••• (unchanged)' : 'Choose a password'}
              autoComplete="new-password"
              {...(!initialData.id && { required: true })}
            />
          </div>
        </div>

        {/* Rol */}
        <div className="space-y-1">
          <label htmlFor="rol" className="block text-sm font-medium text-gray-700">Role</label>
          <select
            id="rol"
            value={rol}
            onChange={(e) => setRol(Number(e.target.value))}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-indigo-500 bg-white text-gray-900"
          >
            <option value={1}>Admin</option>
            <option value={2}>Affiliate</option>
            <option value={3}>Sub-Affiliate</option>
          </select>
        </div>

        {/* Status */}
        <div className="flex items-center space-x-2">
          <input
            id="status"
            type="checkbox"
            checked={status}
            onChange={(e) => setStatus(e.target.checked)}
            className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
          />
          <label htmlFor="status" className="text-sm text-gray-700">
            Active
          </label>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700 transition"
            disabled={saving}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition disabled:opacity-50 flex items-center"
          >
            {saving ? 'Saving…' : 'Save'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserForm;
