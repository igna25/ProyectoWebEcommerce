"use client";
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import SaleSummary from '@/app/ui/buyProduct/SaleSummary';
import Pagination from '@/app/ui/dashboard/Pagination';

export default function BuysPage() {
  const searchParams = useSearchParams();
  const { data: session } = useSession();
  const [sales, setSales] = useState<any[]>([]);
  const [totalPages, setTotalPages] = useState<number>(1);
  const currentPage = Number(searchParams.get('page') || '1');
  const ITEMS_PER_PAGE = 5;

  useEffect(() => {
    const load = async () => {
      if (!session?.user?.id) return;
      const res = await fetch(`/api/sales/user?userId=${session.user.id}&page=${currentPage}&pageSize=${ITEMS_PER_PAGE}`);
      const json = await res.json();
      setSales((json.sales || []).filter((s: any) => s.userid === session.user.id));
      setTotalPages(Math.max(1, Math.ceil((json.total || 0) / ITEMS_PER_PAGE)));
    };
    load();
  }, [session?.user?.id, currentPage]);

  return (
    <div className="container mx-auto px-4">
      {sales.length === 0 ? (
        <div className="h-screen flex items-center justify-center bg-gray-100">
          <div className="text-center text-gray-700">
            <p className="text-xl">Parece que no encontramos resultados para su búsqueda...</p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center">
          <div className="w-full max-w-4xl mx-4 ">
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
