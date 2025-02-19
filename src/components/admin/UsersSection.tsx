"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { getPaginatedUsers, changeUserRole, deleteUser } from "@/actions"
import { Pagination, Title } from "@/components"
import type { User } from "@/interfaces"

export default function UsersSection() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState<string | null>(null)
  const [totalPages, setTotalPages] = useState(1)
  const [currentPage, setCurrentPage] = useState(1)
  const router = useRouter()

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    const { ok, users = [] } = await getPaginatedUsers()
    if (ok) {
      setUsers(users)
    } else {
      router.push("/auth/login")
    }
  }

  const handleRowClick = (userId: string) => {
    router.push(`/admin/user/${userId}`)
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

  const handleRoleChange = async (userId: string, newRole: string) => {
    await changeUserRole(userId, newRole)
    fetchUsers()
  }
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  return (
    <>
      <Title title="Dashboard de usuarios" />
      <div className="flex justify-end mb-5">
        <Link href="/admin/user/new" className="btn-primary">
          Nuevo Usuario
        </Link>
      </div>

      <div className="mb-10">
        <table className="min-w-full">
          <thead className="bg-gray-200 border-b">
            <tr>
              <th scope="col" className="text-sm font-medium text-gray-900 px-8 py-4 text-left">
                Email
              </th>
              <th scope="col" className="text-sm font-medium text-gray-900 px-8 py-4 text-left">
                Nombre completo
              </th>
              <th scope="col" className="text-sm font-medium text-gray-900 px-8 py-4 text-left">
                Rol
              </th>
              <th scope="col" className="text-sm font-medium text-gray-900 px-1 py-4 text-left"></th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="bg-white border-b transition duration-300 ease-in-out hover:bg-gray-100">
                <td
                  className="px-8 py-4 whitespace-nowrap text-sm font-medium text-gray-900 cursor-pointer"
                  onClick={() => handleRowClick(user.id)}
                >
                  {user.email}
                </td>
                <td className="text-sm text-gray-900 font-light px-8 py-4 whitespace-nowrap">{user.name}</td>
                <td className="text-sm text-gray-900 font-light px-8 py-4 whitespace-nowrap">
                  <select
                    value={user.role}
                    onChange={(e) => handleRoleChange(user.id, e.target.value)}
                    className="text-sm w-full p-2 text-gray-900"
                  >
                    <option value="admin">Admin</option>
                    <option value="user">User</option>
                  </select>
                </td>
                <td className="text-sm text-gray-900 font-light px-1 py-4 whitespace-nowrap text-center">
                  <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-2 rounded mr-2"
                    onClick={() => router.push(`/admin/user/${user.id}`)}
                  >
                    Editar
                  </button>
                  <button
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-2 rounded"
                    onClick={() => handleDelete(user.id)}
                    disabled={loading === user.id}
                  >
                    {loading === user.id ? "Eliminando..." : "Eliminar"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <Pagination totalPages={totalPages} currentPage={currentPage} onPageChange={handlePageChange} />
      </div>
    </>
  )
}

