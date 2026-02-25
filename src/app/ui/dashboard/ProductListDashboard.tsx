"use client";
import CardWrapper from "./Cards";
import { Product } from "@/lib/Entities";

export default function ProductListDashboard({
  products,
  userId,
}: {
  products: Product[];
  userId: string | undefined;
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
      {products.map((product) => (
        <CardWrapper key={product.id} product={product} userID={userId} />
      ))}
    </div>
  );
}
