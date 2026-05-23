"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Product, Sale } from "@/lib/Entities";
import Link from "next/link";

type AdminSummary = {
  recentSales: Sale[];
  totalEarnings: number;
  totalSales: number;
  lowStockProducts: Product[];
};

interface AdminHomePageProps {
  onDataLoaded?: (data: AdminSummary) => void;
}

export default function AdminHomePage({ onDataLoaded }: AdminHomePageProps) {
  const [summary, setSummary] = useState<AdminSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { data: session } = useSession();

  useEffect(() => {
    const loadAdminData = async () => {
      try {
        setError(null);
        setIsLoading(true);

        if (session?.user?.role !== "admin") {
          setIsLoading(false);
          return;
        }

        const response = await fetch("/api/admin", {
          method: "GET",
          credentials: "include",
        });

        if (!response.ok) throw new Error("Error al obtener datos del admin");

        const data: AdminSummary = await response.json();
        setSummary(data);
        onDataLoaded?.(data);
      } catch (err) {
        console.error("Error cargando datos del admin:", err);
        setError("Error al cargar los datos del administrador");
      } finally {
        setIsLoading(false);
      }
    };

    loadAdminData();
  }, [session, onDataLoaded]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#004AAD]"></div>
      </div>
    );
  }

  if (error && !summary) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
        {error}
      </div>
    );
  }

  if (!summary) {
    return null;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Resumen</h2>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
            Total Ganado
          </p>
          <p className="mt-2 text-2xl font-bold text-gray-900">
            ${summary.totalEarnings.toFixed(2)}
          </p>
          <div className="mt-2 h-1 w-10 rounded-full bg-[#004AAD]" />
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
            Ventas este mes
          </p>
          <p className="mt-2 text-2xl font-bold text-gray-900">
            {summary.totalSales}
          </p>
          <div className="mt-2 h-1 w-10 rounded-full bg-[#004AAD]" />
        </div>
      </div>

      {/* Últimas ventas */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-semibold text-gray-800">
            Últimas 3 Ventas
          </h3>
          <Link
            href="/admin/ventas"
            className="text-sm text-[#004AAD] hover:underline font-medium"
          >
            Ver todas →
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {summary.recentSales.map((sale) => (
            <div
              key={sale.id}
              className="bg-gray-50 rounded-xl p-4 border border-gray-100"
            >
              <p className="font-semibold text-gray-800 truncate">
                {sale.username}
              </p>
              <p className="text-sm font-medium text-[#004AAD] mt-1">
                ${sale.totalprice}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                {new Date(sale.creationdate).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Productos sin stock */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-semibold text-gray-800">
            Productos sin Stock
          </h3>
          <Link
            href="/admin/activos"
            className="text-sm text-[#004AAD] hover:underline font-medium"
          >
            Ver productos →
          </Link>
        </div>
        {summary.lowStockProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {summary.lowStockProducts.map((product) => (
              <div
                key={product.id}
                className="bg-red-50 rounded-xl p-4 border border-red-100"
              >
                <p className="font-semibold text-gray-800 truncate">
                  {product.productname}
                </p>
                <span className="inline-block mt-2 text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-medium">
                  Stock: {product.stock}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500">
            ✓ Todos los productos están al día
          </p>
        )}
      </div>
    </div>
  );
}
