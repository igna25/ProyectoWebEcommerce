import ProductsRepository from "@/lib/Repositories/ProductsRepository";
import { NextResponse } from "next/server";
import { unstable_noStore as noStore } from "next/cache";

export const dynamic = "force-dynamic";

export async function GET(_req: any, context: { params: { id: string } }) {
  noStore();
  try {
    const { id } = context.params;
    const productsRepository = new ProductsRepository();
    const product = await productsRepository.getProductById(id);
    if (!product) {
      return NextResponse.json(
        {
          msg: "Product not found",
        },
        {
          status: 404,
          headers: {
            "Cache-Control": "no-cache",
          },
        },
      );
    }
    return NextResponse.json(
      {
        product,
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
      { msg: "Error trying to fetch product" },
      { status: 500 },
    );
  }
}
