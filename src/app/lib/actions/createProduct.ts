'use server';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import ProductsRepository from '../Repositories/ProductsRepository';
import { revalidatePath } from 'next/cache';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function createProduct(formData: FormData) {
  const errors: { [key: string]: string } = {};

  const productName = formData.get('productName');
  const description = formData.get('description');
  const price = formData.get('price');
  const stock = formData.get('stock');
  const image = formData.get('image') as File;

  if (!productName || typeof productName !== 'string' || productName.length < 3) {
    errors.productName = 'Product name must be at least 3 characters long';
  }
  if (!description || typeof description !== 'string' || description.length < 20) {
    errors.description = 'Description must be at least 20 characters long';
  }
  if (!price || isNaN(Number(price)) || Number(price) <= 0) {
    errors.price = 'Price must be a positive number';
  }
  if (!stock || isNaN(Number(stock)) || Number(stock) < 0) {
    errors.stock = 'Stock must be a non-negative number';
  }
  if (!image) {
    errors.image = 'An image must be selected';
  }

  if (Object.keys(errors).length > 0) {
    return {
      success: false,
      errors,
    };
  }

  try {
    const productsRepository = new ProductsRepository();
    const arrayBuffer = await image.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);

    const result: UploadApiResponse | undefined = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream({ folder: "proyecto_web" }, function (error, result) {
        if (error) {
          reject(error);
          return;
        }
        resolve(result);
      }).end(buffer);
    });

    if (result != undefined) {
      const product = {
        productName: String(productName),
        description: String(description),
        imageURL: result.url,
        imageKey: result.public_id,
        price: Number(price),
        stock: Number(stock),
      };

      await productsRepository.createProduct(product);
    }
    revalidatePath("/");
    return {
      success: true,
    };

  } catch (error) {
    console.log(error);
    return {
      success: false,
      msg: "Error creating product"
    };
  }
}
