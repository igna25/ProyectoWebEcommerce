"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Sale } from "@/app/lib/Entities";
import {
  saveAdminSalesToCache,
  getAllAdminSalesFromCache,
} from "@/app/lib/cache/adminCache";

interface SalesListAdminProps {
  sales: Sale[];
  onLoadMore?: () => void;
  isLoading?: boolean;
}

export default function SalesListAdmin({
  sales,
  onLoadMore,
  isLoading = false,
}: SalesListAdminProps) {
  const [cachedSales, setCachedSales] = useState<Sale[]>(sales);

  useEffect(() => {
    if (sales.length > 0) {
      // Guardar ventas en caché
      saveAdminSalesToCache(sales);
      setCachedSales(sales);
    } else {
      const cached = getAllAdminSalesFromCache();
      if (cached.length > 0) {
        setCachedSales(cached);
      }
    }
  }, [sales]);

  return (
    <div className="space-y-4">
      {cachedSales.map((sale) => (
        <div
          key={sale.id}
          className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow"
        >
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-800">
                {sale.username}
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                Monto: $
                {typeof sale.totalprice === "number"
                  ? sale.totalprice.toFixed(2)
                  : sale.totalprice}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Fecha: {new Date(sale.creationdate).toLocaleDateString()}
              </p>
            </div>
            <Link href={`/admin/ventas/${sale.id}`}>
              <button className="ml-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                Ver detalle
              </button>
            </Link>
          </div>
        </div>
      ))}

      {isLoading && (
        <div className="flex justify-center py-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
        </div>
      )}

      {onLoadMore && cachedSales.length > 0 && (
        <button
          onClick={onLoadMore}
          className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
          disabled={isLoading}
        >
          {isLoading ? "Cargando..." : "Cargar más ventas"}
        </button>
      )}
    </div>
  );
}
