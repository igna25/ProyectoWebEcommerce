import { Product } from "@/lib/Entities/Product";
import ProductsRepository from "@/lib/Repositories/ProductsRepository";
import ProductsListAdmin from "@/app/ui/admin/ProductsListAdmin";
import Pagination from "@/app/ui/admin/Pagination";
import SearchBar from "@/app/ui/admin/SearchBar";
import { unstable_noStore as noStore } from "next/cache";
import { Fragment } from "react";

export default async function ActiveProductsPage({
  searchParams,
}: {
  searchParams?: {
    query?: string;
    page?: string;
  };
}) {
  noStore();

  const ITEMS_PER_PAGE = 6;
  const query = searchParams?.query || "";
  const currentPage = Number(searchParams?.page) || 1;
  const productsRepository = new ProductsRepository();
  let products: Product[] = [];
  let totalPages = 1;

  if (query.length > 0) {
    const result = await productsRepository.searchProductsByName(
      query,
      currentPage,
      ITEMS_PER_PAGE,
    );
    products = result.products;
    totalPages = Math.ceil(result.total / ITEMS_PER_PAGE);
  } else {
    const result = await productsRepository.getAllProductsPaginated(
      currentPage,
      ITEMS_PER_PAGE,
    );
    products = result.products;
    totalPages = Math.ceil(result.total / ITEMS_PER_PAGE);
  }

  return (
    <Fragment>
      <div className="container mx-auto px-4">
        <SearchBar />
        {products.length === 0 ? (
          <div className="h-screen flex items-center justify-center bg-gray-100">
            <div className="text-center text-gray-700">
              <p className="text-xl">
                Parece que no encontramos resultados para su búsqueda...
              </p>
            </div>
          </div>
        ) : (
          <div>
            <ProductsListAdmin products={products} />
            <Pagination
              totalPages={totalPages}
              currentPage={currentPage}
              query={query}
            />
          </div>
        )}
      </div>
    </Fragment>
  );
}
