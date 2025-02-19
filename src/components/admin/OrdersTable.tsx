"use client"

import { useEffect, useState } from "react"
import { getPaginatedOrders } from "@/actions"
import { Pagination } from "@/components"
import { IoCardOutline } from "react-icons/io5"
import Link from "next/link"

interface Order {
  id: string
  subTotal: number
  tax: number
  total: number
  itemsInOrder: number
  isPaid: boolean
  paidAt: Date | null
  createdAt: Date
  updatedAt: Date
  userId: string
  transactionId: string | null
  OrderAddress: {
    firstName: string
    lastName: string
  } | null
  user: {
    email: string
  }
}

export default function OrdersTable() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    fetchOrders(currentPage)
  }, [currentPage])

  const fetchOrders = async (page: number) => {
    setLoading(true)
    const result = await getPaginatedOrders(page)
    if (result.ok && result.orders) {
      setOrders(result.orders)
      setTotalPages(result.totalPages || 1)
    } else {
      console.error("Failed to fetch orders:", result.message)
      setOrders([])
    }
    setLoading(false)
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Todas las órdenes</h2>

      {loading ? (
        <p>Cargando órdenes...</p>
      ) : (
        <>
          <table className="min-w-full bg-white shadow-md rounded-lg">
            <thead className="bg-gray-200 border-b">
              <tr>
                <th className="px-6 py-4 text-left">#ID</th>
                <th className="px-6 py-4 text-left">Nombre completo</th>
                <th className="px-6 py-4 text-left">Email</th>
                <th className="px-6 py-4 text-left">Estado</th>
                <th className="px-6 py-4 text-left">Opciones</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-b hover:bg-gray-100">
                  <td className="px-6 py-4">{order.id.split("-").at(-1)}</td>
                  <td className="px-6 py-4">
                    {order.OrderAddress?.firstName} {order.OrderAddress?.lastName}
                  </td>
                  <td className="px-6 py-4">{order.user.email}</td>
                  <td className="px-6 py-4 flex items-center">
                    {order.isPaid ? (
                      <>
                        <IoCardOutline className="text-green-800" />
                        <span className="mx-2 text-green-800">Pagada</span>
                      </>
                    ) : (
                      <>
                        <IoCardOutline className="text-red-800" />
                        <span className="mx-2 text-red-800">No Pagada</span>
                      </>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <Link href={`/orders/${order.id}`} className="text-blue-600 hover:underline">
                      Ver orden
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {orders.length === 0 && <p className="text-center py-4">No se encontraron órdenes.</p>}
          <Pagination totalPages={totalPages} currentPage={currentPage} onPageChange={handlePageChange} />
        </>
      )}
    </div>
  )
}

