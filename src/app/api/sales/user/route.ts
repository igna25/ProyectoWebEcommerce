import SalesRepository from '@/app/lib/Repositories/SalesRepository'
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(req: any) {
  try {
    const { searchParams } = new URL(req.url || "");
    const userId = (searchParams.get('userId') || '').trim();
    const pageParam = Number(searchParams.get('page') ?? '1');
    const pageSizeParam = Number(searchParams.get('pageSize') ?? '5');
    const page = Number.isFinite(pageParam) && pageParam > 0 ? pageParam : 1;
    const pageSize = Number.isFinite(pageSizeParam) && pageSizeParam > 0 ? pageSizeParam : 5;
    const salesRepository = new SalesRepository();
    const result = await salesRepository.getAllSalesPaginatedWithUserId(page, pageSize, userId);
    return NextResponse.json({ sales: result.sales, total: result.total, page, pageSize, userId }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ msg: 'Error trying to fetch user sales' }, { status: 500 });
  }
}


