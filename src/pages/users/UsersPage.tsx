/* eslint-disable @typescript-eslint/no-explicit-any */
// src/pages/users/UsersPage.tsx
import React, { useEffect, useState } from 'react';
import { User } from '@/interfaces/User';
import { http } from '@/core/utils/http_request';
import UsersTable from './UsersTable';
import UserForm from './UserForm';

const UsersPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Control de formulario:
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [showForm, setShowForm] = useState<boolean>(false);

  // Traer listado al montar:
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await http.get('users');
      if (res.data.success) {
        setUsers(res.data.data);
      } else {
        setError('Failed to fetch users');
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Error fetching users');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingUser(null);
    setShowForm(true);
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await http.delete(`users/${id}`);
      // refrescar lista
      fetchUsers();
    } catch (err) {
      console.error(err);
      alert('Error deleting user');
    }
  };

  const handleFormSubmit = async (payload: {
    id?: number;
    name: string;
    email: string;
    password?: string;
    rol: number;
    status: boolean;
  }) => {
    try {
      if (payload.id) {
        // Editar
        await http.put(`users/${payload.id}`, payload);
      } else {
        // Crear
        await http.post('users', payload);
      }
      setShowForm(false);
      fetchUsers();
    } catch (err: any) {
      console.error(err);
      throw new Error(err.response?.data?.message || 'Error saving user');
    }
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingUser(null);
  };

  return (
    <div className="max-w-9xl mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">User Management</h1>
        <button
          onClick={handleCreate}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition"
        >
          + New User
        </button>
      </div>

      {loading && <p className="text-gray-600">Loading users…</p>}
      {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>}

      {showForm && (
        <UserForm
          initialData={editingUser || undefined}
          onSubmit={handleFormSubmit}
          onCancel={handleCancelForm}
        />
      )}

      {!loading && (
        <UsersTable data={users} onEdit={handleEdit} onDelete={handleDelete} />
      )}

    </div>
  );
};

export default UsersPage;
