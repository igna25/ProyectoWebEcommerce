import SalesRepository from "@/lib/Repositories/SalesRepository";
import { NextResponse } from "next/server";

export async function GET(req: any) {
  try {
    const salesRepository = new SalesRepository();
    const { searchParams } = new URL(req.url || "");
    const id = searchParams.get("id");
    if (id != null) {
      const sale = await salesRepository.getSaleById(id);
      if (!sale) {
        return NextResponse.json({ msg: "Sale not found" }, { status: 404 });
      }
      return NextResponse.json({ sale }, { status: 200 });
    } else {
      const sales = await salesRepository.getAllSales();
      return NextResponse.json({ sales }, { status: 200 });
    }
  } catch (err) {
    return NextResponse.json(
      { msg: "Error trying to fetch sales" },
      { status: 500 },
    );
  }
}

export const revalidate = 60;
