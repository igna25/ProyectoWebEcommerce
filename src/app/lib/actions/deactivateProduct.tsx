'use server';
import { v2 as cloudinary,UploadApiResponse } from 'cloudinary';
import ProductsRepository from '../Repositories/ProductsRepository';
import { revalidatePath } from 'next/cache';

cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  })
  

export async function deactivateProduct(formData: FormData) {
    const id = String(formData.get('id'))
    const imageId = String(formData.get('imageId'))
    const productsRepository = new ProductsRepository()
    try{
        const {updatedRows} = await productsRepository.changeProductActiveStatus(id,false)

        if(updatedRows == 0){
            return {
                success:false,
                msg: "Product Id not fount"
            }
        }
        revalidatePath('/')
        return{
            success:true
        }
    }
    catch(error){
        return{
            mgs: "Error deleting a product",
            success:false
        }
    }

}