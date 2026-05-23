"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@headlessui/react";
import { Sale } from "@/lib/Entities";

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
    setCachedSales(sales);
  }, [sales]);

  return (
    <div className="space-y-3">
      {cachedSales.map((sale) => (
        <div
          key={sale.id}
          className="bg-white border border-gray-100 rounded-2xl px-5 py-4 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex justify-between items-center gap-4">
            <div className="flex-1 min-w-0">
              <h3 className="text-base font-semibold text-gray-800 truncate">
                {sale.username}
              </h3>
              <div className="flex flex-wrap gap-3 mt-1.5">
                <span className="text-sm font-medium text-[#004AAD]">
                  $
                  {typeof sale.totalprice === "number"
                    ? sale.totalprice.toFixed(2)
                    : sale.totalprice}
                </span>
                <span className="text-xs text-gray-400">
                  {new Date(sale.creationdate).toLocaleDateString()}
                </span>
              </div>
            </div>
            <Link
              href={`/admin/ventas/${sale.id}`}
              className="shrink-0 text-sm bg-[#004AAD] hover:bg-[#003d8f] text-white font-semibold py-2 px-4 rounded-xl transition-colors"
            >
              Ver detalle
            </Link>
          </div>
        </div>
      ))}

      {isLoading && (
        <div className="flex justify-center py-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#004AAD]"></div>
        </div>
      )}

      {onLoadMore && cachedSales.length > 0 && (
        <Button
          onClick={onLoadMore}
          className="w-full bg-[#004AAD] hover:bg-[#003d8f] text-white font-semibold py-2.5 px-4 rounded-xl mt-2 transition-colors disabled:opacity-50"
          disabled={isLoading}
        >
          {isLoading ? "Cargando..." : "Cargar más ventas"}
        </Button>
      )}
    </div>
  );
}
