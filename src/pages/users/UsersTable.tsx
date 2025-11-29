// src/components/users/UsersTable.tsx
import React from 'react';
import { User } from '@/interfaces/User';
import { FiEdit, FiTrash2 } from 'react-icons/fi';

interface Props {
  data: User[];
  onEdit: (user: User) => void;
  onDelete: (id: number) => void;
}

const UsersTable: React.FC<Props> = ({ data, onEdit, onDelete }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">
              ID
            </th>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">
              Name
            </th>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">
              Email
            </th>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">
              Role
            </th>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">
              Status
            </th>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">
              Created At
            </th>
            <th className="px-4 py-2 text-right text-sm font-medium text-gray-700 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {data.map((user) => (
            <tr key={user.id}>
              <td className="px-4 py-2 text-sm text-gray-800">{user.id}</td>
              <td className="px-4 py-2 text-sm text-gray-800">{user.name}</td>
              <td className="px-4 py-2 text-sm text-gray-800">{user.email}</td>
              <td className="px-4 py-2 text-sm text-gray-800">
                {user.rol === 1
                  ? 'Admin'
                  : user.rol === 2
                  ? 'Affiliate'
                  : 'Sub-Affiliate'}
              </td>
              <td className="px-4 py-2 text-sm">
                {user.status ? (
                  <span className="text-green-600">Active</span>
                ) : (
                  <span className="text-red-600">Inactive</span>
                )}
              </td>
              <td className="px-4 py-2 text-sm text-gray-800">
                {new Date(user.createdAt).toLocaleDateString()}
              </td>
              <td className="px-4 py-2 text-sm text-right space-x-2">
                <button
                  onClick={() => onEdit(user)}
                  className="text-blue-600 hover:text-blue-800"
                  title="Edit"
                >
                  <FiEdit />
                </button>
                <button
                  onClick={() => onDelete(user.id)}
                  className="text-red-600 hover:text-red-800"
                  title="Delete"
                >
                  <FiTrash2 />
                </button>
              </td>
            </tr>
          ))}
          {data.length === 0 && (
            <tr>
              <td
                colSpan={7}
                className="px-4 py-4 text-center text-gray-500 text-sm"
              >
                No users found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default UsersTable;
