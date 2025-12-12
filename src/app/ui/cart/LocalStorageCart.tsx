"use client";
import ProductList from "./ProductList";

export function ClientCart() {
  return (
    <section className="w-full mb-2">
      <ProductList userId={undefined}></ProductList>
    </section>
  );
}
