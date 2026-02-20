import SalesRepository from "@/app/lib/Repositories/SalesRepository";
import SalesOrdersRepository from "@/app/lib/Repositories/SalesOrdersRepository";
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export const dynamic = "force-dynamic";

export async function GET(req: any, context: { params: { id: string } }) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token || token.role !== "admin") {
      return NextResponse.json({ msg: "Unauthorized" }, { status: 401 });
    }

    const salesRepository = new SalesRepository();
    const salesOrdersRepository = new SalesOrdersRepository();

    const sale = await salesRepository.getSaleById(context.params.id);

    if (!sale) {
      return NextResponse.json({ msg: "Sale not found" }, { status: 404 });
    }

    const orders = await salesOrdersRepository.getOrdersBySaleId(
      context.params.id,
    );

    return NextResponse.json(
      { sale, orders },
      { status: 200, headers: { "Cache-Control": "no-cache" } },
    );
  } catch (err) {
    console.error("Error fetching sale:", err);
    return NextResponse.json(
      { msg: "Error trying to fetch sale" },
      { status: 500 },
    );
  }
}
