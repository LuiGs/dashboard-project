"use client"

import Link from "next/link";
import { IoShirtOutline, IoTicketOutline, IoPeopleOutline } from "react-icons/io5";
import { getOrdersByUser,  getPaginatedOrders,  getTopSellingProducts, getRevenueByProduct} from "@/actions";
import { useState, useEffect, ReactNode } from "react";
import { $Enums } from "@prisma/client";

export default function AdminPage() {
  interface OrderAddress {
    firstName: string;
    lastName: string;
  }
  
  interface Order {
    id: string;
    OrderAddress: OrderAddress | null;
    subTotal: number;
    tax: number;
    total: number;
    itemsInOrder: number;
    isPaid: boolean;
    paidAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
    userId: string;
    transactionId: string | null;
    user: {
      email: string;
    };
  }
  
  interface ProductImage {
    id: number;
    url: string;
    productId: string;
  }
  
  interface TopProduct {
    revenue: number; // Puedes ajustarlo a `any` si es necesario
    salesCount: ReactNode;
    images: string[];
    ProductImage: ProductImage[];
    id: string;
    title: string;
    description: string;
    inStock: number;
    price: number;
    sizes: $Enums.Size[];
    slug: string;
    tags: string[];
    gender: $Enums.Gender;
    categoryId: string;
  }
  
  // Estado de las órdenes
  const [orders, setOrders] = useState<Order[]>([]);
  
  // Estado para los productos más vendidos
  const [topProductsData, setTopProductsData] = useState<TopProduct[]>([]);
  
  // Estado para los datos de ingresos por producto
  const [revenueData, setRevenueData] = useState<
    {
      title: ReactNode; id: string; revenue: number 
}[]
  >([]);
  
  // Estado para la sección seleccionada
  const [selectedSection, setSelectedSection] = useState("orders");
  
  // Efecto para cargar datos según la sección seleccionada
  useEffect(() => {
    // Obtener órdenes por usuario
    const fetchOrders = async () => {
      const response = await getPaginatedOrders();
      if (response.ok && response.orders) {
        setOrders(response.orders);
        console.log(response); // Asigna solo si `orders` no es undefined
      }
    };
  
    // Obtener productos más vendidos
    const fetchTopProducts = async () => {
      const topProductsData = await getTopSellingProducts();
      if (topProductsData) {
        const formattedTopProducts = topProductsData.map((product) => ({
          ...product,
          revenue: product.OrderItem.reduce(
            (acc, item) => acc + item.price * item.quantity,
            0
          ), // Calcula la recaudación
          salesCount: product.totalSold, // Asigna totalSold a salesCount
        }));
        setTopProductsData(formattedTopProducts);
        console.log(formattedTopProducts);
      }
    };
  
    // Obtener la cantidad recaudada por producto
    const fetchRevenueByProduct = async () => {
      const revenueData = await getRevenueByProduct();
      if (revenueData) {
        setRevenueData(revenueData);
        console.log(revenueData);
      }
    };
  
    // Lógica para cargar datos dependiendo de la sección seleccionada
    if (selectedSection === "orders") fetchOrders();
    if (selectedSection === "topProducts") fetchTopProducts();
    if (selectedSection === "revenue") fetchRevenueByProduct();
  }, [selectedSection]);
  // Nuevos estados para la paginación
    const itemsPerPage = 10; // Cambia esto según cuántos elementos quieras por página
    const [currentPage, setCurrentPage] = useState(1);

    // Calcular el número total de páginas para cada sección
    const totalPagesOrders = Math.ceil(orders.length / itemsPerPage);
    const totalPagesTopProducts = Math.ceil(topProductsData.length / itemsPerPage);
    const totalPagesRevenue = Math.ceil(revenueData.length / itemsPerPage);

    // Filtrar elementos para mostrar solo los de la página actual
    const paginatedOrders = orders.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );
    const paginatedTopProducts = topProductsData.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );
    const paginatedRevenue = revenueData.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );

    // Manejador de cambio de página
    const handlePageChange = (direction: "next" | "prev") => {
      setCurrentPage((prevPage) => {
        if (direction === "next") {
          if (
            (selectedSection === "orders" && prevPage < totalPagesOrders) ||
            (selectedSection === "topProducts" && prevPage < totalPagesTopProducts) ||
            (selectedSection === "revenue" && prevPage < totalPagesRevenue)
          ) {
            return prevPage + 1;
          }
        } else if (direction === "prev" && prevPage > 1) {
          return prevPage - 1;
        }
        return prevPage;
      });
    };
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold">Panel de Informes</h1>
        <div className="flex space-x-6 mt-6">
          <button
            onClick={() => {
              setSelectedSection("orders");
              setCurrentPage(1); // Reinicia a la primera página al cambiar de sección
            }}
            className="flex items-center p-2 hover:bg-gray-100 rounded transition-all"
          >
            <IoTicketOutline size={30} />
            <span className="ml-3 text-xl">Órdenes por Usuario</span>
          </button>
          <button
            onClick={() => {
              setSelectedSection("topProducts");
              setCurrentPage(1);
            }}
            className="flex items-center p-2 hover:bg-gray-100 rounded transition-all"
          >
            <IoShirtOutline size={30} />
            <span className="ml-3 text-xl">Productos Más Vendidos</span>
          </button>
          <button
            onClick={() => {
              setSelectedSection("revenue");
              setCurrentPage(1);
            }}
            className="flex items-center p-2 hover:bg-gray-100 rounded transition-all"
          >
            <IoPeopleOutline size={30} />
            <span className="ml-3 text-xl">Recaudación por Producto</span>
          </button>
        </div>
    
        <div className="mt-8 p-6 bg-white rounded-lg shadow-md">
          {selectedSection === "orders" && (
            <>
              <h2 className="text-xl font-semibold mb-4">Órdenes por Usuario</h2>
              <table className="w-full text-left border">
                <thead>
                  <tr>
                    <th className="p-2 border-b">Usuario</th>
                    <th className="p-2 border-b">ID Orden</th>
                    <th className="p-2 border-b">Fecha</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedOrders.map((order) => (
                    <tr key={order.id}>
                      <td className="p-2 border-b">{order.user.email}</td>
                      <td className="p-2 border-b">{order.id}</td>
                      <td className="p-2 border-b">{new Date(order.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}
    
          {selectedSection === "topProducts" && (
            <>
              <h2 className="text-xl font-semibold mb-4">Productos Más Vendidos</h2>
              <table className="w-full text-left border">
                <thead>
                  <tr>
                    <th className="p-2 border-b">Producto</th>
                    <th className="p-2 border-b">Ventas</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedTopProducts.map((product) => (
                    <tr key={product.id}>
                      <td className="p-2 border-b">{product.title}</td>
                      <td className="p-2 border-b">{product.salesCount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}
    
          {selectedSection === "revenue" && (
            <>
              <h2 className="text-xl font-semibold mb-4">Recaudación por Producto</h2>
              <table className="w-full text-left border">
                <thead>
                  <tr>
                    <th className="p-2 border-b">Producto</th>
                    <th className="p-2 border-b">Recaudación</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedRevenue.map((product) => (
                    <tr key={product.id}>
                      <td className="p-2 border-b">{product.title}</td>
                      <td className="p-2 border-b">{`$${product.revenue}`}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}
    
          {/* Paginación */}
          <div className="flex justify-between items-center mt-4">
            <button
              onClick={() => handlePageChange("prev")}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
            >
              Anterior
            </button>
            <span className="text-gray-600">
              Página {currentPage} de{" "}
              {selectedSection === "orders"
                ? totalPagesOrders
                : selectedSection === "topProducts"
                ? totalPagesTopProducts
                : totalPagesRevenue}
            </span>
            <button
              onClick={() => handlePageChange("next")}
              disabled={
                selectedSection === "orders"
                  ? currentPage >= totalPagesOrders
                  : selectedSection === "topProducts"
                  ? currentPage >= totalPagesTopProducts
                  : currentPage >= totalPagesRevenue
              }
              className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
            >
              Siguiente
            </button>
          </div>
        </div>
      </div>
    );
}