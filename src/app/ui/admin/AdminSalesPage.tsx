"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Sale } from "@/lib/Entities";
import SalesListAdmin from "@/app/ui/admin/SalesListAdmin";
import Pagination from "@/app/ui/admin/Pagination";

const ITEMS_PER_PAGE = 5;

export default function AdminSalesPage() {
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get("page")) || 1;

  const [sales, setSales] = useState<Sale[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      setSales([]);
      setError(null);

      try {
        const params = new URLSearchParams({
          page: String(currentPage),
          pageSize: String(ITEMS_PER_PAGE),
        });

        const res = await fetch(`/api/admin/sales?${params}`, {
          credentials: "include",
        });

        if (!res.ok) throw new Error("fetch failed");

        const data = await res.json();
        setSales(data.sales);
        setTotalPages(Math.ceil(Number(data.total) / ITEMS_PER_PAGE));
      } catch {
        setError("No se pudieron cargar las ventas. Intenta de nuevo.");
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, [currentPage]);

  return (
    <div className="container mx-auto px-4">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 text-sm px-4 py-2 rounded mb-4">
          {error}
        </div>
      )}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      ) : sales.length === 0 ? (
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
          {totalPages > 1 && (
            <Pagination totalPages={totalPages} currentPage={currentPage} />
          )}
        </div>
      )}
    </div>
  );
}
