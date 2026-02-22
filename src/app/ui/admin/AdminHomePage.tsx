"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Product, Sale } from "../../lib/Entities";
import {
  saveAdminSummaryToCache,
  getAdminSummaryFromCache,
  saveAdminProductsToCache,
  saveAdminSalesToCache,
} from "../../lib/cache/adminCache";
import Link from "next/link";
import { Button } from "@headlessui/react";

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
        const cachedSummary = getAdminSummaryFromCache();

        if (cachedSummary) {
          setSummary(cachedSummary);
          onDataLoaded?.(cachedSummary);
          setIsLoading(false);
        } else {
          setIsLoading(true);
        }

        const response = await fetch("/api/admin", {
          method: "GET",
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Error al obtener datos del admin");
        }

        const data: AdminSummary = await response.json();
        saveAdminSummaryToCache(data);
        saveAdminProductsToCache(data.lowStockProducts);
        saveAdminSalesToCache(data.recentSales);
        setSummary(data);
        onDataLoaded?.(data);
      } catch (err) {
        console.error("Error cargando datos del admin:", err);
        const fallbackCache = getAdminSummaryFromCache();
        if (fallbackCache) {
          setSummary(fallbackCache);
          onDataLoaded?.(fallbackCache);
          setError(null);
        } else {
          setError("Error al cargar los datos del administrador");
        }
      } finally {
        setIsLoading(false);
      }
    };

    if (session?.user?.role === "admin") {
      loadAdminData();
    }
  }, [session, onDataLoaded]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error && !summary) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        {error}
      </div>
    );
  }

  if (!summary) {
    return null;
  }

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <div className="mb-6 border-t-2 border-gray-300 pt-4">
        <h2 className="text-2xl font-bold mb-4">Resumen del Administrador</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <div className="bg-gray-100 rounded-lg p-4">
          <h3 className="text-xl font-semibold">Total Ganado</h3>
          <p className="mt-2">${summary.totalEarnings.toFixed(2)}</p>
        </div>

        <div className="bg-gray-100 rounded-lg p-4">
          <h3 className="text-xl font-semibold">Total de Ventas</h3>
          <p className="mt-2">{summary.totalSales}</p>
        </div>
      </div>

      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4">Últimas 3 Ventas</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {summary.recentSales.map((sale) => (
            <div key={sale.id} className="bg-gray-100 rounded-lg p-4">
              <p className="text-lg font-semibold">{sale.username}</p>
              <p className="text-sm text-gray-600">${sale.totalprice}</p>
              <p className="text-xs text-gray-500">
                {new Date(sale.creationdate).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
        <Link href="/admin/ventas">
          <Button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4">
            Ir a Ventas
          </Button>
        </Link>
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-4">Productos sin Stock</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {summary.lowStockProducts.length > 0 ? (
            summary.lowStockProducts.map((product) => (
              <div key={product.id} className="bg-red-100 rounded-lg p-4">
                <p className="text-lg font-semibold">{product.productname}</p>
                <p className="text-sm text-gray-600">Stock: {product.stock}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-500">Todos los productos están al día</p>
          )}
        </div>
        <Link href={"/admin/activos"}>
          <Button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-2">
            Ir a Productos
          </Button>
        </Link>
      </div>
    </div>
  );
}
