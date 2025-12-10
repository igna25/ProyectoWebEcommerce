"use client";
import { useEffect, useState } from "react";
import ProductListDashboard from "../ui/dashboard/productListDasboard";
import { useSession } from "next-auth/react";
import { saveProductsToLocalCache } from "../lib/cache/productsCache";

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
        saveProductsToLocalCache([
          ...recent,
          ...top,
        ]);
      } finally {
        setIsLoading(false);
      }
    };
    loadProducts();
  }, []);

  if (isLoading) {
    return null;
  }

  return (
    <div className="mx-auto max-w-7xl py-4">
      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4">
          Productos Añadidos Recientemente
        </h2>
        <ProductListDashboard products={recentProducts} userId={userId} />
      </section>
      <section>
        <h2 className="text-3xl font-bold mb-4">Productos Más Vendidos</h2>
        <ProductListDashboard products={topSellingProducts} userId={userId} />
      </section>
    </div>
  );
}
