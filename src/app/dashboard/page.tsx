import { CardsSkeleton } from "../ui/dashboard/skeletons";
import CardWrapper from '@/app/ui/dashboard/Cards';
import ProductsRepository from "../lib/Repositories/ProductsRepository";
import { Fragment, Suspense } from "react";
import { unstable_noStore as noStore } from 'next/cache';
import { getServerSession, Session } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/auth-config";
import { Product } from "../lib/Entities/Product";
import Pagination from "../ui/dashboard/Pagination";
import SearchBar from "../ui/dashboard/SearchBar";
import ProductListDashboard from "../ui/dashboard/productListDasboard";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams?: {
    query?: string;
    page?: string;
  };
}) {
  noStore();

  const productsRepository = new ProductsRepository();
  const session: Session | null = await getServerSession(authOptions);
  
  const ITEMS_PER_PAGE = 6;

  const query = searchParams?.query || '';
  const currentPage = Number(searchParams?.page) || 1;
  let products: Product[] = [];
  let totalPages = 1;

  if (query.length > 0) {
    const result = await productsRepository.searchProductsByName(query, currentPage, ITEMS_PER_PAGE);
    products = result.products;
    totalPages = Math.ceil(result.total / ITEMS_PER_PAGE);
  } else {
    const result = await productsRepository.getAllProductsPaginated(currentPage, ITEMS_PER_PAGE);
    products = result.products;
    totalPages = Math.ceil(result.total / ITEMS_PER_PAGE);
  }

  return (
    <Fragment>
      <div className="mx-auto max-w-7xl" id="discover">
        <div className="text-start mb-2">
          <h1 className="text-4xl font-extrabold text-center">Nuestros productos</h1>
          <p className="text-center">Explora y encuentra los mejores productos de tu gusto</p>
        </div>
        <div className="flex justify-center mb-4">
          <SearchBar />
        </div>
        <div className="container mx-auto py-2">
          {products.length === 0 ? (
            <div className="h-screen flex items-center justify-center bg-gray-100">
              <div className="text-center text-gray-700">
                <p className="text-xl">Parece que no encontramos resultados para su búsqueda...</p>
              </div>
            </div>
          ) : (
            <section>
              <ProductListDashboard products={products} userId={session?.user.id}></ProductListDashboard>
              <Pagination totalPages={totalPages} currentPage={currentPage} query={query} />
            </section>
          )}
        </div>
      </div>
    </Fragment>
  );
}
