import SalesRepository from "@/lib/Repositories/SalesRepository";
import ProductsRepository from "@/lib/Repositories/ProductsRepository";
import type { Sale } from "@/lib/Entities/Sale";
import type { Product } from "@/lib/Entities/Product";

export type AdminSummary = {
  recentSales: Sale[];
  totalEarnings: number;
  totalSales: number;
  lowStockProducts: Product[];
};

const salesRepository = new SalesRepository();
const productsRepository = new ProductsRepository();

export async function getAdminSummary(): Promise<AdminSummary> {
  const [recentSales, { totalEarnings, totalSales }, lowStockProducts] =
    await Promise.all([
      salesRepository.getRecentSales(3),
      salesRepository.getMonthlyEarnings(),
      productsRepository.getOutOfStockProducts(),
    ]);
  return {
    recentSales,
    totalEarnings,
    totalSales,
    lowStockProducts,
  };
}
