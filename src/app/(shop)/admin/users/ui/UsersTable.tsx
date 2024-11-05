'use client';

import { changeUserRole } from '@/actions';
import { deleteUser } from '@/actions'; // Importa la función deleteUser
import type { User } from '@/interfaces';
import { useRouter } from 'next/navigation'; // Importa useRouter
import { useState } from 'react';

interface Props {
  users: User[];
}

export const UsersTable = ({ users }: Props) => {
  const router = useRouter(); // Inicializa el enrutador
  const [loading, setLoading] = useState<string | null>(null); // Estado para manejar la eliminación

  const handleRowClick = (userId: string) => {
    // Redirige a la página del usuario
    router.push(`/admin/user/${userId}`);
  };

  const handleDelete = async (userId: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
      setLoading(userId); // Muestra el estado de carga para el usuario que se está eliminando
      const response = await deleteUser(userId); // Llama a la función deleteUser

      if (response.ok) {
        // Refresca la página o la lista de usuarios tras eliminar
        window.location.reload(); // O actualiza el estado de usuarios si es necesario
      } else {
        alert(response.message || 'Error al eliminar el usuario');
      }

      setLoading(null); // Restablece el estado de carga
    }
  };

  return (
    <table className="min-w-full">
      <thead className="bg-gray-200 border-b">
        <tr>
          <th
            scope="col"
            className="text-sm font-medium text-gray-900 px-8 py-4 text-left"
          >
            Email
          </th>
          <th
            scope="col"
            className="text-sm font-medium text-gray-900 px-8 py-4 text-left"
          >
            Nombre completo
          </th>
          <th
            scope="col"
            className="text-sm font-medium text-gray-900 px-8 py-4 text-left"
          >
            Rol
          </th>
          <th
            scope="col"
            className="text-sm font-medium text-gray-900 px-1 py-4 text-left"
          >
          </th>
        </tr>
      </thead>
      <tbody>
        {users.map((user) => (
          <tr
            key={user.id}
            className="bg-white border-b transition duration-300 ease-in-out hover:bg-gray-100"
          >
            <td
              className="px-8 py-4 whitespace-nowrap text-sm font-medium text-gray-900 cursor-pointer"
              onClick={() => handleRowClick(user.id)} // Maneja el clic en la fila
            >
              {user.email}
            </td>
            <td className="text-sm text-gray-900 font-light px-8 py-4 whitespace-nowrap">
              {user.name}
            </td>
            <td className="text-sm text-gray-900 font-light px-8 py-4 whitespace-nowrap">
              <select 
                value={user.role}
                onChange={e => changeUserRole(user.id, e.target.value)}
                className="text-sm w-full p-2 text-gray-900"
              >
                <option value="admin">Admin</option>
                <option value="user">User</option>
              </select>
            </td>
            <td className="text-sm text-gray-900 font-light px-1 py-4 whitespace-nowrap text-center">
            <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-2 rounded"
                onClick={() => router.push(`/admin/user/${user.id}`)} 
              >
                Editar usuario
              </button>
              <button
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-2 rounded"
                onClick={() => handleDelete(user.id)} // Llama a la función handleDelete
                disabled={loading === user.id} // Desactiva el botón mientras se está eliminando
              >
                {loading === user.id ? 'Eliminando...' : 'Eliminar usuario'}
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
