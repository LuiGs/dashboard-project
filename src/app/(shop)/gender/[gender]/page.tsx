"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getPaginatedProductsWithImages } from "@/actions";
import { Pagination, ProductGrid, Title } from "@/components";
import { Gender } from "@prisma/client";
import type { Product } from "@/interfaces/product.interface";

export const revalidate = 60; // 60 segundos

interface Props {
  params: {
    gender: string;
  };
  searchParams: {
    page?: string;
  };
}

interface ProductWithImage extends Product {
  ProductImage: { url: string }[];
}

export default function GenderByPage({ params, searchParams }: Props) {
  const { gender } = params;
  const page = searchParams.page ? Number.parseInt(searchParams.page) : 1;
  const [products, setProducts] = useState<ProductWithImage[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(page);
  const router = useRouter();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { products, totalPages } = await getPaginatedProductsWithImages({
          page: currentPage,
          gender: gender as Gender,
        });
        setProducts(products as ProductWithImage[]);
        setTotalPages(totalPages);
      } catch (error) {
        console.error("Error al obtener productos:", error);
      }
    };
    fetchProducts();
  }, [currentPage, gender]);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    router.push(`/gender/${gender}?page=${pageNumber}`);
  };

  const labels: Record<Gender, string> = {
    men: "para hombres",
    women: "para mujeres",
    kid: "para niños",
    unisex: "para todos",
  };
  return (
    <>
      <Title title={`Artículos ${labels[gender as Gender] || ""}`} subtitle="Todos los productos" className="mb-2" />
      <ProductGrid products={products} />
      <Pagination totalPages={totalPages} currentPage={currentPage} onPageChange={handlePageChange} />
    </>
  );
}
