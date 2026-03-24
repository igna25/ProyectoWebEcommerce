"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import CartWrapper from "./CartCard";
import { Product } from "@/lib/Entities/Product";
import { OrderItem } from "@/lib/Entities/Order";
import { buyProducts } from "@/lib/actions/buyProducts";
import { buyProductsLocal } from "@/lib/actions/buyProductsLocal";

import { ShoppingBagIcon } from "@heroicons/react/24/outline";
import {
  getLocalCart,
  increaseItemQuantity,
  decreaseItemQuantity,
  removeItemFromLocalCart,
  clearLocalCart,
  syncCartToServer,
  CartItem,
} from "@/lib/cache/cartCache";
import { getProductFromLocalCache } from "@/lib/cache/productsCache";

type EnrichedCartItem = CartItem &
  Product & { id: string; cartid: string; dateadded: Date };

export default function ProductList({
  userId,
}: {
  userId: string | undefined;
}) {
  const [products, setProducts] = useState<EnrichedCartItem[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [purchaseError, setPurchaseError] = useState<string | null>(null);

  const enrichCartItems = (): EnrichedCartItem[] => {
    const cartItems = getLocalCart();
    return cartItems
      .map((item) => {
        const product = getProductFromLocalCache(item.productid);
        if (!product) return null;
        return {
          ...item,
          ...product,
          id: item.productid,
          cartid: "",
          dateadded: new Date(),
        };
      })
      .filter((item): item is EnrichedCartItem => item !== null);
  };

  useEffect(() => {
    setProducts(enrichCartItems());
    const handleCartUpdate = () => setProducts(enrichCartItems());
    window.addEventListener("cartUpdated", handleCartUpdate);
    return () => window.removeEventListener("cartUpdated", handleCartUpdate);
  }, []);

  const handleRemoveProduct = (productId: string) => {
    removeItemFromLocalCart(productId);
    setProducts(enrichCartItems());
    if (userId && navigator.onLine) syncCartToServer(userId).catch(() => {});
  };

  const handleIncreaseQuantity = (productId: string) => {
    increaseItemQuantity(productId);
    setProducts(enrichCartItems());
    if (userId && navigator.onLine) syncCartToServer(userId).catch(() => {});
  };

  const handleDecreaseQuantity = (productId: string) => {
    decreaseItemQuantity(productId);
    setProducts(enrichCartItems());
    if (userId && navigator.onLine) syncCartToServer(userId).catch(() => {});
  };

  const handleClearCart = () => {
    clearLocalCart();
    setProducts([]);
    if (userId && navigator.onLine) syncCartToServer(userId).catch(() => {});
  };

  const outOfStockProducts = products.filter((p) => p.stock === 0);

  const handleSubmit = async () => {
    setSubmitting(true);
    setPurchaseError(null);
    try {
      let result;
      if (userId) {
        if (navigator.onLine) {
          await syncCartToServer(userId);
        }
        result = await buyProducts(userId);
      } else {
        result = await buyProductsLocal(products);
      }
      if (result.success && result.redirectUrl) {
        window.location.href = result.redirectUrl;
      } else if (result.outOfStock && result.outOfStock.length > 0) {
        setPurchaseError(`Sin stock: ${result.outOfStock.join(", ")}`);
      } else {
        setPurchaseError("No se pudo completar la compra. Intenta de nuevo.");
      }
    } catch {
      setPurchaseError("Ocurrió un error al procesar la compra.");
    } finally {
      setSubmitting(false);
    }
  };

  const total = products
    .reduce((acc, p) => acc + p.productprice * p.quantity, 0)
    .toFixed(2);

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <ShoppingBagIcon className="w-16 h-16 text-gray-300 mb-4" />
        <h2 className="text-xl font-bold text-gray-700 mb-1">
          Tu carrito está vacío
        </h2>
        <p className="text-sm text-gray-400 mb-6">
          Explorá el catálogo y agregá productos.
        </p>
        <Link
          href="/dashboard"
          className="px-6 py-2.5 bg-[#004AAD] hover:bg-[#003d8f] text-white text-sm font-semibold rounded-xl transition-colors"
        >
          Ver productos
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 sm:py-6 grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
      <div className="lg:col-span-2 flex flex-col gap-3">
        {products.map((product: OrderItem & Product) => (
          <CartWrapper
            key={product.productid}
            product={product}
            isLogged={!!userId}
            onIncrease={() => handleIncreaseQuantity(product.productid)}
            onDecrease={() => handleDecreaseQuantity(product.productid)}
            onRemove={() => handleRemoveProduct(product.productid)}
          />
        ))}
        <button
          onClick={handleClearCart}
          className="self-start text-sm font-medium text-red-500 hover:text-red-700 transition-colors mt-1"
        >
          Vaciar carrito
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6 flex flex-col gap-4 h-fit lg:sticky lg:top-20">
        <h2 className="text-lg font-bold text-gray-900">Resumen</h2>

        <div className="flex flex-col gap-2 text-sm text-gray-600">
          {products.map((product) => (
            <div key={product.id} className="flex justify-between">
              <span className="truncate mr-2">{product.productname}</span>
              <span className="shrink-0 text-gray-400">
                x{product.quantity}
              </span>
            </div>
          ))}
        </div>

        <div className="border-t pt-4 flex justify-between items-center">
          <p className="text-sm font-semibold text-gray-700">Total</p>
          <p className="text-2xl font-extrabold text-[#004AAD]">${total}</p>
        </div>

        {outOfStockProducts.length > 0 && (
          <div className="rounded-xl bg-red-50 border border-red-100 p-3 flex flex-col gap-1">
            <p className="text-xs font-semibold text-red-700">
              Los siguientes productos no tienen stock:
            </p>
            <ul className="list-disc list-inside">
              {outOfStockProducts.map((p) => (
                <li key={p.id} className="text-xs text-red-600">
                  {p.productname}
                </li>
              ))}
            </ul>
          </div>
        )}

        {purchaseError && (
          <p className="text-sm text-red-600 text-center">{purchaseError}</p>
        )}
        <button
          onClick={handleSubmit}
          disabled={submitting || outOfStockProducts.length > 0}
          className="w-full py-3 bg-[#004AAD] hover:bg-[#003d8f] text-white text-sm font-semibold rounded-xl transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {submitting ? "Procesando..." : "Confirmar compra"}
        </button>
      </div>
    </div>
  );
}
