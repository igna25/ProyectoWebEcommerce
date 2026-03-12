"use client";
import { Product } from "../Entities/Product";
import { saveProductsToLocalCache } from "./productsCache";
import { queueOfflineOp, isOfflineSyncSupported } from "../offlineQueue";

export type CartItem = {
  productid: string;
  quantity: number;
  productprice: number;
};

const CART_STORAGE_KEY = "cart";

export function getLocalCart(): CartItem[] {
  try {
    if (typeof window === "undefined") return [];
    const cartJson = localStorage.getItem(CART_STORAGE_KEY);
    if (!cartJson) return [];
    return JSON.parse(cartJson);
  } catch {
    return [];
  }
}

export function saveLocalCart(items: CartItem[]): void {
  try {
    if (typeof window === "undefined") return;
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  } catch {}
}

export function addItemToLocalCart(product: Product): void {
  saveProductsToLocalCache([product]);

  const currentCart = getLocalCart();
  const existingItemIndex = currentCart.findIndex(
    (item) => item.productid === product.id,
  );

  if (existingItemIndex !== -1) {
    currentCart[existingItemIndex].quantity++;
  } else {
    currentCart.push({
      productid: product.id,
      quantity: 1,
      productprice: product.price,
    });
  }

  saveLocalCart(currentCart);
  window.dispatchEvent(new Event("cartUpdated"));
}

export function increaseItemQuantity(productId: string): void {
  const currentCart = getLocalCart();
  const itemIndex = currentCart.findIndex(
    (item) => item.productid === productId,
  );
  if (itemIndex !== -1) {
    currentCart[itemIndex].quantity++;
    saveLocalCart(currentCart);
    window.dispatchEvent(new Event("cartUpdated"));
  }
}

export function decreaseItemQuantity(productId: string): void {
  const currentCart = getLocalCart();
  const itemIndex = currentCart.findIndex(
    (item) => item.productid === productId,
  );
  if (itemIndex !== -1 && currentCart[itemIndex].quantity > 1) {
    currentCart[itemIndex].quantity--;
    saveLocalCart(currentCart);
    window.dispatchEvent(new Event("cartUpdated"));
  }
}

export function removeItemFromLocalCart(productId: string): void {
  const currentCart = getLocalCart();
  const updatedCart = currentCart.filter(
    (item) => item.productid !== productId,
  );
  saveLocalCart(updatedCart);
  window.dispatchEvent(new Event("cartUpdated"));
}

export function clearLocalCart(): void {
  try {
    if (typeof window === "undefined") return;
    localStorage.removeItem(CART_STORAGE_KEY);
    window.dispatchEvent(new Event("cartUpdated"));
  } catch {}
}

export async function syncCartToServer(userId: string): Promise<boolean> {
  try {
    const localItems = getLocalCart();
    const payload = { userId, items: localItems };

    if (!navigator.onLine) {
      if (isOfflineSyncSupported()) {
        await queueOfflineOp({
          url: "/api/cart/sync",
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }
      return false;
    }

    await fetch("/api/cart/sync", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const response = await fetch(`/api/cart?userId=${userId}`);
    if (!response.ok) return false;
    const json = await response.json();
    const serverItems = json.items || [];

    const simplifiedItems: CartItem[] = serverItems.map((item: any) => ({
      productid: item.productid,
      quantity: item.quantity,
      productprice: item.productprice,
    }));

    const productCacheItems = serverItems.map((item: any) => ({
      ...item,
      id: item.productid,
    }));
    saveProductsToLocalCache(productCacheItems);

    if (simplifiedItems.length > 0 || localItems.length === 0) {
      saveLocalCart(simplifiedItems);
    }
    window.dispatchEvent(new Event("cartUpdated"));
    return true;
  } catch {
    if (isOfflineSyncSupported()) {
      const localItems = getLocalCart();
      await queueOfflineOp({
        url: "/api/cart/sync",
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, items: localItems }),
      });
    }
    return false;
  }
}
