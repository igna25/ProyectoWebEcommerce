import SalesRepository from "@/lib/Repositories/SalesRepository";
import { NextResponse } from "next/server";
import { unstable_noStore } from "next/cache";

export const dynamic = "force-dynamic";

export async function GET(_req: any, context: { params: { id: string } }) {
  unstable_noStore();
  try {
    const salesRepository = new SalesRepository();
    const sale = await salesRepository.getSaleById(context.params.id);
    if (!sale) {
      return NextResponse.json({ msg: "Sale not found" }, { status: 404 });
    } else {
      return NextResponse.json({ sale }, { status: 200 });
    }
  } catch (err) {
    return NextResponse.json(
      { msg: "Error trying to fetch sale" },
      { status: 500 },
    );
  }
}
