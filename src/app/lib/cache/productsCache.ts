"use client";

type ProductLike = { id: string } & Record<string, unknown>;

const PRODUCTS_BY_ID_KEY = "productsById";

export function saveProductsToLocalCache(products: ProductLike[]): void {
  try {
    const existingMapJson = localStorage.getItem(PRODUCTS_BY_ID_KEY);
    const productsById: Record<string, ProductLike> = existingMapJson
      ? JSON.parse(existingMapJson)
      : {};

    for (const product of products || []) {
      if (product && typeof product.id === "string") {
        productsById[product.id] = product;
      }
    }

    localStorage.setItem(PRODUCTS_BY_ID_KEY, JSON.stringify(productsById));
  } catch {}
}

export function getProductFromLocalCache(productId: string): ProductLike | null {
  try {
    const existingMapJson = localStorage.getItem(PRODUCTS_BY_ID_KEY);
    if (!existingMapJson) {
      return null;
    }
      
    const productsById: Record<string, ProductLike> = JSON.parse(existingMapJson);
    return productsById[productId] || null;
  } catch {
    return null;
  }
}
