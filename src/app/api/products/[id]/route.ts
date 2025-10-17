import ProductsRepository from "@/app/lib/Repositories/ProductsRepository";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(_req: any, context: { params: { id: string } }) {
  try {
    const { id } = context.params;
    const productsRepository = new ProductsRepository();
    const product = await productsRepository.getProductById(id);
    return NextResponse.json({ product }, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      { msg: "Error trying to fetch product" },
      { status: 500 },
    );
  }
}
