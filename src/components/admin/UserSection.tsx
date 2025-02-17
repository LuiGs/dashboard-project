"use client"

import { useState, useEffect } from "react"
import { Title } from "@/components"
import { getUserById, getPaginatedUsers, changeUserRole, deleteUser } from "@/actions"
import { Pagination } from "@/components"
import { UserForm } from "./UserForm"
import { FaEdit, FaTrash } from "react-icons/fa"
import type { User } from "@/interfaces/user.interface"

export default function UserSection() {
  const [users, setUsers] = useState<User[]>([])
  const [totalPages, setTotalPages] = useState(1)
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState<string | null>(null)
  const [editingUser, setEditingUser] = useState<Partial<User> | null>(null)

  useEffect(() => {
    fetchUsers()
  }, []) // Removed currentPage dependency

  const fetchUsers = async () => {
    const result = await getPaginatedUsers()
    if (result && "users" in result) {
      if (result.users) {
        setUsers(result.users)
      } else {
        setUsers([])
      }
      setTotalPages("totalPages" in result && typeof result.totalPages === "number" ? result.totalPages : 1)
    } else {
      console.error("Failed to fetch users")
    }
  }

  const handleDelete = async (userId: string) => {
    if (confirm("¿Estás seguro de que quieres eliminar este usuario?")) {
      setLoading(userId)
      const response = await deleteUser(userId)

      if (response.ok) {
        fetchUsers()
      } else {
        alert(response.message || "Error al eliminar el usuario")
      }

      setLoading(null)
    }
  }

  const handleEdit = async (userId: string) => {
    const user = await getUserById(userId)
    setEditingUser(user || {})
  }

  const handleNewUser = () => {
    setEditingUser({})
  }

  const handleFormClose = () => {
    setEditingUser(null)
    fetchUsers()
  }

  const handleRoleChange = async (userId: string, newRole: string) => {
    await changeUserRole(userId, newRole)
    fetchUsers()
  }

  if (editingUser !== null) {
    return (
      <>
        <Title title={editingUser.id ? "Editar usuario" : "Crear nuevo usuario"} />
        <UserForm user={editingUser} onClose={handleFormClose} />
      </>
    )
  }
  interface Props {
    totalPages: number;
    currentPage: number;
    setCurrentPage: (page: number) => void;
  }
  return (
    <>
      <Title title="Dashboard de usuarios" />
      <div className="flex justify-end mb-5">
        <button onClick={handleNewUser} className="btn-primary">
          Nuevo usuario
        </button>
      </div>

      <div className="mb-10">
        <table className="min-w-full">
          <thead className="bg-gray-200 border-b">
            <tr>
              <th scope="col" className="text-sm font-medium text-gray-900 px-6 py-4 text-left">
                Nombre
              </th>
              <th scope="col" className="text-sm font-medium text-gray-900 px-6 py-4 text-left">
                Email
              </th>
              <th scope="col" className="text-sm font-medium text-gray-900 px-6 py-4 text-left">
                Rol
              </th>
              <th scope="col" className="text-sm font-medium text-gray-900 px-6 py-4 text-left">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="bg-white border-b transition duration-300 ease-in-out hover:bg-gray-100">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.name}</td>
                <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">{user.email}</td>
                <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                  <select
                    value={user.role}
                    onChange={(e) => handleRoleChange(user.id, e.target.value)}
                    className="text-sm w-full p-2 text-gray-900"
                  >
                    <option value="admin">Admin</option>
                    <option value="user">User</option>
                  </select>
                </td>
                <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap text-center">
                  <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
                    onClick={() => handleEdit(user.id)}
                  >
                    <FaEdit />
                  </button>
                  <button
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                    onClick={() => handleDelete(user.id)}
                    disabled={loading === user.id}
                  >
                    {loading === user.id ? "..." : <FaTrash />}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <Pagination totalPages={totalPages} currentPage={currentPage} setCurrentPage={setCurrentPage} />
      </div>
    </>
  )
}

