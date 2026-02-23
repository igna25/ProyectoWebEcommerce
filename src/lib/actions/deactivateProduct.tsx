"use server";
import { v2 as cloudinary } from "cloudinary";
import { revalidatePath } from "next/cache";
import ProductsRepository from "../Repositories/ProductsRepository";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function deactivateProduct(formData: FormData) {
  const id = String(formData.get("id"));
  const productsRepository = new ProductsRepository();
  try {
    const { updatedRows } = await productsRepository.changeProductActiveStatus(
      id,
      false,
    );
    revalidatePath("/admin/activos");
    if (updatedRows == 0) {
      return {
        success: false,
        msg: "Product Id not fount",
      };
    }

    return {
      success: true,
    };
  } catch (error) {
    return {
      mgs: "Error deleting a product",
      success: false,
    };
  }
}
