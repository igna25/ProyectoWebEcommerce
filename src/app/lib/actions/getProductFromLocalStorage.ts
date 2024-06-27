// lib/actions/getCartProductsFromLocalStorage.ts
"use client"
import { OrderItem } from "../Entities/Order";
import { Product } from "../Entities/Product";

export const getCartProductsFromLocalStorage = (): (OrderItem & Product)[] => {
  if (typeof window !== 'undefined') {
    const cartProducts = localStorage.getItem('cart');
    try {
      if (cartProducts) {
        const parsedCartProducts = JSON.parse(cartProducts);
        return parsedCartProducts;
      }
    } catch (error) {
      console.error('Error parsing cart products from localStorage:', error);
    }
  }
  return [];
};
