"use client";

import { useEffect, useState } from "react";
import { getPaginatedOrders } from "@/actions";
import { Pagination } from "@/components";
import { IoCardOutline } from "react-icons/io5";
import Link from "next/link";

export default function OrdersTable() {
  const [orders, setOrders] = useState<{ id: string; subTotal: number; tax: number; total: number; itemsInOrder: number; isPaid: boolean; paidAt: Date | null; createdAt: Date; updatedAt: Date; userId: string; transactionId: string | null; OrderAddress: { firstName: string; lastName: string; } | null; }[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    getPaginatedOrders().then(({ ok, orders }) => {
      if (ok && orders) setOrders(orders);
      setLoading(false);
    });
  }, []);

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Todas las órdenes</h2>

      {loading ? (
        <p>Cargando órdenes...</p>
      ) : (
        <table className="min-w-full bg-white shadow-md rounded-lg">
          <thead className="bg-gray-200 border-b">
            <tr>
              <th className="px-6 py-4 text-left">#ID</th>
              <th className="px-6 py-4 text-left">Nombre completo</th>
              <th className="px-6 py-4 text-left">Estado</th>
              <th className="px-6 py-4 text-left">Opciones</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-b hover:bg-gray-100">
                <td className="px-6 py-4">{order.id.split("-").at(-1)}</td>
                <td className="px-6 py-4">{order.OrderAddress?.firstName} {order.OrderAddress?.lastName}</td>
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
      )}

      <Pagination totalPages={1} />
    </div>
  );
}
