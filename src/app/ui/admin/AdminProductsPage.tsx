"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Product } from "@/lib/Entities/Product";
import {
  saveAdminProductsToCache,
  getAdminProductsByActiveFromCache,
} from "@/lib/cache/adminCache";
import ProductsListAdmin from "@/app/ui/admin/ProductsListAdmin";
import Pagination from "@/app/ui/admin/Pagination";
import SearchBar from "@/app/ui/admin/SearchBar";

const ITEMS_PER_PAGE = 6;

export default function AdminProductsPage({ active }: { active: boolean }) {
  const searchParams = useSearchParams();
  const query = searchParams.get("query") || "";
  const currentPage = Number(searchParams.get("page")) || 1;

  const [products, setProducts] = useState<Product[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [fromCache, setFromCache] = useState(false);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);

      const cached = getAdminProductsByActiveFromCache(active);
      if (cached.length > 0) {
        setProducts(cached);
        setFromCache(true);
      }

      try {
        const params = new URLSearchParams({
          active: String(active),
          page: String(currentPage),
          pageSize: String(ITEMS_PER_PAGE),
        });
        if (query) params.set("query", query);

        const res = await fetch(`/api/admin/products?${params}`, {
          credentials: "include",
        });

        if (!res.ok) throw new Error("fetch failed");

        const data = await res.json();
        saveAdminProductsToCache(data.products);
        setProducts(data.products);
        setTotalPages(Math.ceil(data.total / ITEMS_PER_PAGE));
        setFromCache(false);
      } catch {
        const fallback = getAdminProductsByActiveFromCache(active);
        if (fallback.length > 0) {
          setProducts(fallback);
          setFromCache(true);
        }
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, [active, currentPage, query]);

  return (
    <div className="container mx-auto px-4">
      {fromCache && (
        <div className="bg-amber-50 border border-amber-200 text-amber-800 text-sm px-4 py-2 rounded mb-4">
          Sin conexión — mostrando datos guardados
        </div>
      )}
      <SearchBar />
      {isLoading && products.length === 0 ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
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
          <ProductsListAdmin products={products} />
          {!fromCache && (
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
