import SalesRepository from "@/app/lib/Repositories/SalesRepository";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(_req: any, context: { params: { id: string } }) {
  try {
    const salesRepository = new SalesRepository();
    const sale = await salesRepository.getSaleById(context.params.id);
    return NextResponse.json({ sale }, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      { msg: "Error trying to fetch sale" },
      { status: 500 },
    );
  }
}
