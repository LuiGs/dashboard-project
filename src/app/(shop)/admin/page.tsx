"use client"

import { useState } from "react"
import OrdersTable from "@/components/admin/OrdersTable"
import ProductsSection from "@/components/admin/ProductsSection"
import UserSection from "@/components/admin/UserSection"
import { IoPeopleOutline, IoShirtOutline, IoTicketOutline, IoBarChart } from "react-icons/io5"

export default function AdminPage() {
  const [section, setSection] = useState("dashboard")

  const renderContent = () => {
    switch (section) {
      case "orders":
        return <OrdersTable />
      case "products":
        return <ProductsSection />
      case "users":
        return <UserSection />
      case "reports":
        return <p>Informes y estadísticas aquí.</p>
      default:
        return <p>Bienvenido/a al Panel de Administración.</p>
    }
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <aside className="w-64 bg-blue-800 text-white p-6">
        <h2 className="text-2xl font-bold mb-8">Panel de Administración</h2>
        <nav className="space-y-6">
          <button
            onClick={() => setSection("products")}
            className="flex items-center w-full p-3 rounded-md hover:bg-blue-700"
          >
            <IoShirtOutline size={24} />
            <span className="ml-4 text-lg">Productos</span>
          </button>
          <button
            onClick={() => setSection("orders")}
            className="flex items-center w-full p-3 rounded-md hover:bg-blue-700"
          >
            <IoTicketOutline size={24} />
            <span className="ml-4 text-lg">Órdenes</span>
          </button>
          <button
            onClick={() => setSection("users")}
            className="flex items-center w-full p-3 rounded-md hover:bg-blue-700"
          >
            <IoPeopleOutline size={24} />
            <span className="ml-4 text-lg">Usuarios</span>
          </button>
          <button
            onClick={() => setSection("reports")}
            className="flex items-center w-full p-3 rounded-md hover:bg-blue-700"
          >
            <IoBarChart size={24} />
            <span className="ml-4 text-lg">Informes</span>
          </button>
        </nav>
      </aside>

      <main className="flex-1 p-8">
        <h1 className="text-3xl font-bold mb-6">{section.toUpperCase()}</h1>
        <div className="mt-8 p-6 bg-white rounded-lg shadow-md">{renderContent()}</div>
      </main>
    </div>
  )
}

