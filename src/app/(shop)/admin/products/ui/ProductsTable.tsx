'use client';

import { deleteProduct } from '@/actions'; // Importa la función deleteProduct
import { ProductImage } from "@/components";
import { currencyFormat } from "@/utils";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Props {
  products: {
    id: string;
    title: string;
    slug: string;
    price: number;
    gender: string;
    inStock: number;
    sizes: string[];
    ProductImage: {
      url: string;
    }[];
  }[];
}

export const ProductsTable = ({ products }: Props) => {
  const router = useRouter(); // Inicializa el enrutador
  const [loading, setLoading] = useState<string | null>(null); // Estado para manejar la eliminación

  const handleDelete = async (productId: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      setLoading(productId); // Muestra el estado de carga para el producto que se está eliminando
      const response = await deleteProduct(productId); // Llama a la función deleteProduct

      if (response.ok) {
        // Refresca la página o la lista de productos tras eliminar
        window.location.reload(); // O actualiza el estado de productos si es necesario
      } else {
        alert(response.message || 'Error al eliminar el producto');
      }

      setLoading(null); // Restablece el estado de carga
    }
  };

  return (
    <table className="min-w-full">
      <thead className="bg-gray-200 border-b">
        <tr>
          <th scope="col" className="text-sm font-medium text-gray-900 px-6 py-4 text-left">
            Imagen
          </th>
          <th scope="col" className="text-sm font-medium text-gray-900 px-6 py-4 text-left">
            Titulo
          </th>
          <th scope="col" className="text-sm font-medium text-gray-900 px-6 py-4 text-left">
            Precio
          </th>
          <th scope="col" className="text-sm font-medium text-gray-900 px-6 py-4 text-left">
            Género
          </th>
          <th scope="col" className="text-sm font-medium text-gray-900 px-6 py-4 text-left">
            Inventario
          </th>
          <th scope="col" className="text-sm font-medium text-gray-900 px-6 py-4 text-left">
            Tallas
          </th>
          <th scope="col" className="text-sm font-medium text-gray-900 px-6 py-4 text-left">
            
          </th>
        </tr>
      </thead>
      <tbody>
        {products.map((product) => (
          <tr key={product.id} className="bg-white border-b transition duration-300 ease-in-out hover:bg-gray-100">
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
              <Link href={`/product/${product.slug}`}>
                <ProductImage
                  src={product.ProductImage[0]?.url}
                  width={80}
                  height={80}
                  alt={product.title}
                  className="w-20 h-20 object-cover rounded"
                />
              </Link>
            </td>
            <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
              <Link href={`/admin/product/${product.slug}`} className="hover:underline">
                {product.title}
              </Link>
            </td>
            <td className="text-sm font-bold text-gray-900 px-6 py-4 whitespace-nowrap">
              {currencyFormat(product.price)}
            </td>
            <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
              {product.gender}
            </td>
            <td className="text-sm text-gray-900 font-bold px-6 py-4 whitespace-nowrap">
              {product.inStock}
            </td>
            <td className="text-sm text-gray-900 font-bold px-6 py-4 whitespace-nowrap">
              {product.sizes.join(", ")}
            </td>
            <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap text-center">
            <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-2 rounded"
                onClick={() => router.push(`/admin/product/${product.slug}`)} 
              >
                Editar producto
              </button>
              <button
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-2 rounded"
                onClick={() => handleDelete(product.id)} // Llama a la función handleDelete
                disabled={loading === product.id} // Desactiva el botón mientras se está eliminando
              >
                {loading === product.id ? 'Eliminando...' : 'Eliminar producto'}
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
