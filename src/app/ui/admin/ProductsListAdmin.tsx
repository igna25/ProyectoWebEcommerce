"use client";
import { useState } from "react";
import Link from "next/link";
import { Button } from "@headlessui/react";
import { Product } from "@/lib/Entities";

interface ProductsListAdminProps {
  products: Product[];
  onToggle: (productId: string, currentActive: boolean) => Promise<void>;
  onLoadMore?: () => void;
  isLoading?: boolean;
}

export default function ProductsListAdmin({
  products,
  onToggle,
  onLoadMore,
  isLoading = false,
}: ProductsListAdminProps) {
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleToggleStatus = async (
    productId: string,
    currentActive: boolean,
  ) => {
    setTogglingId(productId);
    setError(null);
    try {
      await onToggle(productId, currentActive);
    } catch {
      setError("No se pudo cambiar el estado del producto. Intenta de nuevo.");
    } finally {
      setTogglingId(null);
    }
  };

  return (
    <div className="space-y-3">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 text-sm px-4 py-2 rounded-xl">
          {error}
        </div>
      )}

      {products.map((product) => (
        <div
          key={product.id}
          className="bg-white border border-gray-100 rounded-2xl px-5 py-4 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex justify-between items-center gap-4">
            <div className="flex-1 min-w-0">
              <h3 className="text-base font-semibold text-gray-800 truncate">
                {product.productname}
              </h3>
              <div className="flex flex-wrap gap-3 mt-1.5">
                <span className="text-sm text-gray-500">
                  Stock:{" "}
                  <span className="font-medium text-gray-700">
                    {product.stock}
                  </span>
                </span>
                {typeof product.price === "number" && (
                  <span className="text-sm text-gray-500">
                    Precio:{" "}
                    <span className="font-medium text-[#004AAD]">
                      ${product.price}
                    </span>
                  </span>
                )}
              </div>
            </div>
            <div className="shrink-0 flex items-center gap-2">
              {product.stock === 0 ? (
                <span className="text-xs bg-red-100 text-red-700 px-2.5 py-1 rounded-full font-medium">
                  Sin stock
                </span>
              ) : (
                product.stock <= 5 && (
                  <span className="text-xs bg-amber-100 text-amber-700 px-2.5 py-1 rounded-full font-medium">
                    Bajo stock
                  </span>
                )
              )}
              <Link
                href={`/admin/${product.active ? "activos" : "inactivos"}/${product.id}`}
                className="text-sm font-medium px-3 py-1.5 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
              >
                Editar
              </Link>
              <Button
                onClick={() => handleToggleStatus(product.id, product.active)}
                disabled={togglingId === product.id}
                className={`text-sm font-medium px-3 py-1.5 rounded-xl transition-colors focus:outline-none disabled:opacity-50 ${
                  product.active
                    ? "bg-red-100 text-red-700 hover:bg-red-200"
                    : "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                }`}
              >
                {togglingId === product.id
                  ? "Guardando..."
                  : product.active
                    ? "Desactivar"
                    : "Activar"}
              </Button>
            </div>
          </div>
        </div>
      ))}

      {isLoading && (
        <div className="flex justify-center py-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#004AAD]"></div>
        </div>
      )}

      {onLoadMore && products.length > 0 && (
        <Button
          onClick={onLoadMore}
          className="w-full bg-[#004AAD] hover:bg-[#003d8f] text-white font-semibold py-2.5 px-4 rounded-xl mt-2 transition-colors disabled:opacity-50"
          disabled={isLoading}
        >
          {isLoading ? "Cargando..." : "Cargar más productos"}
        </Button>
      )}
    </div>
  );
}
