"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ProductImage as ProductImageComponent } from "@/components"
import { currencyFormat } from "@/utils"
import { deleteProduct, getPaginatedProductsWithImages, getProductBySlug } from "@/actions"
import { Pagination, Title } from "@/components"
import { ProductForm } from "./ProductForm"
import type { Product, Category } from "@/interfaces/product.interface"

interface ProductWithImage extends Product {
  ProductImage: { url: string }[]
}

export default function ProductsSection() {
  const [products, setProducts] = useState<ProductWithImage[]>([])
  const [totalPages, setTotalPages] = useState(1)
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState<string | null>(null)
  const [editingProduct, setEditingProduct] = useState<Partial<ProductWithImage> | null>(null)
  const [categories, setCategories] = useState<Category[]>(["men", "women", "kid", "unisex"])
  const router = useRouter()

  useEffect(() => {
    fetchProducts(currentPage)
  }, [currentPage])

  const fetchProducts = async (page: number) => {
    const { products, totalPages } = await getPaginatedProductsWithImages({ page })
    setProducts(products as ProductWithImage[])
    setTotalPages(totalPages)
  }

  const handleDelete = async (productId: string) => {
    if (confirm("¿Estás seguro de que quieres eliminar este producto?")) {
      setLoading(productId)
      const response = await deleteProduct(productId)

      if (response.ok) {
        fetchProducts(currentPage)
      } else {
        alert(response.message || "Error al eliminar el producto")
      }

      setLoading(null)
    }
  }

  const handleEdit = async (slug: string) => {
    const product = await getProductBySlug(slug)
    setEditingProduct(product as ProductWithImage)
  }

  const handleNewProduct = () => {
    setEditingProduct({})
  }

  const handleFormClose = () => {
    setEditingProduct(null)
    fetchProducts(currentPage)
  }

  if (editingProduct !== null) {
    return <ProductForm product={editingProduct} categories={categories} onClose={handleFormClose} />
  }

  return (
    <>
      <Title title="Dashboard de productos" />
      <div className="flex justify-end mb-5">
        <button onClick={handleNewProduct} className="btn-primary">
          Nuevo producto
        </button>
      </div>

      <div className="mb-10">
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
              <th scope="col" className="text-sm font-medium text-gray-900 px-6 py-4 text-left"></th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="bg-white border-b transition duration-300 ease-in-out hover:bg-gray-100">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  <ProductImageComponent
                    src={product.images[0] || product.ProductImage[0]?.url}
                    width={80}
                    height={80}
                    alt={product.title}
                    className="w-20 h-20 object-cover rounded"
                  />
                </td>
                <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">{product.title}</td>
                <td className="text-sm font-bold text-gray-900 px-6 py-4 whitespace-nowrap">
                  {currencyFormat(product.price)}
                </td>
                <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">{product.gender}</td>
                <td className="text-sm text-gray-900 font-bold px-6 py-4 whitespace-nowrap">{product.inStock}</td>
                <td className="text-sm text-gray-900 font-bold px-6 py-4 whitespace-nowrap">
                  {product.sizes.join(", ")}
                </td>
                <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap text-center">
                  <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-2 rounded mr-2"
                    onClick={() => handleEdit(product.slug)}
                  >
                    Editar
                  </button>
                  <button
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-2 rounded"
                    onClick={() => handleDelete(product.id)}
                    disabled={loading === product.id}
                  >
                    {loading === product.id ? "Eliminando..." : "Eliminar"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <Pagination totalPages={totalPages} />
      </div>
    </>
  )
}

