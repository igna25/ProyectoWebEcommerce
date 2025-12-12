"use client";
import { Product, Sale, SalesOrder } from "../Entities";

type AdminSummary = {
  recentSales: Sale[];
  totalEarnings: number;
  totalSales: number;
  lowStockProducts: Product[];
};

const ADMIN_SUMMARY_KEY = "adminSummary";
const ADMIN_PRODUCTS_KEY = "adminProducts";
const ADMIN_SALES_KEY = "adminSales";
const ADMIN_SALES_ORDERS_KEY = "adminSalesOrders";

/**
 * Guarda el resumen del admin en localStorage
 */
export function saveAdminSummaryToCache(summary: AdminSummary): void {
  try {
    localStorage.setItem(ADMIN_SUMMARY_KEY, JSON.stringify(summary));
  } catch (error) {
    console.error("Error al guardar resumen del admin en caché:", error);
  }
}

/**
 * Obtiene el resumen del admin desde localStorage
 */
export function getAdminSummaryFromCache(): AdminSummary | null {
  try {
    const cachedSummary = localStorage.getItem(ADMIN_SUMMARY_KEY);

    if (!cachedSummary) {
      return null;
    }

    return JSON.parse(cachedSummary);
  } catch (error) {
    console.error("Error al recuperar resumen del admin desde caché:", error);
    return null;
  }
}

/**
 * Guarda productos en caché del admin
 */
export function saveAdminProductsToCache(products: Product[]): void {
  try {
    const existingMapJson = localStorage.getItem(ADMIN_PRODUCTS_KEY);
    const productsById: Record<string, Product> = existingMapJson
      ? JSON.parse(existingMapJson)
      : {};

    for (const product of products || []) {
      if (product && typeof product.id === "string") {
        productsById[product.id] = product;
      }
    }

    localStorage.setItem(ADMIN_PRODUCTS_KEY, JSON.stringify(productsById));
  } catch (error) {
    console.error("Error al guardar productos del admin en caché:", error);
  }
}

/**
 * Obtiene un producto del caché del admin
 */
export function getAdminProductFromCache(productId: string): Product | null {
  try {
    const existingMapJson = localStorage.getItem(ADMIN_PRODUCTS_KEY);
    if (!existingMapJson) {
      return null;
    }

    const productsById: Record<string, Product> = JSON.parse(existingMapJson);
    return productsById[productId] || null;
  } catch (error) {
    console.error("Error al recuperar producto del admin desde caché:", error);
    return null;
  }
}

/**
 * Guarda ventas en caché del admin
 */
export function saveAdminSalesToCache(sales: Sale[]): void {
  try {
    const existingMapJson = localStorage.getItem(ADMIN_SALES_KEY);
    const salesById: Record<string, Sale> = existingMapJson
      ? JSON.parse(existingMapJson)
      : {};

    for (const sale of sales || []) {
      if (sale && typeof sale.id === "string") {
        salesById[sale.id] = sale;
      }
    }

    localStorage.setItem(ADMIN_SALES_KEY, JSON.stringify(salesById));
  } catch (error) {
    console.error("Error al guardar ventas del admin en caché:", error);
  }
}

/**
 * Obtiene una venta del caché del admin
 */
export function getAdminSaleFromCache(saleId: string): Sale | null {
  try {
    const existingMapJson = localStorage.getItem(ADMIN_SALES_KEY);
    if (!existingMapJson) {
      return null;
    }

    const salesById: Record<string, Sale> = JSON.parse(existingMapJson);
    return salesById[saleId] || null;
  } catch (error) {
    console.error("Error al recuperar venta del admin desde caché:", error);
    return null;
  }
}

/**
 * Guarda órdenes de venta en caché del admin (indexadas por saleId)
 */
export function saveAdminSalesOrdersToCache(
  saleId: string,
  orders: SalesOrder[],
): void {
  try {
    const existingMapJson = localStorage.getItem(ADMIN_SALES_ORDERS_KEY);
    const ordersBySaleId: Record<string, SalesOrder[]> = existingMapJson
      ? JSON.parse(existingMapJson)
      : {};

    ordersBySaleId[saleId] = orders || [];

    localStorage.setItem(
      ADMIN_SALES_ORDERS_KEY,
      JSON.stringify(ordersBySaleId),
    );
  } catch (error) {
    console.error("Error al guardar órdenes de venta en caché:", error);
  }
}

/**
 * Obtiene las órdenes de una venta del caché del admin
 */
export function getAdminSalesOrdersFromCache(saleId: string): SalesOrder[] {
  try {
    const existingMapJson = localStorage.getItem(ADMIN_SALES_ORDERS_KEY);
    if (!existingMapJson) {
      return [];
    }

    const ordersBySaleId: Record<string, SalesOrder[]> =
      JSON.parse(existingMapJson);
    return ordersBySaleId[saleId] || [];
  } catch (error) {
    console.error("Error al recuperar órdenes de venta del caché:", error);
    return [];
  }
}
