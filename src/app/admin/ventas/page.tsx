import SalesRepository from "@/lib/Repositories/SalesRepository";
import SalesListAdmin from "@/app/ui/admin/SalesListAdmin";
import Pagination from "../../ui/admin/Pagination";
import { unstable_noStore as noStore } from "next/cache";
import { Fragment } from "react";

export default async function SalesPage({
  searchParams,
}: {
  searchParams?: {
    page?: string;
  };
}) {
  noStore();

  const ITEMS_PER_PAGE = 5;
  const currentPage = Number(searchParams?.page) || 1;
  const salesRepository = new SalesRepository();

  const { sales, total } = await salesRepository.getAllSalesPaginated(
    currentPage,
    ITEMS_PER_PAGE,
  );
  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);

  return (
    <Fragment>
      <div className="container mx-auto px-4">
        {sales.length === 0 ? (
          <div className="h-screen flex items-center justify-center bg-gray-100">
            <div className="text-center text-gray-700">
              <p className="text-xl">
                Parece que no encontramos resultados para su búsqueda...
              </p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <div className="w-full max-w-4xl mx-4">
              <SalesListAdmin sales={sales} />
            </div>
            <Pagination totalPages={totalPages} currentPage={currentPage} />
          </div>
        )}
      </div>
    </Fragment>
  );
}
