import ProductsRepository from "@/lib/Repositories/ProductsRepository";
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export const dynamic = "force-dynamic";

export async function GET(req: any, context: { params: { id: string } }) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token || token.role !== "admin") {
      return NextResponse.json({ msg: "Unauthorized" }, { status: 401 });
    }

    const { id } = context.params;
    const productsRepository = new ProductsRepository();
    const product = await productsRepository.getProductById(id);

    if (!product) {
      return NextResponse.json(
        { msg: "Product not found" },
        { status: 404, headers: { "Cache-Control": "no-cache" } },
      );
    }

    return NextResponse.json(
      { product },
      { status: 200, headers: { "Cache-Control": "no-cache" } },
    );
  } catch (err) {
    console.error("Error fetching product:", err);
    return NextResponse.json(
      { msg: "Error trying to fetch product" },
      { status: 500 },
    );
  }
}
