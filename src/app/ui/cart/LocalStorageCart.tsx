// components/ClientCart.tsx
"use client"
import { OrderItem } from '@/app/lib/Entities/Order';
import { Product } from '@/app/lib/Entities/Product';
import { useEffect, useState } from 'react';
import ProductList  from './ProductList';


export function ClientCart() {
  const [cartProducts, setCartProducts] = useState<(OrderItem & Product)[]>([]);

  useEffect(() => {
    const cartFromLocalStorage = localStorage.getItem('cart');
    if (cartFromLocalStorage) {
      setCartProducts(JSON.parse(cartFromLocalStorage));
    }
  }, []);

  return (
    <section className="w-full mb-2">
      <ProductList cartProducts={cartProducts} userId={undefined}></ProductList>
    </section>
  );
}
