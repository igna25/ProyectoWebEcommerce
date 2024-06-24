import React, { Fragment } from 'react';
import Image from 'next/image';
import AddToCartButton from './AddToCartButton';
import { Product } from '@/app/lib/Entities/Product';
import Link from 'next/link';

const ProductDetails = ({ product, userID }: { product: Product, userID: string | undefined }) => {
    return (
        <Fragment>
            <div className="pt-2 flex-1 flex">
                <button className="bg-gray-100 text-gray-500 font-semibold px-4 rounded hover:bg-gray-200 focus:outline-none">
                    <Link href="/dashboard">
                        {"<"} Volver al dashboard
                    </Link>
                </button>
            </div>
            <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">

                <div className="flex flex-col md:flex-row md:space-x-6">
                    <div className="md:w-1/2">
                        <Image src={product.imageurl} alt={product.productname} width={500} height={500} className="object-contain" />
                    </div>
                    <div className="md:w-1/2 mt-4 md:mt-0">
                        <h2 className="text-gray-800 text-2xl font-semibold mb-2">{product.productname}</h2>
                        <p className="text-gray-700 text-base mb-4">${product.price}</p>
                        <p className="text-gray-800 text-base mb-4">{product.description}</p>
                        <AddToCartButton product={product} userID={userID} />
                    </div>
                </div>
            </div>
        </Fragment>
    );
};

export default ProductDetails;
