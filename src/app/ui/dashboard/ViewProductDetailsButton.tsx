"use client";
import Link from "next/link";
import { Product } from "@/lib/Entities/Product";

function ViewProductDetailsButton({ product }: { product: Product }) {
  return (
    <Link
      href={"/dashboard/" + product.id}
      className="w-full text-center py-2 px-4 rounded-xl text-sm font-semibold text-[#004AAD] border border-[#004AAD] hover:bg-blue-50 transition-colors"
    >
      Ver detalles
    </Link>
  );
}

export default ViewProductDetailsButton;
