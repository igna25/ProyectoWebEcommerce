"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { getProductFromLocalCache } from "@/app/lib/cache/productsCache";
import ProductDetails from "@/app/ui/dashboard/ProductDetails";

export default function ProductDetailsPage() {
  const params = useParams();
  const productIdParam = params?.productId;
  const productId =
    typeof productIdParam === "string"
      ? productIdParam
      : Array.isArray(productIdParam)
        ? productIdParam[0]
        : "";
  const { data: session } = useSession();
  const [product, setProduct] = useState<any | null>(null);
  const [isNotFound, setIsNotFound] = useState(false);

  useEffect(() => {
    const load = async () => {
      if (!productId) return;
      try {
        const response = await fetch(`/api/products/${productId}`);
        if (!response.ok) throw new Error("request-failed");
        const json = await response.json();
        if (json && json.product) {
          setProduct(json.product);
        } else {
          setIsNotFound(true);
        }
      } catch {
        const cachedProduct = getProductFromLocalCache(productId);
        if (cachedProduct) {
          setProduct(cachedProduct);
        } else {
          setIsNotFound(true);
        }
      }
    };
    load();
  }, [productId]);

  return (
    <div className="container mx-auto px-4">
      {product ? (
        <ProductDetails product={product} userID={session?.user?.id} />
      ) : isNotFound ? (
        <div className="h-screen flex items-center justify-center bg-gray-100">
          <div className="text-center text-gray-700">
            <p className="text-xl">
              Lo sentimos, parece que el producto no existe.
            </p>
          </div>
        </div>
      ) : null}
    </div>
  );
}
