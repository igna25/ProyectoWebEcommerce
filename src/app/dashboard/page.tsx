"use client";
import { Suspense, useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { Product } from "@/lib/Entities/Product";
import ProductListDashboard from "../ui/dashboard/ProductListDashboard";
import Pagination from "../ui/dashboard/Pagination";
import SearchBar from "../ui/dashboard/SearchBar";

const ITEMS_PER_PAGE = 6;

function DashboardContent() {
  const searchParams = useSearchParams();
  const { data: session } = useSession();

  const query = searchParams.get("query") || "";
  const pageParam = Number(searchParams.get("page"));
  const currentPage =
    Number.isInteger(pageParam) && pageParam > 0 ? pageParam : 1;

  const [products, setProducts] = useState<Product[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sort, setSort] = useState("name_asc");

  const load = useCallback(async () => {
    setIsLoading(true);
    setProducts([]);
    setError(null);

    try {
      const params = new URLSearchParams({
        page: String(currentPage),
        pageSize: String(ITEMS_PER_PAGE),
        sort,
      });
      if (query) params.set("query", query);

      const res = await fetch(`/api/products?${params}`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error("fetch failed");

      const data = await res.json();
      setProducts(data.products);
      setTotalPages(Math.ceil(Number(data.total) / ITEMS_PER_PAGE));
    } catch {
      setError("No se pudieron cargar los productos. Intenta de nuevo.");
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, query, sort]);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div className="mx-auto max-w-7xl px-4" id="discover">
      <div className="text-start mb-2">
        <h1 className="text-2xl sm:text-4xl font-extrabold text-center">
          Nuestros productos
        </h1>
        <p className="text-center">
          Explora y encuentra los mejores productos de tu gusto
        </p>
      </div>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-4">
        <SearchBar />
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="rounded-xl border border-gray-200 bg-gray-50 py-2.5 px-3.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#004AAD] focus:border-transparent transition"
        >
          <option value="name_asc">Nombre A–Z</option>
          <option value="price_asc">Menor precio</option>
          <option value="price_desc">Mayor precio</option>
          <option value="newest">Más reciente</option>
          <option value="oldest">Más antiguo</option>
        </select>
      </div>
      <div className="container mx-auto py-2">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 text-sm px-4 py-2 rounded mb-4">
            {error}
          </div>
        )}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
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
          <section>
            <ProductListDashboard
              products={products}
              userId={session?.user.id}
            />
            <Pagination
              totalPages={totalPages}
              currentPage={currentPage}
              query={query}
            />
          </section>
        )}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense>
      <DashboardContent />
    </Suspense>
  );
}
