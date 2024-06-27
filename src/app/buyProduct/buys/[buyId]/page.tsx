import { unstable_noStore as noStore } from 'next/cache';
import { Fragment } from "react";
import SalesOrdersRepository from '@/app/lib/Repositories/SalesOrdersRepository';
import SalesRepository from '@/app/lib/Repositories/SalesRepository';
import { SalesOrder } from '@/app/lib/Entities/SalesOrder';
import SaleDetail from '@/app/ui/buyProduct/SaleDetail';
import { notFound } from 'next/navigation';

export default async function SalePage({
  params,
}: {
  params: {
    buyId: string
  };
}) {
   noStore();
   
    const salesOrdersRepository = new SalesOrdersRepository();
    const salesRepository = new SalesRepository();
    const sale = await salesRepository.getSaleById(params.buyId);
    let orders: SalesOrder[] = [];

    if (sale) {
        orders = await salesOrdersRepository.getOrdersBySaleId(sale.id);
    } else{
        notFound();
    }

    return (
        <Fragment>
            <div className="container mx-auto px-4">
                {sale ? (
                    <SaleDetail sale={sale} orders={orders}/>
                ) : (
                    <div className="h-screen flex items-center justify-center bg-gray-100">
                        <div className="text-center text-gray-700">
                            <p className="text-xl">Lo sentimos, parece que la compra no existe.</p>
                        </div>
                    </div>
                )}
            </div>
        </Fragment>
    );
}
