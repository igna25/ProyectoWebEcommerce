import ProductsRepository from '@/app/lib/Repositories/ProductsRepository'
import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';

export async function GET(req: any) {
    try {
        const productsRepository = new ProductsRepository();
        const { searchParams } = new URL(req.url || "");
        const pageParam = Number(searchParams.get('page') ?? '1');
        const pageSizeParam = Number(searchParams.get('pageSize') ?? '6');
        const queryParam = (searchParams.get('query') ?? searchParams.get('q') ?? '').trim();

        const page = Number.isFinite(pageParam) && pageParam > 0 ? pageParam : 1;
        const pageSize = Number.isFinite(pageSizeParam) && pageSizeParam > 0 ? pageSizeParam : 6;
        if (queryParam.length > 0) {
            const result = await productsRepository.searchProductsByName(queryParam, page, pageSize, true);
            return NextResponse.json({ products: result.products, total: result.total, page, pageSize, query: queryParam}, { status: 200 });
        }
        const result = await productsRepository.getAllProductsPaginated(page, pageSize, true);
        return NextResponse.json({ products: result.products, total: result.total, page, pageSize }, { status: 200 });
    } catch (err) {
        return NextResponse.json({ msg: 'Error trying to fetch products' }, { status: 500 });
    }
}