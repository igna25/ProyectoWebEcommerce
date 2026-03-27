import SalesRepository from "@/lib/Repositories/SalesRepository";
import { NextResponse } from "next/server";
import { unstable_noStore as noStore } from "next/cache";

export const dynamic = "force-dynamic";

export async function GET(_req: any, context: { params: { id: string } }) {
  noStore();
  try {
    const salesRepository = new SalesRepository();
    const sale = await salesRepository.getSaleById(context.params.id);
    return NextResponse.json(
      { sale },
      { status: 200, headers: { "Cache-Control": "no-cache" } },
    );
  } catch (err) {
    return NextResponse.json(
      { msg: "Error trying to fetch sale" },
      { status: 500 },
    );
  }
}
