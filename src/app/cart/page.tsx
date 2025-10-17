"use client";
import { Fragment, useEffect, useState } from "react";
import ProductList from "../ui/cart/ProductList";

export default function CartPage() {
  const [userId, setUserId] = useState<string | undefined>(undefined);
  const [cartProducts, setCartProducts] = useState<any[]>([]);

  useEffect(() => {
    const id =
      typeof window !== "undefined"
        ? localStorage.getItem("userId") || undefined
        : undefined;
    setUserId(id);
  }, []);

  useEffect(() => {
    const sync = async () => {
      try {
        const local = JSON.parse(localStorage.getItem("cart") || "[]");
        if (userId && navigator.onLine) {
          await fetch("/api/cart/sync", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              userId,
              items: local.map((p: any) => ({
                productid: p.productid,
                quantity: p.quantity,
                productprice: p.productprice,
              })),
            }),
          });
          const res = await fetch(`/api/cart?userId=${userId}`);
          const json = await res.json();
          setCartProducts(json.items || []);
        } else {
          setCartProducts(local);
        }
      } catch {}
    };
    sync();
  }, [userId]);

  return (
    <Fragment>
      <h1 className="text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl">
        Tu carrito
      </h1>
      <section className="w-full mb-2">
        <ProductList cartProducts={cartProducts} userId={userId}></ProductList>
      </section>
    </Fragment>
  );
}
