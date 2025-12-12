"use client";
import { Fragment, useEffect, useState } from "react";
import ProductList from "../ui/cart/ProductList";
import { syncCartToServer } from "../lib/cache/cartCache";

export default function CartPage() {
  const [userId, setUserId] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUserId =
      typeof window !== "undefined"
        ? localStorage.getItem("userId") || undefined
        : undefined;
    setUserId(storedUserId);
  }, []);

  useEffect(() => {
    const loadCart = async () => {
      try {
        if (userId && navigator.onLine) {
          await syncCartToServer(userId);
        }
      } finally {
        setIsLoading(false);
      }
    };
    loadCart();
  }, [userId]);

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center text-gray-700">
          <p className="text-xl">Cargando carrito...</p>
        </div>
      </div>
    );
  }

  return (
    <Fragment>
      <h1 className="text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl">
        Tu carrito
      </h1>
      <section className="w-full mb-2">
        <ProductList userId={userId}></ProductList>
      </section>
    </Fragment>
  );
}
