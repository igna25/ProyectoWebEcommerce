import ProductsRepository from "@/lib/Repositories/ProductsRepository";
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function POST(req: any) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token || token.role !== "admin") {
      return NextResponse.json({ msg: "Unauthorized" }, { status: 401 });
    }

    const { productId, stock } = await req.json();

    if (!productId || typeof stock !== "number" || stock < 0) {
      return NextResponse.json(
        { msg: "Invalid productId or stock value" },
        { status: 400 },
      );
    }

    const productsRepository = new ProductsRepository();
    const { updatedRows } = await productsRepository.updateStock(
      productId,
      stock,
    );

    if (updatedRows === 0) {
      return NextResponse.json({ msg: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(
      { success: true, message: "Stock updated" },
      { status: 200 },
    );
  } catch (err) {
    console.error("Error updating stock:", err);
    return NextResponse.json({ msg: "Error updating stock" }, { status: 500 });
  }
}
