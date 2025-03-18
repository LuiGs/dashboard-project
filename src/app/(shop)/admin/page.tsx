"use client"

import { useState } from "react"
import OrdersTable from "@/components/admin/OrdersTable"
import ProductsSection from "@/components/admin/ProductsSection"
import UserSection from "@/components/admin/UserSection"
import StatisticsSection from "@/components/admin/StatisticsSection" // Importa el componente de estadísticas
import DiscountsSection from "@/components/admin/DiscountsSection"
import { IoPeopleOutline, IoShirtOutline, IoTicketOutline, IoBarChartOutline , IoPricetagsOutline    } from "react-icons/io5" // Importa el icono de estadísticas

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
      case "statistics":
        return <StatisticsSection />
      case "Descuentos":
        return <DiscountsSection />
      default:
        return <StatisticsSection />
    }
  }

  return (
    <div className="flex min-h-screen bg-gray-100 m-0 p-0"> {/* Añade m-0 p-0 para eliminar márgenes y padding */}
      <aside className="w-64 bg-gray-900 text-white p-6 fixed h-full top-16"> {/* Añade left-0 para que se pegue al borde izquierdo */}
        <h1 className="flex items-center w-full p-3 rounded-md">Panel de Administrador</h1>
        <nav className="space-y-4">
          <button
            onClick={() => setSection("statistics")}
            className={`flex items-center w-full p-3 rounded-md hover:bg-gray-700 transition duration-300 ${
              section === "statistics" ? "bg-gray-700" : ""
            }`}
          >
            <IoBarChartOutline size={24} className="mr-2" />
            <span className="text-lg">Inicio</span>
          </button>
          <button
            onClick={() => setSection("products")}
            className={`flex items-center w-full p-3 rounded-md hover:bg-gray-700 transition duration-300 ${
              section === "products" ? "bg-gray-700" : ""
            }`}
          >
            <IoShirtOutline size={24} className="mr-2" />
            <span className="text-lg">Productos</span>
          </button>
          <button
            onClick={() => setSection("orders")}
            className={`flex items-center w-full p-3 rounded-md hover:bg-gray-700 transition duration-300 ${
              section === "orders" ? "bg-gray-700" : ""
            }`}
          >
            <IoTicketOutline size={24} className="mr-2" />
            <span className="text-lg">Órdenes</span>
          </button>
          <button
            onClick={() => setSection("users")}
            className={`flex items-center w-full p-3 rounded-md hover:bg-gray-700 transition duration-300 ${
              section === "users" ? "bg-gray-700" : ""
            }`}
          >
            <IoPeopleOutline size={24} className="mr-2" />
            <span className="text-lg">Usuarios</span>
          </button>
          <button
            onClick={() => setSection("Descuentos")}
            className={`flex items-center w-full p-3 rounded-md hover:bg-gray-700 transition duration-300 ${
              section === "Descuentos" ? "bg-gray-700" : ""
            }`}
          >
            <IoPricetagsOutline size={24} className="mr-2" />
            <span className="text-lg">Descuentos</span>
          </button>
        </nav>
      </aside>

      <main className="flex-1 p-8 bg-gray-50 ml-64">
        <div className="mt-0 p-6 bg-white rounded-lg shadow-md min-h-[calc(100vh-160px)]">
          {renderContent()}
        </div>
      </main>
    </div>
  )
}
