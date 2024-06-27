import { authOptions } from '@/app/api/auth/[...nextauth]/auth-config';
import SalesOrdersRepository from '@/app/lib/Repositories/SalesOrdersRepository';
import SalesRepository from '@/app/lib/Repositories/SalesRepository';
import SaleSummary from '@/app/ui/buyProduct/SaleSummary';
import Pagination from '@/app/ui/dashboard/Pagination';
import SearchBar from '@/app/ui/dashboard/SearchBar';
import { getServerSession, Session } from 'next-auth';
import { unstable_noStore as noStore } from 'next/cache';
import { Fragment } from 'react';

export default async function getAllBuysPaginated({
    searchParams,
}: {
    searchParams?: {
        page?: string;
    };
}) {
    noStore();

    const session: Session | null = await getServerSession(authOptions)

    const ITEMS_PER_PAGE = 5;
    const currentPage = Number(searchParams?.page) || 1;
    const salesRepository = new SalesRepository();
    let totalPages = 5;

    const { sales, total } = await salesRepository.getAllSalesPaginated(currentPage, ITEMS_PER_PAGE);
    totalPages = Math.ceil(total / ITEMS_PER_PAGE);
    const filteredSales = sales.filter(sale => sale.userid === session?.user.id);

    return (
        <Fragment>
            <div className="container mx-auto px-4">
                <SearchBar />
                {sales.length === 0 ? (
                    <div className="h-screen flex items-center justify-center bg-gray-100">
                        <div className="text-center text-gray-700">
                            <p className="text-xl">Parece que no encontramos resultados para su búsqueda...</p>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center">
                        <div className="w-full max-w-4xl mx-4 ">
                            {filteredSales.map((sale) => (
                                <div key={sale.id} className="w-full items-center">
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
