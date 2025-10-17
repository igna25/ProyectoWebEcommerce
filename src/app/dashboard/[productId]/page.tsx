"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import ProductDetails from "@/app/ui/dashboard/ProductDetails";

export default function ProductDetailsPage() {
  const params = useParams();
  const productId =
    typeof params?.productId === "string"
      ? params.productId
      : Array.isArray(params?.productId)
        ? params.productId[0]
        : "";
  const { data: session } = useSession();
  const [product, setProduct] = useState<any | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const load = async () => {
      if (!productId) return;
      const res = await fetch(`/api/products/${productId}`);
      if (!res.ok) {
        setNotFound(true);
        return;
      }
      const json = await res.json();
      setProduct(json.product || null);
    };
    load();
  }, [productId]);

  return (
    <div className="container mx-auto px-4">
      {product ? (
        <ProductDetails product={product} userID={session?.user?.id} />
      ) : notFound ? (
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
