"use client";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import SaleSummary from "@/app/ui/buyProduct/SaleSummary";
import Pagination from "@/app/ui/dashboard/Pagination";
import Link from "next/link";

function BuysPageContent() {
  const searchParams = useSearchParams();
  const { data: session } = useSession();
  const [sales, setSales] = useState<any[]>([]);
  const [totalPages, setTotalPages] = useState<number>(1);
  const currentPage = Number(searchParams.get("page") || "1");
  const ITEMS_PER_PAGE = 5;

  useEffect(() => {
    const load = async () => {
      if (!session?.user?.id) return;
      const res = await fetch(
        `/api/sales/user?userId=${session.user.id}&page=${currentPage}&pageSize=${ITEMS_PER_PAGE}`,
      );
      const json = await res.json();
      setSales(
        (json.sales || []).filter((s: any) => s.userid === session.user.id),
      );
      setTotalPages(Math.max(1, Math.ceil((json.total || 0) / ITEMS_PER_PAGE)));
    };
    load();
  }, [session?.user?.id, currentPage]);

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="max-w-4xl mx-auto mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
          Mis compras
        </h1>
        <Link
          href="/dashboard"
          className="self-start sm:self-auto px-5 py-2 bg-[#004AAD] hover:bg-[#003d8f] text-white text-sm font-semibold rounded-xl transition-colors"
        >
          Seguir comprando
        </Link>
      </div>

      {sales.length === 0 ? (
        <div className="flex items-center justify-center py-24">
          <div className="text-center text-gray-500">
            <p className="text-lg">Todavía no realizaste ninguna compra.</p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center">
          <div className="w-full max-w-4xl">
            {sales.map((sale) => (
              <div key={sale.id} className="w-full items-center">
                <SaleSummary sale={sale} />
              </div>
            ))}
          </div>
          <Pagination totalPages={totalPages} currentPage={currentPage} />
        </div>
      )}
    </div>
  );
}

export default function BuysPage() {
  return (
    <Suspense>
      <BuysPageContent />
    </Suspense>
  );
}
