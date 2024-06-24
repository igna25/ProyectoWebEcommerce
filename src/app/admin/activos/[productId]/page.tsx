import ProductsRepository from '@/app/lib/Repositories/ProductsRepository';
import EditProductForm from '../../../ui/admin/UpdateComponent';

const EditProductPage = async ({
    params,
  }: {
    params: {
      productId: string
    };
  }) => {

    const productsRepository = new ProductsRepository()

    const product = await productsRepository.getProductById(params.productId)
    
  return (
    <div>

      <div className="container mx-auto px-4">
        {product? (
            <EditProductForm product={product} />
        ) : (
            <div className="h-screen flex items-center justify-center bg-gray-100">
                <div className="text-center text-gray-700">
                    <p className="text-xl">Lo sentimos, parece que el producto no existe.</p>
                </div>
            </div>
        )}
    </div>
    </div>
  );
};

export default EditProductPage;