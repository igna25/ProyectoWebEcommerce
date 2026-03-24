"use client";

import { OrderItem } from "@/lib/Entities/Order";
import { Product } from "@/lib/Entities/Product";
import { TrashIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import React from "react";

interface CartWrapperProps {
  product: Product & OrderItem;
  isLogged: boolean;
  onIncrease: (id: string) => void;
  onDecrease: (id: string) => void;
  onRemove: (id: string) => void;
}

const CartWrapper: React.FC<CartWrapperProps> = ({
  product,
  onIncrease,
  onDecrease,
  onRemove,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center gap-4">
      <div className="relative w-20 h-20 shrink-0">
        <Image
          src={product.imageurl}
          alt={product.productname}
          fill
          className="object-cover rounded-xl"
          sizes="80px"
        />
      </div>

      <div className="flex-1 min-w-0">
        <p className="font-semibold text-gray-900 truncate">
          {product.productname}
        </p>
        <p className="text-sm text-gray-500 mt-0.5">
          ${product.productprice} c/u
        </p>
        <p className="text-sm font-bold text-[#004AAD] mt-0.5">
          Subtotal: ${(product.productprice * product.quantity).toFixed(2)}
        </p>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={() => onDecrease(product.id)}
          className="w-8 h-8 flex items-center justify-center text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors font-bold"
        >
          −
        </button>
        <span className="w-6 text-center text-sm font-semibold text-gray-900">
          {product.quantity}
        </span>
        <button
          onClick={() => onIncrease(product.id)}
          className="w-8 h-8 flex items-center justify-center text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors font-bold"
        >
          +
        </button>
        <button
          onClick={() => onRemove(product.id)}
          className="w-8 h-8 flex items-center justify-center text-red-500 hover:bg-red-50 rounded-lg transition-colors ml-1"
          aria-label="Quitar producto"
        >
          <TrashIcon className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default CartWrapper;
