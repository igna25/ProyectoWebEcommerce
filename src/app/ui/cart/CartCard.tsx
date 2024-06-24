"use client";

import React, { Fragment } from 'react';
import Image from 'next/image';
import { Product } from '@/app/lib/Entities/Product';
import { OrderItem } from '@/app/lib/Entities/Order';

interface CartWrapperProps {
    product: (Product&OrderItem);
    isLogged: boolean;
    onIncrease: (id: string) => void;
    onDecrease: (id: string) => void;
    onRemove: (id: string) => void;
}

const CartWrapper: React.FC<CartWrapperProps> = ({ product, isLogged, onIncrease, onDecrease, onRemove }) => {

    return (
        <Fragment>
            <div className="bg-white rounded-lg shadow-lg p-4 m-4 flex flex-col md:flex-row items-center hover:shadow-xl transition-shadow">
                <Image src={product.imageurl} alt={product.productname} className="w-16 h-16 object-cover rounded-full" width={64} height={64} />
                <div className="flex-1 flex flex-col justify-between px-4 mt-2 md:mt-0">
                    <div>
                        <div className="font-bold text-xl mb-2">{product.productname}</div>
                        <p className="text-gray-700 text-base mb-2">Precio unitario: ${product.productprice}</p>
                        <p className="text-gray-700 text-base mb-2">Total: ${(product.productprice * product.quantity).toFixed(2)}</p>
                    </div>
                    <div className="flex items-center mt-2 md:mt-0">
                        <button 
                            className="bg-gray-300 text-gray-700 px-2 py-1 rounded hover:bg-gray-400"
                            onClick={() => onDecrease(product.id)}
                        >
                            -
                        </button>
                        <span className="mx-2">{product.quantity}</span>
                        <button 
                            className="bg-gray-300 text-gray-700 px-2 py-1 rounded hover:bg-gray-400"
                            onClick={() => onIncrease(product.id)}
                        >
                            +
                        </button>
                        <button 
                            className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-400 ml-4"
                            onClick={() => onRemove(product.id)}
                        >
                            Quitar producto
                        </button>
                    </div>
                </div>
            </div>
        </Fragment>
    );
};


export default CartWrapper;