"use client"

import React, { Fragment, useState } from 'react';
import { Button, Dialog, DialogPanel, DialogTitle, Transition } from '@headlessui/react';
import { Product } from '@/app/lib/Entities/Product';

import Link from 'next/link';
import { addProductToCart } from '@/app/lib/actions/addProductToCart';
import { addProductToLocalStorage } from '@/app/lib/actions/addProductToLocalStorage';


function AddCartButton({ product, userID }: { product: Product, userID: string | undefined }) {

    let [isOpen, setIsOpen] = useState(false)
    const handleClick = () => {
        if (!userID) {
            addProductToLocalStorage(product);
        } else{
            addProductToCart(product, userID);
        }
            setIsOpen(true)
    };

    return (
        <Fragment>
            <Button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full" onClick={handleClick}>
                Agregar al carrito
            </Button><Transition
                show={isOpen}
                enter="duration-200 ease-out"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="duration-300 ease-out"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
            >
                <Dialog onClose={() => setIsOpen(false)} className="relative z-50 transition">
                    <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
                        <DialogPanel className="max-w-lg space-y-2 bg-white p-6 rounded-xl">
                            <DialogTitle className="font-bold">{product.productname} agregado al carrito</DialogTitle>
                            <div className="flex gap-4">
                                <button onClick={() => setIsOpen(false)} className="hover:bg-gray-200 rounded-md">
                                    Entendido, gracias</button>
                                <button onClick={() => setIsOpen(false)} className="hover:bg-gray-200 rounded-md">
                                    <Link href="/cart">Ir al carrito</Link>
                                </button>
                            </div>
                        </DialogPanel>
                    </div>
                </Dialog>
            </Transition>
        </Fragment>
    );
};

export default AddCartButton 