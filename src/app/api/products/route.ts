import ProductsRepository from "@/lib/Repositories/ProductsRepository";
import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";
import { unstable_noStore as noStore } from "next/cache";

export async function GET(req: any) {
  noStore();
  try {
    const productsRepository = new ProductsRepository();
    const { searchParams } = new URL(req.url || "");
    const pageParam = Number(searchParams.get("page") ?? "1");
    const pageSizeParam = Number(searchParams.get("pageSize") ?? "6");
    const queryParam = (
      searchParams.get("query") ??
      searchParams.get("q") ??
      ""
    ).trim();
    const sortParam = searchParams.get("sort") ?? "name_asc";

    const page = Number.isFinite(pageParam) && pageParam > 0 ? pageParam : 1;
    const pageSize =
      Number.isFinite(pageSizeParam) && pageSizeParam > 0 ? pageSizeParam : 6;
    if (queryParam.length > 0) {
      const result = await productsRepository.searchProductsByName(
        queryParam,
        page,
        pageSize,
        true,
        sortParam,
      );
      return NextResponse.json(
        {
          products: result.products,
          total: result.total,
          page,
          pageSize,
          query: queryParam,
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
      true,
      sortParam,
    );
    return NextResponse.json(
      { products: result.products, total: result.total, page, pageSize },
      { status: 200, headers: { "Cache-Control": "no-cache" } },
    );
  } catch (err) {
    return NextResponse.json(
      { msg: "Error trying to fetch products" },
      { status: 500 },
    );
  }
}
