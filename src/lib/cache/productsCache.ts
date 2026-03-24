"use client";
import { Product } from "../Entities/Product";

const PRODUCTS_BY_ID_KEY = "productsById";

export function saveProductsToLocalCache(products: Product[]): void {
  try {
    const existingMapJson = localStorage.getItem(PRODUCTS_BY_ID_KEY);
    const productsById: Record<string, Product> = existingMapJson
      ? JSON.parse(existingMapJson)
      : {};

    for (const product of products || []) {
      if (product && product.id != null) {
        productsById[String(product.id)] = {
          ...product,
          id: String(product.id),
        };
      }
    }

    localStorage.setItem(PRODUCTS_BY_ID_KEY, JSON.stringify(productsById));
  } catch {}
}

export function getProductFromLocalCache(productId: string): Product | null {
  try {
    const existingMapJson = localStorage.getItem(PRODUCTS_BY_ID_KEY);
    if (!existingMapJson) {
      return null;
    }

    const productsById: Record<string, Product> = JSON.parse(existingMapJson);
    return productsById[productId] || null;
  } catch {
    return null;
  }
}
