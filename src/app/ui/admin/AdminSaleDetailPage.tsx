"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Sale, SalesOrder } from "@/lib/Entities";
import SaleDetail from "@/app/ui/admin/SaleDetail";

export default function AdminSaleDetailPage() {
  const { saleId } = useParams<{ saleId: string }>();

  const [sale, setSale] = useState<Sale | null>(null);
  const [orders, setOrders] = useState<SalesOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!saleId) return;

    const load = async () => {
      setIsLoading(true);

      try {
        const res = await fetch(`/api/admin/sales/${saleId}`, {
          credentials: "include",
        });

        if (res.status === 404) {
          setNotFound(true);
          return;
        }

        if (!res.ok) throw new Error("fetch failed");

        const data = await res.json();
        setSale(data.sale);
        setOrders(data.orders);
      } catch {
        setNotFound(true);
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, [saleId]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (notFound || !sale) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center text-gray-700">
          <p className="text-xl">Lo sentimos, parece que la venta no existe.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4">
      <SaleDetail sale={sale} orders={orders} />
    </div>
  );
}
