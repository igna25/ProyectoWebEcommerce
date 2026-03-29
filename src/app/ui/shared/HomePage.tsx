"use client";
import { useEffect, useState } from "react";
import ProductCarousel from "./ProductCarousel";
import CardSkeleton from "./CardSkeleton";
import { useSession } from "next-auth/react";
import { saveProductsToLocalCache } from "@/lib/cache/productsCache";
import Link from "next/link";

export default function HomePage() {
  const [recentProducts, setRecentProducts] = useState<any[]>([]);
  const [topSellingProducts, setTopSellingProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { data: session } = useSession();
  const userId = session?.user?.id;

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const [recentResponse, topResponse] = await Promise.all([
          fetch("/api/products/recent").then((res) => res.json()),
          fetch("/api/products/top").then((res) => res.json()),
        ]);
        const recent = recentResponse.products || [];
        const top = topResponse.products || [];
        setRecentProducts(recent);
        setTopSellingProducts(top);
        saveProductsToLocalCache([...recent, ...top]);
      } finally {
        setIsLoading(false);
      }
    };
    loadProducts();
  }, []);

  const skeletons = Array.from({ length: 4 });

  return (
    <div className="mx-auto max-w-7xl px-6 py-10 space-y-14">
      <section>
        <div className="flex items-end justify-between mb-6">
          <div>
            <p className="text-xs font-semibold text-[#004AAD] uppercase tracking-widest mb-1">
              Novedades
            </p>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
              Añadidos recientemente
            </h2>
          </div>
          <Link
            href="/dashboard"
            className="text-sm font-semibold text-[#004AAD] hover:text-[#003d8f] transition-colors shrink-0"
          >
            Ver todos →
          </Link>
        </div>
        {isLoading ? (
          <div className="flex gap-4 overflow-hidden pb-2">
            {skeletons.map((_, i) => (
              <div key={i} className="flex-none w-64 sm:w-72">
                <CardSkeleton />
              </div>
            ))}
          </div>
        ) : (
          <ProductCarousel products={recentProducts} userId={userId} />
        )}
      </section>

      <div className="border-t border-gray-100" />

      <section>
        <div className="flex items-end justify-between mb-6">
          <div>
            <p className="text-xs font-semibold text-[#004AAD] uppercase tracking-widest mb-1">
              Tendencias
            </p>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
              Más vendidos
            </h2>
          </div>
          <Link
            href="/dashboard"
            className="text-sm font-semibold text-[#004AAD] hover:text-[#003d8f] transition-colors shrink-0"
          >
            Ver todos →
          </Link>
        </div>
        {isLoading ? (
          <div className="flex gap-4 overflow-hidden pb-2">
            {skeletons.map((_, i) => (
              <div key={i} className="flex-none w-64 sm:w-72">
                <CardSkeleton />
              </div>
            ))}
          </div>
        ) : (
          <ProductCarousel products={topSellingProducts} userId={userId} />
        )}
      </section>
    </div>
  );
}
