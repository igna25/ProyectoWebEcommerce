"use client";
import { useCallback, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Product } from "@/lib/Entities/Product";
import ProductsListAdmin from "@/app/ui/admin/ProductsListAdmin";
import Pagination from "@/app/ui/admin/Pagination";
import SearchBar from "@/app/ui/admin/SearchBar";

const ITEMS_PER_PAGE = 6;

export default function AdminProductsPage({ active }: { active: boolean }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams.get("query") || "";
  const rawPage = searchParams.get("page");
  const pageParam = Number(rawPage);
  const isValidPage = rawPage === null || (Number.isInteger(pageParam) && pageParam > 0);
  const currentPage = isValidPage ? (pageParam || 1) : 1;
  const basePath = `/admin/${active ? "activos" : "inactivos"}`;

  useEffect(() => {
    if (!isValidPage) router.replace(basePath);
  }, [isValidPage, router, basePath]);

  const [products, setProducts] = useState<Product[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPageOutOfRange, setIsPageOutOfRange] = useState(false);

  const load = useCallback(async () => {
    setIsLoading(true);
    setProducts([]);
    setError(null);

    try {
      const params = new URLSearchParams({
        active: String(active),
        page: String(currentPage),
        pageSize: String(ITEMS_PER_PAGE),
      });
      if (query) params.set("query", query);

      const res = await fetch(`/api/admin/products?${params}`, {
        credentials: "include",
        cache: "no-store",
      });

      if (!res.ok) throw new Error("fetch failed");

      const data = await res.json();
      const total = Number(data.total);
      const pages = Math.ceil(total / ITEMS_PER_PAGE);
      setProducts(data.products);
      setTotalPages(pages);
      setIsPageOutOfRange(total > 0 && currentPage > pages);
    } catch {
      setError("No se pudieron cargar los productos. Intenta de nuevo.");
    } finally {
      setIsLoading(false);
    }
  }, [active, currentPage, query]);

  useEffect(() => {
    load();
  }, [load]);

  const handleToggle = useCallback(
    async (productId: string, currentActive: boolean) => {
      const res = await fetch("/api/admin/products/status", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, active: !currentActive }),
      });
      await load();
      if (!res.ok) throw new Error("toggle failed");
    },
    [load],
  );

  return (
    <div className="container mx-auto px-4">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 text-sm px-4 py-2 rounded mb-4">
          {error}
        </div>
      )}
      <SearchBar />
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      ) : isPageOutOfRange ? (
        <div className="h-screen flex items-center justify-center bg-gray-100">
          <div className="text-center text-gray-700 space-y-3">
            <p className="text-xl">Esta página no existe.</p>
            <a
              href={`/admin/${active ? "activos" : "inactivos"}`}
              className="text-sm text-[#004AAD] hover:underline"
            >
              Volver a la primera página
            </a>
          </div>
        </div>
      ) : products.length === 0 ? (
        <div className="h-screen flex items-center justify-center bg-gray-100">
          <div className="text-center text-gray-700">
            <p className="text-xl">
              Parece que no encontramos resultados para su búsqueda...
            </p>
          </div>
        </div>
      ) : (
        <div>
          <ProductsListAdmin products={products} onToggle={handleToggle} />
          {totalPages > 1 && (
            <Pagination
              totalPages={totalPages}
              currentPage={currentPage}
              query={query}
            />
          )}
        </div>
      )}
    </div>
  );
}
