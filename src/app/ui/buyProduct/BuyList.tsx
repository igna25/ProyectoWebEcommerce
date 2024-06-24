'use client';

import React, { Fragment, useState } from 'react';
import Link from 'next/link';
import { Product } from '@/app/lib/Entities/Product';
import { OrderItem } from '@/app/lib/Entities/Order';
import { buyProducts } from '@/app/lib/actions/buyProducts';
import Image from 'next/image';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import clsx from 'clsx';
//import { buyProductsLocal } from '@/app/lib/actions/buyProductsLocal';

interface BuyListProps {
    products: (OrderItem & Product)[];
    userId: string | undefined;
}

export const BuyList: React.FC<BuyListProps> = ({ products, userId }) => {

    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const validate = () => {
        const newErrors: { [key: string]: string } = {};

        //if (!stock || isNaN(Number(stock)) || Number(stock) < 1) newErrors.stock = 'No hay stock del producto';

        return newErrors;
    };


    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setIsSubmitting(true);
        try {
            const formData: FormData = new FormData()

            products.map((product: (OrderItem & Product)) => {
                //userId recibido por parámetro desde page obteniendo el usuario especial??

                //Campos orderItem
                formData.append('orderId', product.id)
                formData.append('cartId', product.cartid)
                formData.append('date', product.dateadded.toISOString())
                formData.append('quantity', String(product.quantity))
                formData.append('totalPrice', String(product.price))
                //Campos Product
                formData.append('productId', product.productid)
                formData.append('productName', product.productname)
                formData.append('description', product.description)
                formData.append('image', product.imageurl)
                formData.append('productPrice', String(product.productprice))
                formData.append('publicationDate', product.publicationdate.toISOString())
                formData.append('productStock', String(product.stock))

            })

            let result = {success:false}
            if (userId == (null || undefined)) {
                //TODO agregar la compra local 
                //result = await buyProductsLocal(formData);
            }
            else {
                result = await buyProducts(userId)
            }

            if (result.success) {
                toast.success('Compra exitosa', { position: "top-right" });
            } else {
                toast.error('Error al comprar', { position: "top-right" });
            }
        } catch (error) {
            console.error('Error al enviar datos:', error);
            toast.error('Error al enviar datos', { position: "top-right" });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Fragment>
            <div className="container grid md:grid-cols-2 gap-1 px-4 md:px-6 mt-3">
                <ToastContainer />
                <div className="grid gap-0">
                    {
                        products.length > 0
                            ? (
                                products.map((product: (OrderItem & Product)) => {
                                    return (
                                        <div key={product.id} className="max-w-sm rounded overflow-hidden shadow-lg bg-gray-200 m-4 flex">
                                            <Image src={product.imageurl} alt={product.productname} className="w-16 h-16 object-cover" width={64} height={64} />
                                            <div className="font-bold text-xl mb-2">{product.productname}
                                                <p className="text-gray-700 text-base mb-2">Precio unitario: ${product.productprice}</p>
                                                <p className="text-gray-700 text-base mb-2">Cantidad: {product.quantity}</p>
                                                <p className="text-gray-700 text-base mb-2">Total: ${(product.productprice * product.quantity).toFixed(2)}</p>
                                            </div>
                                        </div>
                                    )
                                })
                            ) : (
                                <div className="text-center border-2 border-dashed p-6 grid grid-rows-2 border-gray-200 rounded-lg">
                                    <p className="text-2xl">No hay productos en el carrito.</p>
                                </div>
                            )
                    }
                </div>
                <div className="w-full md:w-1/3 lg:w-3/4 bg-gray-100 dark:bg-gray-800 rounded-lg p-6 flex flex-col justify-between shadow-xl shadow-slate-300">
                    <h2 className="text-2xl font-bold">Resumen de compra</h2>
                    <div className="flex flex-col gap-2">
                        {products.map(product => (
                            <div key={product.id} className="flex justify-between">
                                <p>{product.productname}</p> X {product.quantity}
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between mt-4 border-t py pt-6">
                        <p className="text-xl font-bold">Total:</p>
                        <p className="text-4xl">${products.reduce((acc, product) => acc + product.productprice * product.quantity, 0)}</p>
                    </div>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={clsx(
                                'mt-4 w-full rounded-lg py-2 text-white font-bold focus:outline-none focus:ring-2 focus:ring-offset-2',
                                isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-700 focus:ring-blue-500'
                            )}
                        >
                            {isSubmitting ? 'Enviando...' : 'Comprar'}
                        </button>

                    </form>
                </div>
            </div>
        </Fragment>
    );
}
