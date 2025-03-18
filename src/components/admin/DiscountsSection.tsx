"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Title, Pagination } from "@/components"
import { getPaginatedDiscountCodes, getDiscountCodeById, deleteDiscountCode } from "@/actions/discountcodes"
import { DiscountCodeForm } from "@/components/admin/DiscountCodeForm"
import { FaEdit, FaTrash } from "react-icons/fa"
import type { DiscountCode } from "@/interfaces"

interface DiscountCodeWithDetails extends DiscountCode {
  products: { title: string }[]
}

export default function DiscountsSection() {
  const [discountCodes, setDiscountCodes] = useState<DiscountCodeWithDetails[]>([])
  const [totalPages, setTotalPages] = useState(1)
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState<string | null>(null)
  const [editingDiscountCode, setEditingDiscountCode] = useState<Partial<DiscountCodeWithDetails> | null>(null)
  const router = useRouter()

  useEffect(() => {
    fetchDiscountCodes(currentPage)
  }, [currentPage])

  const fetchDiscountCodes = async (page: number) => {
    const { discountCodes, totalPages } = await getPaginatedDiscountCodes({ page })
    setDiscountCodes(discountCodes as DiscountCodeWithDetails[])
    setTotalPages(totalPages)
  }

  const handleDelete = async (discountCodeId: string) => {
    if (confirm("¿Estás seguro de que quieres eliminar este código de descuento?")) {
      setLoading(discountCodeId)
      const response = await deleteDiscountCode(discountCodeId)

      if (response) {
        fetchDiscountCodes(currentPage)
      } else {
        alert("Error al eliminar el código de descuento")
      }

      setLoading(null)
    }
  }

  const handleEdit = async (id: string) => {
    const discountCode = await getDiscountCodeById(id)
    setEditingDiscountCode({
      ...discountCode,
      expiresAt: discountCode.expiresAt ? new Date(discountCode.expiresAt).toISOString().slice(0, 16) : undefined,
    } as DiscountCodeWithDetails)
  }

  const handleNewDiscountCode = () => {
    setEditingDiscountCode({})
  }

  const handleFormClose = () => {
    setEditingDiscountCode(null)
    fetchDiscountCodes(currentPage)
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  if (editingDiscountCode !== null) {
    return <DiscountCodeForm discountCode={editingDiscountCode} onClose={handleFormClose} products={[]} />
  }

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <Title title="Lista de códigos de descuento" />
        <Button onClick={handleNewDiscountCode} className="btn-primary">
          Agregar código de descuento
        </Button>
      </div>
      <div className="mb-10">
        <table className="min-w-full">
          <thead className="bg-gray-200 border-b">
            <tr>
              <th scope="col" className="text-sm font-medium text-gray-900 px-6 py-4 text-left">
                Código
              </th>
              <th scope="col" className="text-sm font-medium text-gray-900 px-6 py-4 text-left">
                Descuento
              </th>
              <th scope="col" className="text-sm font-medium text-gray-900 px-6 py-4 text-left">
                Expira
              </th>
              <th scope="col" className="text-sm font-medium text-gray-900 px-6 py-4 text-left">
                Usos restantes
              </th>
              <th scope="col" className="text-sm font-medium text-gray-900 px-6 py-4 text-left">
                Productos
              </th>
              <th scope="col" className="text-sm font-medium text-gray-900 px-6 py-4 text-left">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody>
            {discountCodes.map((discountCode) => (
              <tr key={discountCode.id} className="bg-white border-b transition duration-300 ease-in-out hover:bg-gray-100">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{discountCode.code}</td>
                <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">{discountCode.discountAmount}</td>
                <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">{discountCode.expiresAt?.toLocaleString()}</td>
                <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">{(discountCode.limit ?? 0) - discountCode.uses}</td>
                <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">{discountCode.products.map(p => p.title).join(", ")}</td>
                <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap text-center">
                  <button
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-2 rounded"
                    onClick={() => handleDelete(discountCode.id)}
                    disabled={loading === discountCode.id}
                  >
                    {loading === discountCode.id ? "Eliminando..." : <FaTrash />}
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