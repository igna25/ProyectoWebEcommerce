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
    <div className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 text-sm px-4 py-2 rounded">
          {error}
        </div>
      )}

      {products.map((product) => (
        <div
          key={product.id}
          className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow"
        >
          <div className="flex justify-between items-center">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-800">
                {product.productname}
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                Stock disponible: {product.stock}
              </p>
              {typeof product.price === "number" && (
                <p className="text-sm text-gray-600">
                  Precio: ${product.price}
                </p>
              )}
            </div>
            <div className="ml-4 flex items-center gap-3">
              {product.stock <= 5 && (
                <span className="inline-block bg-red-100 text-red-800 text-xs px-2 py-1 rounded">
                  Bajo stock
                </span>
              )}
              <Link
                href={`/admin/${product.active ? "activos" : "inactivos"}/${product.id}`}
                className="text-sm font-medium px-3 py-1.5 rounded bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors"
              >
                Editar
              </Link>
              <Button
                onClick={() => handleToggleStatus(product.id, product.active)}
                disabled={togglingId === product.id}
                className={`text-sm font-medium px-3 py-1.5 rounded transition-colors focus:outline-none disabled:opacity-50 ${
                  product.active
                    ? "bg-red-100 text-red-700 hover:bg-red-200 data-[hover]:bg-red-200"
                    : "bg-green-100 text-green-700 hover:bg-green-200 data-[hover]:bg-green-200"
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
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
        </div>
      )}

      {onLoadMore && products.length > 0 && (
        <Button
          onClick={onLoadMore}
          className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
          disabled={isLoading}
        >
          {isLoading ? "Cargando..." : "Cargar más productos"}
        </Button>
      )}
    </div>
  );
}
