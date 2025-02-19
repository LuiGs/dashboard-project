"use client"

import { useState } from "react"
import OrdersTable from "@/components/admin/OrdersTable"
import ProductsSection from "@/components/admin/ProductsSection"
import UserSection from "@/components/admin/UserSection"
import { IoPeopleOutline, IoShirtOutline, IoTicketOutline, IoBarChart, IoStatsChart } from "react-icons/io5" // Importa el icono de estadísticas

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
      case "statistics": // Nuevo caso para el dashboard de estadísticas
        return <p>Dashboard de estadísticas aquí.</p> // Reemplaza con tu componente
      default:
        return <p>Dashboard de estadísticas aquí.</p>
    }
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <aside className="w-64 bg-gray-800 text-white p-6"> {/* Cambia el color de fondo a gris oscuro */}
        <h1 className="flex items-center w-full p-3 rounded-md" >Panel de Administrador</h1>
        <nav className="space-y-4"> {/* Reduce el espacio entre los botones */}
          <button
            onClick={() => setSection("statistics")}
            className={`flex items-center w-full p-3 rounded-md hover:bg-gray-700 transition duration-300 ${section === "statistics" ? "bg-gray-700" : ""}`} // Estilo activo
          >
            <IoBarChart size={24} className="mr-2" /> {/* Añade margen al icono */}
            <span className="text-lg">Inicio</span>
          </button>
          <button
            onClick={() => setSection("products")}
            className={`flex items-center w-full p-3 rounded-md hover:bg-gray-700 transition duration-300 ${section === "products" ? "bg-gray-700" : ""}`} // Estilo activo
          >
            <IoShirtOutline size={24} className="mr-2" /> {/* Añade margen al icono */}
            <span className="text-lg">Productos</span>
          </button>
          <button
            onClick={() => setSection("orders")}
            className={`flex items-center w-full p-3 rounded-md hover:bg-gray-700 transition duration-300 ${section === "orders" ? "bg-gray-700" : ""}`} // Estilo activo
          >
            <IoTicketOutline size={24} className="mr-2" />
            <span className="text-lg">Órdenes</span>
          </button>
          <button
            onClick={() => setSection("users")}
            className={`flex items-center w-full p-3 rounded-md hover:bg-gray-700 transition duration-300 ${section === "users" ? "bg-gray-700" : ""}`} // Estilo activo
          >
            <IoPeopleOutline size={24} className="mr-2" />
            <span className="text-lg">Usuarios</span>
          </button>
        </nav>
      </aside>

      <main className="flex-1 p-8 bg-gray-50"> {/* Cambia el color de fondo del main */}
        <div className="mt-0 p-6 bg-white rounded-lg shadow-md min-h-[calc(100vh-160px)]"> {/* Altura mínima para evitar que el footer se superponga */}
        {renderContent()}
        </div>
      </main>
    </div>
  )
}