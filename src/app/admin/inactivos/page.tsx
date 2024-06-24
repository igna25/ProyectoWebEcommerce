import ProductsRepository from "../../lib/Repositories/ProductsRepository";
import ProductCard from "../../ui/admin/productCard";
import { unstable_noStore as noStore } from 'next/cache';
import SearchBar from "../../ui/admin/searchBar";
import { Product } from "../../lib/Entities/Product";
import Pagination from "../../ui/admin/Pagination";
import { Fragment } from "react";
import Link from "next/link";
import ActivateButton from "@/app/ui/admin/ActivateButton";

export default async function LoginPage({
  searchParams,
}: {
  searchParams?: {
    query?: string;
    page?: string;
  };
}) {
  noStore();

  const ITEMS_PER_PAGE= 6

  const query = searchParams?.query || '';
  const currentPage = Number(searchParams?.page) || 1;
  const productsRepository = new ProductsRepository();
  let products: Product[] = [];
  let totalPages = 1;

  if (query.length > 0) {
    const result = await productsRepository.searchProductsByName(query, currentPage, ITEMS_PER_PAGE,false);
    products = result.products;
    totalPages = Math.ceil(result.total / ITEMS_PER_PAGE)
  } else {
    const result = await productsRepository.getAllProductsPaginated(currentPage, ITEMS_PER_PAGE, false);
    products = result.products;
    totalPages = Math.ceil(result.total / ITEMS_PER_PAGE)
  }

  return (
    <Fragment>
      <div className="container mx-auto px-4">
        <SearchBar />
        {products.length === 0 ? (
          <div className="h-screen flex items-center justify-center bg-gray-100">
          <div className="text-center text-gray-700">
              <p className="text-xl">parece que no encontramos resultados para su búsqueda..</p>
          </div>
      </div>
        ) : (
          <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
              {products.map((product) => (
                <ProductCard key={product.id} product={product}>
                  <Link href={"/admin/activos/"+product.id}>
                    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full">
                      Modificar
                    </button>
                  </Link>
                  <ActivateButton data={{id:product.id}}></ActivateButton>
                </ProductCard>
              ))}
            </div>
            <Pagination totalPages={totalPages} currentPage={currentPage} query={query} />
          </div>
        )}
      </div>
    </Fragment>
  );
}