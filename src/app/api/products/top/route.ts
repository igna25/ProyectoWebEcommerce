import ProductsRepository from '@/app/lib/Repositories/ProductsRepository'
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const productsRepository = new ProductsRepository();
        const products = await productsRepository.getTopSellingProducts();
        return NextResponse.json({ products }, { status: 200 });
    } catch (err) {
        return NextResponse.json({ msg: 'Error trying to fetch top products' }, { status: 500 });
    }
}


