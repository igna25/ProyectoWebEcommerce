import Image from "next/image";
import Link from "next/link";
import { ChevronLeftIcon } from "@heroicons/react/24/outline";
import AddToCartButton from "./AddToCartButton";
import { Product } from "@/lib/Entities/Product";

const ProductDetails = ({
  product,
  userID,
}: {
  product: Product;
  userID: string | undefined;
}) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors mb-8"
        >
          <ChevronLeftIcon className="w-4 h-4" />
          Volver al catálogo
        </Link>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex flex-col md:flex-row">
            <div className="md:w-1/2 relative aspect-[4/3] sm:aspect-square">
              <Image
                src={product.imageurl}
                alt={product.productname}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>

            <div className="md:w-1/2 p-5 sm:p-8 flex flex-col justify-between">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                  {product.productname}
                </h1>
                <p className="text-2xl sm:text-3xl font-extrabold text-[#004AAD] mb-4">
                  ${product.price}
                </p>
                <p className="text-gray-600 text-sm leading-relaxed mb-6">
                  {product.description}
                </p>
                <p className="text-sm text-gray-400">
                  Stock disponible:{" "}
                  <span className="font-semibold text-gray-600">
                    {product.stock}
                  </span>
                </p>
              </div>

              <div className="mt-8">
                <AddToCartButton product={product} userID={userID} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
