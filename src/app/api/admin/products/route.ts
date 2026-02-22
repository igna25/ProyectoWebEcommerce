import ProductsRepository from "@/app/lib/Repositories/ProductsRepository";
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export const dynamic = "force-dynamic";

export async function GET(req: any) {
  try {
    // Verificar autenticación
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token || token.role !== "admin") {
      return NextResponse.json({ msg: "Unauthorized" }, { status: 401 });
    }

    const productsRepository = new ProductsRepository();
    const { searchParams } = new URL(req.url || "");
    const pageParam = Number(searchParams.get("page") ?? "1");
    const pageSizeParam = Number(searchParams.get("pageSize") ?? "6");
    const activeParam = searchParams.get("active");
    const active = activeParam === "false" ? false : true;
    const queryParam = (
      searchParams.get("query") ??
      searchParams.get("q") ??
      ""
    ).trim();

    const page = Number.isFinite(pageParam) && pageParam > 0 ? pageParam : 1;
    const pageSize =
      Number.isFinite(pageSizeParam) && pageSizeParam > 0 ? pageSizeParam : 6;
    if (queryParam.length > 0) {
      const result = await productsRepository.searchProductsByName(
        queryParam,
        page,
        pageSize,
        active,
      );
      return NextResponse.json(
        {
          products: result.products,
          total: result.total,
          page,
          pageSize,
          query: queryParam,
          active,
        },
        {
          status: 200,
          headers: { "Cache-Control": "no-cache" },
        },
      );
    }
    const result = await productsRepository.getAllProductsPaginated(
      page,
      pageSize,
      active,
    );
    return NextResponse.json(
      {
        products: result.products,
        total: result.total,
        page,
        pageSize,
        active,
      },
      { status: 200, headers: { "Cache-Control": "no-cache" } },
    );
  } catch (err) {
    return NextResponse.json(
      { msg: "Error trying to fetch products" },
      { status: 500 },
    );
  }
}
