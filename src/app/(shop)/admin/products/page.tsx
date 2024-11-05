export const revalidate = 0;

import { getPaginatedProductsWithImages } from "@/actions";
import { Pagination, Title } from "@/components";
import { ProductsTable } from './ui/ProductsTable';
import Link from "next/link";

interface Props {
  searchParams: {
    page?: string;
  };
}

export default async function ProductsPage({ searchParams }: Props) {
  const page = searchParams.page ? parseInt(searchParams.page) : 1;

  const { products, totalPages } = await getPaginatedProductsWithImages({ page });

  return (
    <>
      <Title title="Dashboard de productos" />
      <div className="flex justify-end mb-5">
        <Link href="/admin/product/new" className="btn-primary">
          Nuevo producto
        </Link>
      </div>

      <div className="mb-10">
        <ProductsTable products={products} /> {/* Renderizamos la nueva tabla */}
        <Pagination totalPages={totalPages} />
      </div>
    </>
  );
}
