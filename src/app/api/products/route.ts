import ProductsRepository from '@/app/lib/Repositories/ProductsRepository'
import { NextResponse } from 'next/server';
 
export async function GET(
    req: any
) {
    try {
        const producstRepository = new ProductsRepository()
        const { searchParams } = new URL(req.url || "")
        const id = searchParams.get('id')
        if(id!=null){
            const product = await producstRepository.getProductById(id)
            return NextResponse.json({ product }, { status: 200 });
        }
        else{
            const products = await producstRepository.getAllProducts()
            return NextResponse.json({ products }, { status: 200 });
        }
    } 
    catch (err) {
        return NextResponse.json({ msg: "Error trying to fetch products" }, { status: 500 });
    }
}

export const revalidate = 60