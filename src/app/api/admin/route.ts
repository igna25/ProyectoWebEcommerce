import SalesRepository from "@/lib/Repositories/SalesRepository";
import ProductsRepository from "@/lib/Repositories/ProductsRepository";
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export const dynamic = "force-dynamic";

export async function GET(req: any) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token || token.role !== "admin") {
      return NextResponse.json({ msg: "Unauthorized" }, { status: 401 });
    }

    const salesRepository = new SalesRepository();
    const productsRepository = new ProductsRepository();

    const [recentSales, { totalEarnings, totalSales }, lowStockProducts] =
      await Promise.all([
        salesRepository.getRecentSales(3),
        salesRepository.getMonthlyEarnings(),
        productsRepository.getOutOfStockProducts(),
      ]);

    return NextResponse.json(
      {
        recentSales,
        totalEarnings,
        totalSales,
        lowStockProducts,
      },
      { status: 200, headers: { "Cache-Control": "no-cache" } },
    );
  } catch (err) {
    console.error("Error fetching summary:", err);
    return NextResponse.json(
      { msg: "Error trying to fetch summary" },
      { status: 500 },
    );
  }
}
