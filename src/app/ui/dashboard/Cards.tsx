"use client";
import { Product } from "@/lib/Entities/Product";
import Image from "next/image";
import AddToCartButton from "./AddToCartButton";
import ViewProductDetails from "./ViewProductDetailsButton";

const CardWrapper = ({
  product,
  userID,
}: {
  product: Product;
  userID: string | undefined;
}) => {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex flex-col overflow-hidden">
      <div className="relative w-full h-52">
        <Image
          src={product.imageurl}
          alt={product.productname}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
      </div>
      <div className="p-4 flex flex-col flex-1 gap-3">
        <div>
          <h3 className="font-semibold text-gray-900 text-base leading-snug">
            {product.productname}
          </h3>
          <p className="text-[#004AAD] font-bold text-lg mt-1">
            ${product.price}
          </p>
        </div>
        <div className="flex flex-col gap-2 mt-auto">
          <ViewProductDetails product={product} />
          <AddToCartButton product={product} userID={userID} />
        </div>
      </div>
    </div>
  );
};

export default CardWrapper;
