import React from 'react';
import { Product } from '@/app/lib/Entities/Product';
import DeleteButton from './deleteButton';
import { PHASE_PRODUCTION_BUILD } from 'next/dist/shared/lib/constants';

const ProductCard = ({ product, children }:{product:Product, children?: React.ReactNode}) => {
  return (
    <div className="max-w-sm rounded overflow-hidden shadow-lg bg-white m-4 flex flex-col">
      <img src={product.imageurl} alt={product.productname} className="w-full h-48 sm:h-64 object-cover" />
      <div className="px-6 py-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="font-bold text-xl mb-2">{product.productname}</div>
          <div className="flex justify-between items-center mb-2">
            <p className="text-gray-700 text-base">${product.price}</p>
            <p className="text-gray-700 text-base">Stock: {product.stock}</p>
          </div>
        </div>
        <div className="flex space-x-2">
          {children}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
