"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Product } from "@/lib/Entities/Product";
import EditProductForm from "../../../ui/admin/UpdateComponent";

export default function EditProductPage() {
  const { productId } = useParams<{ productId: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/admin/products/${productId}`, {
          credentials: "include",
        });
        if (!res.ok) return;
        const data = await res.json();
        setProduct(data.product);
      } finally {
        setLoading(false);
      }
    }
    if (productId) load();
  }, [productId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4">
      {product ? (
        <EditProductForm product={product} />
      ) : (
        <div className="h-screen flex items-center justify-center bg-gray-100">
          <div className="text-center text-gray-700">
            <p className="text-xl">
              Lo sentimos, parece que el producto no existe.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
