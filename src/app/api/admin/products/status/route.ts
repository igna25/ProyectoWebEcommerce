import ProductsRepository from "@/lib/Repositories/ProductsRepository";
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function POST(req: any) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token || token.role !== "admin") {
      return NextResponse.json({ msg: "Unauthorized" }, { status: 401 });
    }

    const { productId, active } = await req.json();

    if (!productId || typeof active !== "boolean") {
      return NextResponse.json(
        { msg: "Missing productId or active status" },
        { status: 400 },
      );
    }

    const productsRepository = new ProductsRepository();
    const { updatedRows } = await productsRepository.changeProductActiveStatus(
      productId,
      active,
    );

    if (updatedRows === 0) {
      return NextResponse.json({ msg: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(
      { success: true, message: "Product status updated" },
      { status: 200 },
    );
  } catch (err) {
    console.error("Error updating product status:", err);
    return NextResponse.json(
      { msg: "Error updating product status" },
      { status: 500 },
    );
  }
}
