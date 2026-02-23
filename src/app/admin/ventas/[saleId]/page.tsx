import { unstable_noStore as noStore } from "next/cache";
import { Fragment } from "react";
import SalesOrdersRepository from "@/lib/Repositories/SalesOrdersRepository";
import SaleDetail from "@/app/ui/admin/SaleDetail";
import SalesRepository from "@/lib/Repositories/SalesRepository";
import { SalesOrder } from "@/lib/Entities";

export default async function SalePage({
  params,
}: {
  params: {
    saleId: string;
  };
}) {
  noStore();
  const salesOrdersRepository = new SalesOrdersRepository();
  const salesRepository = new SalesRepository();
  const sale = await salesRepository.getSaleById(params.saleId);
  let orders: SalesOrder[] = [];

  if (sale) {
    orders = await salesOrdersRepository.getOrdersBySaleId(params.saleId);
  }

  return (
    <Fragment>
      <div className="container mx-auto px-4">
        {sale ? (
          <SaleDetail saleId={params.saleId} sale={sale} orders={orders} />
        ) : (
          <div className="h-screen flex items-center justify-center bg-gray-100">
            <div className="text-center text-gray-700">
              <p className="text-xl">
                Lo sentimos, parece que la venta no existe.
              </p>
            </div>
          </div>
        )}
      </div>
    </Fragment>
  );
}
