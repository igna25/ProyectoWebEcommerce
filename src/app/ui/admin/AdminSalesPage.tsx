"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Sale } from "@/lib/Entities";
import {
  saveAdminSalesToCache,
  getAllAdminSalesFromCache,
} from "@/lib/cache/adminCache";
import SalesListAdmin from "@/app/ui/admin/SalesListAdmin";
import Pagination from "@/app/ui/admin/Pagination";

const ITEMS_PER_PAGE = 5;

export default function AdminSalesPage() {
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get("page")) || 1;

  const [sales, setSales] = useState<Sale[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [fromCache, setFromCache] = useState(false);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);

      const cached = getAllAdminSalesFromCache();
      if (cached.length > 0) {
        setSales(cached);
        setFromCache(true);
      }

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
        saveAdminSalesToCache(data.sales);
        setSales(data.sales);
        setTotalPages(Math.ceil(data.total / ITEMS_PER_PAGE));
        setFromCache(false);
      } catch {
        const fallback = getAllAdminSalesFromCache();
        if (fallback.length > 0) {
          setSales(fallback);
          setFromCache(true);
        }
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, [currentPage]);

  return (
    <div className="container mx-auto px-4">
      {fromCache && (
        <div className="bg-amber-50 border border-amber-200 text-amber-800 text-sm px-4 py-2 rounded mb-4">
          Sin conexión — mostrando datos guardados
        </div>
      )}
      {isLoading && sales.length === 0 ? (
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
          {!fromCache && (
            <Pagination totalPages={totalPages} currentPage={currentPage} />
          )}
        </div>
      )}
    </div>
  );
}
