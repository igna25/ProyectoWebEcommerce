import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { getAdminSummary } from "@/lib/services/AdminService";

export const dynamic = "force-dynamic";

export async function GET(req: any) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token || token.role !== "admin") {
      return NextResponse.json({ msg: "Unauthorized" }, { status: 401 });
    }

    const summary = await getAdminSummary();

    return NextResponse.json(summary, {
      status: 200,
      headers: { "Cache-Control": "no-cache" },
    });
  } catch (err) {
    console.error("Error fetching summary:", err);
    return NextResponse.json(
      { msg: "Error trying to fetch summary" },
      { status: 500 },
    );
  }
}
