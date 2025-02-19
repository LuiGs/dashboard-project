"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getPaginatedProductsWithImages } from "@/actions";
import { Pagination, ProductGrid, Title } from "@/components";
import type { Product } from "@/interfaces/product.interface";

export const revalidate = 60; // 60 seconds

interface Props {
  searchParams: {
    page?: string;
  };
}

interface ProductWithImage extends Product {
  ProductImage: { url: string }[];
}

export default function Home({ searchParams }: Props) {
  const page = searchParams.page ? Number.parseInt(searchParams.page) : 1;
  const [products, setProducts] = useState<ProductWithImage[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(page);
  const router = useRouter();

  useEffect(() => {
    const fetchProducts = async () => {
      const { products, totalPages } = await getPaginatedProductsWithImages({ page: currentPage });
      setProducts(products as ProductWithImage[]);
      setTotalPages(totalPages);
    };
    fetchProducts();
  }, [currentPage]);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    router.push(`/?page=${pageNumber}`);
  };

  return (
    <>
      <Title title="Tienda" subtitle="Todos los productos" className="mb-2" />

      <ProductGrid products={products} />

      <Pagination totalPages={totalPages} currentPage={currentPage} onPageChange={handlePageChange} />
    </>
  );
}
