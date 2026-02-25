"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Sale, SalesOrder } from "@/lib/Entities";
import {
  saveAdminSalesToCache,
  saveAdminSalesOrdersToCache,
  getAdminSaleFromCache,
  getAdminSalesOrdersFromCache,
} from "@/lib/cache/adminCache";
import SaleDetail from "@/app/ui/admin/SaleDetail";

export default function AdminSaleDetailPage() {
  const { saleId } = useParams<{ saleId: string }>();

  const [sale, setSale] = useState<Sale | null>(null);
  const [orders, setOrders] = useState<SalesOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fromCache, setFromCache] = useState(false);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!saleId) return;

    const load = async () => {
      setIsLoading(true);

      const cachedSale = getAdminSaleFromCache(saleId);
      const cachedOrders = getAdminSalesOrdersFromCache(saleId);
      if (cachedSale) {
        setSale(cachedSale);
        setOrders(cachedOrders);
        setFromCache(true);
      }

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
        saveAdminSalesToCache([data.sale]);
        saveAdminSalesOrdersToCache(saleId, data.orders);
        setSale(data.sale);
        setOrders(data.orders);
        setFromCache(false);
      } catch {
        const fallbackSale = getAdminSaleFromCache(saleId);
        const fallbackOrders = getAdminSalesOrdersFromCache(saleId);
        if (fallbackSale) {
          setSale(fallbackSale);
          setOrders(fallbackOrders);
          setFromCache(true);
        } else {
          setNotFound(true);
        }
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, [saleId]);

  if (isLoading && !sale) {
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
      {fromCache && (
        <div className="bg-amber-50 border border-amber-200 text-amber-800 text-sm px-4 py-2 rounded mb-4">
          Sin conexión — mostrando datos guardados
        </div>
      )}
      <SaleDetail saleId={saleId} sale={sale} orders={orders} />
    </div>
  );
}
