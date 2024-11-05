import Link from "next/link";
import {
  IoCloseOutline,
  IoPeopleOutline,
  IoShirtOutline,
  IoTicketOutline,
  IoAnalyticsOutline,
} from "react-icons/io5";

export default function AdminPage() {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar de navegación */}
      <aside className="w-64 bg-blue-800 text-white p-6">
        <h2 className="text-2xl font-bold mb-8">Panel de Administración</h2>
        
        {/* Opciones de navegación */}
        <nav className="space-y-6">
          <Link
            href="/admin/products"
            className="flex items-center p-3 rounded-md transition-colors hover:bg-blue-700"
          >
            <IoShirtOutline size={24} />
            <span className="ml-4 text-lg">Productos</span>
          </Link>

          <Link
            href="/admin/orders"
            className="flex items-center p-3 rounded-md transition-colors hover:bg-blue-700"
          >
            <IoTicketOutline size={24} />
            <span className="ml-4 text-lg">Órdenes</span>
          </Link>

          <Link
            href="/admin/users"
            className="flex items-center p-3 rounded-md transition-colors hover:bg-blue-700"
          >
            <IoPeopleOutline size={24} />
            <span className="ml-4 text-lg">Usuarios</span>
          </Link>

          <Link
            href="/admin/reports"
            className="flex items-center p-3 rounded-md transition-colors hover:bg-blue-700"
          >
            <IoAnalyticsOutline size={24} />
            <span className="ml-4 text-lg">Informes</span>
          </Link>
        </nav>
      </aside>

      {/* Contenido principal */}
      <main className="flex-1 p-8">
        <h1 className="text-3xl font-bold mb-6">Bienvenido/a al Panel de Administración</h1>
        <p className="text-gray-700">
          GRAFICAS PARA EXAMEN FINAL.
        </p>
        
        {/* Contenido dinámico */}
        <div className="mt-8 p-6 bg-white rounded-lg shadow-md">
          <p>TEXTO DE EJEMPLO.</p>
          {/* Puedes cambiar este mensaje según la sección que el usuario seleccione */}
        </div>
      </main>
    </div>
  );
}
