import SalesRepository from "@/lib/Repositories/SalesRepository";
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export const dynamic = "force-dynamic";

export async function GET(req: any) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token || token.role !== "admin") {
      return NextResponse.json({ msg: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url || "");
    const pageParam = Number(searchParams.get("page") ?? "1");
    const pageSizeParam = Number(searchParams.get("pageSize") ?? "5");

    const page = Number.isFinite(pageParam) && pageParam > 0 ? pageParam : 1;
    const pageSize =
      Number.isFinite(pageSizeParam) && pageSizeParam > 0 ? pageSizeParam : 5;

    const salesRepository = new SalesRepository();
    const { sales, total } = await salesRepository.getAllSalesPaginated(
      page,
      pageSize,
    );

    return NextResponse.json(
      { sales, total, page, pageSize },
      { status: 200, headers: { "Cache-Control": "no-cache" } },
    );
  } catch (err) {
    console.error("Error fetching sales:", err);
    return NextResponse.json(
      { msg: "Error trying to fetch sales" },
      { status: 500 },
    );
  }
}
