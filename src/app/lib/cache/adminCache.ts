"use client";
import { Product, Sale, SalesOrder } from "../Entities";

type AdminSummary = {
  recentSales: Sale[];
  totalEarnings: number;
  totalSales: number;
  lowStockProducts: Product[];
};

type CacheEntry<T> = {
  data: T;
  expiresAt: number;
};

const CACHE_TTL_MS = 5 * 60 * 1000;

const ADMIN_SUMMARY_KEY = "adminSummary";
const ADMIN_PRODUCTS_KEY = "adminProducts";
const ADMIN_SALES_KEY = "adminSales";
const ADMIN_SALES_ORDERS_KEY = "adminSalesOrders";

function createEntry<T>(data: T): CacheEntry<T> {
  return { data, expiresAt: Date.now() + CACHE_TTL_MS };
}

function isValid<T>(entry: CacheEntry<T>): boolean {
  return Date.now() < entry.expiresAt;
}

export function saveAdminSummaryToCache(summary: AdminSummary): void {
  try {
    localStorage.setItem(ADMIN_SUMMARY_KEY, JSON.stringify(createEntry(summary)));
  } catch (error) {
    console.error("Error al guardar resumen del admin en caché:", error);
  }
}

export function getAdminSummaryFromCache(): AdminSummary | null {
  try {
    const raw = localStorage.getItem(ADMIN_SUMMARY_KEY);
    if (!raw) return null;

    const entry: CacheEntry<AdminSummary> = JSON.parse(raw);
    if (!isValid(entry)) {
      localStorage.removeItem(ADMIN_SUMMARY_KEY);
      return null;
    }

    return entry.data;
  } catch (error) {
    console.error("Error al recuperar resumen del admin desde caché:", error);
    return null;
  }
}

export function saveAdminProductsToCache(products: Product[]): void {
  try {
    const existingRaw = localStorage.getItem(ADMIN_PRODUCTS_KEY);
    const existingEntry: CacheEntry<Record<string, Product>> | null =
      existingRaw ? JSON.parse(existingRaw) : null;

    const productsById: Record<string, Product> =
      existingEntry && isValid(existingEntry) ? existingEntry.data : {};

    for (const product of products || []) {
      if (product && typeof product.id === "string") {
        productsById[product.id] = product;
      }
    }

    localStorage.setItem(
      ADMIN_PRODUCTS_KEY,
      JSON.stringify(createEntry(productsById)),
    );
  } catch (error) {
    console.error("Error al guardar productos del admin en caché:", error);
  }
}

export function getAdminProductFromCache(productId: string): Product | null {
  try {
    const raw = localStorage.getItem(ADMIN_PRODUCTS_KEY);
    if (!raw) return null;

    const entry: CacheEntry<Record<string, Product>> = JSON.parse(raw);
    if (!isValid(entry)) {
      localStorage.removeItem(ADMIN_PRODUCTS_KEY);
      return null;
    }

    return entry.data[productId] || null;
  } catch (error) {
    console.error("Error al recuperar producto del admin desde caché:", error);
    return null;
  }
}

export function getAllAdminProductsFromCache(): Product[] {
  try {
    const raw = localStorage.getItem(ADMIN_PRODUCTS_KEY);
    if (!raw) return [];

    const entry: CacheEntry<Record<string, Product>> = JSON.parse(raw);
    if (!isValid(entry)) {
      localStorage.removeItem(ADMIN_PRODUCTS_KEY);
      return [];
    }

    return Object.values(entry.data);
  } catch (error) {
    console.error("Error al recuperar productos del admin desde caché:", error);
    return [];
  }
}

export function saveAdminSalesToCache(sales: Sale[]): void {
  try {
    const existingRaw = localStorage.getItem(ADMIN_SALES_KEY);
    const existingEntry: CacheEntry<Record<string, Sale>> | null =
      existingRaw ? JSON.parse(existingRaw) : null;

    const salesById: Record<string, Sale> =
      existingEntry && isValid(existingEntry) ? existingEntry.data : {};

    for (const sale of sales || []) {
      if (sale && typeof sale.id === "string") {
        salesById[sale.id] = sale;
      }
    }

    localStorage.setItem(
      ADMIN_SALES_KEY,
      JSON.stringify(createEntry(salesById)),
    );
  } catch (error) {
    console.error("Error al guardar ventas del admin en caché:", error);
  }
}

export function getAdminSaleFromCache(saleId: string): Sale | null {
  try {
    const raw = localStorage.getItem(ADMIN_SALES_KEY);
    if (!raw) return null;

    const entry: CacheEntry<Record<string, Sale>> = JSON.parse(raw);
    if (!isValid(entry)) {
      localStorage.removeItem(ADMIN_SALES_KEY);
      return null;
    }

    return entry.data[saleId] || null;
  } catch (error) {
    console.error("Error al recuperar venta del admin desde caché:", error);
    return null;
  }
}

export function getAllAdminSalesFromCache(): Sale[] {
  try {
    const raw = localStorage.getItem(ADMIN_SALES_KEY);
    if (!raw) return [];

    const entry: CacheEntry<Record<string, Sale>> = JSON.parse(raw);
    if (!isValid(entry)) {
      localStorage.removeItem(ADMIN_SALES_KEY);
      return [];
    }

    return Object.values(entry.data);
  } catch (error) {
    console.error("Error al recuperar ventas del admin desde caché:", error);
    return [];
  }
}

export function saveAdminSalesOrdersToCache(
  saleId: string,
  orders: SalesOrder[],
): void {
  try {
    const existingRaw = localStorage.getItem(ADMIN_SALES_ORDERS_KEY);
    const existingEntry: CacheEntry<Record<string, SalesOrder[]>> | null =
      existingRaw ? JSON.parse(existingRaw) : null;

    const ordersBySaleId: Record<string, SalesOrder[]> =
      existingEntry && isValid(existingEntry) ? existingEntry.data : {};

    ordersBySaleId[saleId] = orders || [];

    localStorage.setItem(
      ADMIN_SALES_ORDERS_KEY,
      JSON.stringify(createEntry(ordersBySaleId)),
    );
  } catch (error) {
    console.error("Error al guardar órdenes de venta en caché:", error);
  }
}

export function getAdminSalesOrdersFromCache(saleId: string): SalesOrder[] {
  try {
    const raw = localStorage.getItem(ADMIN_SALES_ORDERS_KEY);
    if (!raw) return [];

    const entry: CacheEntry<Record<string, SalesOrder[]>> = JSON.parse(raw);
    if (!isValid(entry)) {
      localStorage.removeItem(ADMIN_SALES_ORDERS_KEY);
      return [];
    }

    return entry.data[saleId] || [];
  } catch (error) {
    console.error("Error al recuperar órdenes de venta del caché:", error);
    return [];
  }
}
