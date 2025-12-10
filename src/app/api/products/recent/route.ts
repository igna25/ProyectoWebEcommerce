import ProductsRepository from "@/app/lib/Repositories/ProductsRepository";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const productsRepository = new ProductsRepository();
    const products = await productsRepository.getRecentlyAddedProducts();
    return NextResponse.json(
      {
        products,
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "no-cache",
        },
      },
    );
  } catch (err) {
    return NextResponse.json(
      { msg: "Error trying to fetch recent products" },
      { status: 500 },
    );
  }
}
