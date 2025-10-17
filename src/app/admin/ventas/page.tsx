import SalesRepository from "@/app/lib/Repositories/SalesRepositor";
import SaleSummary from "@/app/ui/admin/SaleSummary";
import { unstable_noStore as noStore } from "next/cache";
import { Fragment } from "react";
import Pagination from "../../ui/admin/Pagination";

export default async function LoginPage({
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
  let totalPages = 5;

  const { sales, total } = await salesRepository.getAllSalesPaginated(
    currentPage,
    ITEMS_PER_PAGE,
  );
  totalPages = Math.ceil(total / ITEMS_PER_PAGE);

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
            <div className="w-full max-w-4xl mx-4 ">
              {sales.map((sale, index) => (
                <div key={index} className="w-full items-center">
                  <SaleSummary sale={sale} />
                </div>
              ))}
            </div>
            <Pagination totalPages={totalPages} currentPage={currentPage} />
          </div>
        )}
      </div>
    </Fragment>
  );
}
