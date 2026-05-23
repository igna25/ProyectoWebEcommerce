"use client";
import { useRef } from "react";
import CardWrapper from "../dashboard/Cards";
import { Product } from "@/lib/Entities";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

export default function ProductCarousel({
  products,
  userId,
}: {
  products: Product[];
  userId: string | undefined;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    if (!ref.current) return;
    ref.current.scrollBy({
      left: dir === "left" ? -320 : 320,
      behavior: "smooth",
    });
  };

  return (
    <div className="relative group">
      <button
        onClick={() => scroll("left")}
        className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 bg-white border border-gray-200 shadow-md rounded-full w-9 h-9 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-50"
        aria-label="Anterior"
      >
        <ChevronLeftIcon className="w-5 h-5 text-gray-700" />
      </button>

      <div
        ref={ref}
        className="flex gap-4 overflow-x-auto scroll-smooth pb-2 scrollbar-hide"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {products.map((product) => (
          <div key={product.id} className="flex-none w-64 sm:w-72">
            <CardWrapper product={product} userID={userId} />
          </div>
        ))}
      </div>

      <button
        onClick={() => scroll("right")}
        className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 bg-white border border-gray-200 shadow-md rounded-full w-9 h-9 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-50"
        aria-label="Siguiente"
      >
        <ChevronRightIcon className="w-5 h-5 text-gray-700" />
      </button>
    </div>
  );
}
