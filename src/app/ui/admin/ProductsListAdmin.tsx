"use client";
import { useEffect, useState } from "react";
import { Button } from "@headlessui/react";
import { Product } from "@/lib/Entities";
import {
  saveAdminProductsToCache,
  getAllAdminProductsFromCache,
} from "@/lib/cache/adminCache";

interface ProductsListAdminProps {
  products: Product[];
  onLoadMore?: () => void;
  isLoading?: boolean;
}

export default function ProductsListAdmin({
  products,
  onLoadMore,
  isLoading = false,
}: ProductsListAdminProps) {
  const [cachedProducts, setCachedProducts] = useState<Product[]>(products);

  useEffect(() => {
    if (products.length > 0) {
      // Guardar productos en caché
      saveAdminProductsToCache(products);
      setCachedProducts(products);
    } else {
      const cached = getAllAdminProductsFromCache();
      if (cached.length > 0) {
        setCachedProducts(cached);
      }
    }
  }, [products]);

  return (
    <div className="space-y-4">
      {cachedProducts.map((product) => (
        <div
          key={product.id}
          className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow"
        >
          <div className="flex justify-between items-start">
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
            <div className="ml-4">
              {product.stock <= 5 && (
                <span className="inline-block bg-red-100 text-red-800 text-xs px-2 py-1 rounded">
                  Bajo stock
                </span>
              )}
            </div>
          </div>
        </div>
      ))}

      {isLoading && (
        <div className="flex justify-center py-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
        </div>
      )}

      {onLoadMore && cachedProducts.length > 0 && (
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
