"use client";
import { useEffect, useState } from "react";
import ProductListDashboard from "../ui/dashboard/productListDasboard";
export default function HomePage() {
  const [recent, setRecent] = useState<any[]>([]);
  const [top, setTop] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const session = undefined

  useEffect(() => {
    const load = async () => {
      try {
        const [r, t] = await Promise.all([
          fetch('/api/products/recent').then((res) => res.json()),
          fetch('/api/products/top').then((res) => res.json()),
        ]);
        setRecent(r.products || []);
        setTop(t.products || []);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return null;
  }

  return (
    <div className="mx-auto max-w-7xl py-4">
      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4">Productos Añadidos Recientemente</h2>
        <ProductListDashboard products={recent} userId={undefined} />
      </section>
      <section>
        <h2 className="text-3xl font-bold mb-4">Productos Más Vendidos</h2>
        <ProductListDashboard products={top} userId={undefined} />
      </section>
    </div>
  );
}

