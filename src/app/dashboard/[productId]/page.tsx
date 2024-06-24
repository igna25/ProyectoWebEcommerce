import { authOptions } from '@/app/api/auth/[...nextauth]/auth-config';
import ProductsRepository from '@/app/lib/Repositories/ProductsRepository';
import ProductDetails from '@/app/ui/dashboard/ProductDetails';
import { getServerSession, Session } from 'next-auth';
import { notFound } from 'next/navigation';


const ProductDetailsPage = async ({
    params,
  }: {
    params: {
      productId: string
      userID: string
    };
  }) => {
    
    const session: Session | null = await getServerSession(authOptions);
    const productsRepository = new ProductsRepository()

    const product = await productsRepository.getProductById(params.productId)
    
    if(!product) {
      notFound();
    }
    
  return (
    <div>

      <div className="container mx-auto px-4">
        {product? (
            <ProductDetails product={product} userID={session?.user.id} />
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

export default ProductDetailsPage;