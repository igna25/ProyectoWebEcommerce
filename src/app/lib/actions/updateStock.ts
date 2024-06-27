'use server';
import ProductsRepository from '../Repositories/ProductsRepository';
import { revalidatePath } from 'next/cache';


export async function updateStock({productId, newStock}:{productId:string, newStock:number}) {
    const productsRepository = new ProductsRepository()
    try{
        const {updatedRows} =await productsRepository.updateStock(productId, newStock)
        revalidatePath('/')
        
        if(updatedRows == 0){
            return {
                success:false,
                msg: "Product id not fount"
            }
        }
        return{
            success:true
        }
    }
    catch(error){
        return{
            msg: "Error activating product",
            success:false
        }
    }

}