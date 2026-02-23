"use client";

import React, { useState, Fragment, useEffect } from "react";
import Link from "next/link";
import CartWrapper from "./CartCard";
import { Product } from "@/lib/Entities/Product";
import { OrderItem } from "@/lib/Entities/Order";
import { buyProducts } from "@/lib/actions/buyProducts";
import { buyProductsLocal } from "@/lib/actions/buyProductsLocal";
import { useRouter } from "next/navigation";
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
  const router = useRouter();
  const [products, setProducts] = useState<EnrichedCartItem[]>([]);

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

    const handleCartUpdate = () => {
      setProducts(enrichCartItems());
    };

    window.addEventListener("cartUpdated", handleCartUpdate);
    return () => {
      window.removeEventListener("cartUpdated", handleCartUpdate);
    };
  }, []);

  const handleRemoveProduct = (productId: string) => {
    removeItemFromLocalCart(productId);
    setProducts(enrichCartItems());
    if (userId && navigator.onLine) {
      syncCartToServer(userId).catch(() => {});
    }
  };

  const handleIncreaseQuantity = (productId: string) => {
    increaseItemQuantity(productId);
    setProducts(enrichCartItems());
    if (userId && navigator.onLine) {
      syncCartToServer(userId).catch(() => {});
    }
  };

  const handleDecreaseQuantity = (productId: string) => {
    decreaseItemQuantity(productId);
    setProducts(enrichCartItems());
    if (userId && navigator.onLine) {
      syncCartToServer(userId).catch(() => {});
    }
  };

  const handleClearCart = () => {
    clearLocalCart();
    setProducts([]);
    if (userId && navigator.onLine) {
      syncCartToServer(userId).catch(() => {});
    }
  };

  const handleSubmit = async () => {
    try {
      if (userId && navigator.onLine) {
        await syncCartToServer(userId);
        const result = await buyProducts(userId);
        if (result.success && result.redirectUrl) {
          router.push(result.redirectUrl);
        }
      } else {
        const result = await buyProductsLocal(products);
        if (result.success && result.redirectUrl) {
          router.push(result.redirectUrl);
        }
      }
    } catch (error) {
      console.error("Error al enviar datos:", error);
    }
  };

  return (
    <Fragment>
      <div className="container grid md:grid-cols-2 lg:grid-cols-2 gap-4 px-4 md:px-6 mt-3">
        <div className="grid gap-4">
          {products.length > 0 ? (
            <Fragment>
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
              <div className="flex-1 flex mt-4">
                <button
                  onClick={handleClearCart}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-400 focus:outline-none"
                >
                  Limpiar carrito
                </button>
              </div>
            </Fragment>
          ) : (
            <div className="text-center border-2 border-dashed p-6 grid grid-rows-2 border-gray-200 rounded-lg">
              <p className="text-2xl">Carrito vacío</p>
              <Link href="/dashboard">
                <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-400">
                  Volver al dashboard
                </button>
              </Link>
            </div>
          )}
        </div>
        <div className="w-full lg:w-3/4 bg-white rounded-lg p-6 flex flex-col justify-between shadow-xl shadow-slate-300">
          <h2 className="text-2xl font-bold">Resumen de compra</h2>
          <div className="flex flex-col gap-2">
            {products.map((product) => (
              <div key={product.id} className="flex justify-between">
                <p>{product.productname}</p> X {product.quantity}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-4 border-t pt-6">
            <p className="text-xl font-bold">Total:</p>
            <p className="text-4xl">
              $
              {products
                .reduce(
                  (acc, product) =>
                    acc + product.productprice * product.quantity,
                  0,
                )
                .toFixed(2)}
            </p>
          </div>
          {products.length > 0 && (
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-400 text-center"
              onClick={handleSubmit}
            >
              Comprar
            </button>
          )}
        </div>
      </div>
    </Fragment>
  );
}
