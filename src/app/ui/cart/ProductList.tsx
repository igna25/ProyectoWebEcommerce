'use client'

import React, { useState, Fragment, useEffect } from 'react';
import Link from 'next/link';
import CartWrapper from './CartCard';
import { Product } from '@/app/lib/Entities/Product';
import { OrderItem } from '@/app/lib/Entities/Order';
import { removeProduct, increaseQuantity, decreaseQuantity, clearCart } from './../../lib/actions/cartActions';
import { buyProducts } from '@/app/lib/actions/buyProducts';
import { buyProductsLocal } from '@/app/lib/actions/buyProductsLocal';
import { useRouter } from 'next/navigation';
import { getCartProductsFromLocalStorage } from '@/app/lib/actions/getProductFromLocalStorage';

export default function ProductList({ cartProducts, userId }: { cartProducts: (OrderItem & Product)[], userId: string | undefined }) {

    const router = useRouter();
    const isLogged = userId != undefined

    const [products, setProducts] = useState<(OrderItem & Product)[]>(cartProducts || []);
    const [cartId, setCartId] = useState<string>('');

    useEffect(() => {
        if (isLogged) {
            if (cartProducts.length > 0) {
                setCartId(cartProducts[0].cartid);
            }
        } else {
            cartProducts = getCartProductsFromLocalStorage();
            setProducts(cartProducts);
        }

    }, [cartProducts])

    const handleRemoveProduct = async (orderitemid: string, productid:string) => {
        if (isLogged) {
            const handlerResult = await removeProduct(orderitemid, cartId);
            if (handlerResult.success) {
                const updatedProducts = products.filter(product => product.id !== orderitemid);
                setProducts(updatedProducts);
            }
        }
        else {
            const cartString = localStorage.getItem('cart');
            if (cartString) {
                const cart: (OrderItem & Product)[] = JSON.parse(cartString);
                const updatedCart = cart.filter(item => item.productid !== productid);
                localStorage.setItem('cart', JSON.stringify(updatedCart));
                setProducts(updatedCart);
            }
        }
    };

    const handleIncreaseQuantity = async (orderitemid: string, productid:string) => {
        if (isLogged) {
            const handlerResult = await increaseQuantity(orderitemid, cartId);
            if (handlerResult.success) {
                const updatedProducts = products.map(product =>
                    product.id == orderitemid ? { ...product, quantity: product.quantity + 1 } : product
                );
                setProducts(updatedProducts);
            }
        }
        else {
            const cartString = localStorage.getItem('cart');
            if (cartString) {
                const cart: (OrderItem & Product)[] = JSON.parse(cartString);
                const existingProductIndex = cart.findIndex((item: (OrderItem & Product)) => item.productid === productid);
                if (existingProductIndex !== -1) {
                    cart[existingProductIndex].quantity++;
                    localStorage.setItem('cart', JSON.stringify(cart));
                    setProducts(cart);
                };

            }
        }
    };

    const handleDecreaseQuantity = async (orderitemid: string, productid:string) => {
        if (isLogged) {
            const handlerResult = await decreaseQuantity(orderitemid, cartId);
            if (handlerResult.success) {
                const updatedProducts = products.map(product =>
                    product.id == orderitemid && product.quantity > 1 ? { ...product, quantity: product.quantity - 1 } : product
                );
                setProducts(updatedProducts);
            }
        }
        else {
            const cartString = localStorage.getItem('cart');
            if (cartString) {
                const cart: (OrderItem & Product)[] = JSON.parse(cartString);
                const existingProductIndex = cart.findIndex((item: (OrderItem & Product)) => item.productid == productid && item.quantity > 1);
                if (existingProductIndex !== -1) {
                    cart[existingProductIndex].quantity--;
                    localStorage.setItem('cart', JSON.stringify(cart));
                    setProducts(cart);
                };

            }
        }
    };

    const handleClearCart = async () => {
        if (isLogged) {
            const handlerResult = await clearCart(cartId);
            if (handlerResult.success) {
                setProducts([]);
            }
        }
        else {
            const cartString = localStorage.getItem('cart');
            if (cartString) {
                localStorage.removeItem('cart')
                setProducts([]);
            }
        }
    };

    const handleSubmit = async () => {

        try {
            const formData: FormData = new FormData()

            products.map((product: (OrderItem & Product)) => {
                //Campos orderItem
                formData.append('orderId', product.id)
                formData.append('cartId', product.cartid)
                formData.append('date', product.dateadded.toString())
                formData.append('quantity', String(product.quantity))
                formData.append('orderItemPrice', String(product.productprice))
                //Campos Product
                formData.append('productId', product.productid)
                formData.append('productName', product.productname)
                formData.append('description', product.description)
                formData.append('image', product.imageurl)
                formData.append('productPrice', String(product.price))
                formData.append('publicationDate', product.publicationdate.toString())
                formData.append('productStock', String(product.stock))
                formData.append('productActive', String(product.active))

            })

            let result
            if (isLogged) {
                result = await buyProducts(userId)
                if (result.success && result.redirectUrl) {
                    router.push(result.redirectUrl);
                } else {
                    console.error('Error during purchase:');
                }
            }
            else {
               result = await buyProductsLocal(products);
                if (result.success && result.redirectUrl) {
                    router.push(result.redirectUrl); 
                    console.log("compra exitosa")
                } else {
                    console.error('Error during purchase:');
                }

            }

        } catch (error) {
            console.error('Error al enviar datos:', error);
        }
    };

    return (
        <Fragment>
            <div className="container grid md:grid-cols-2 lg:grid-cols-2 gap-4 px-4 md:px-6 mt-3">
                <div className="grid gap-4">
                    {
                        products.length > 0
                            ? (
                                <Fragment>
                                    {products.map((product: (OrderItem & Product)) => (
                                        <CartWrapper
                                            key={product.id}
                                            product={product}
                                            isLogged={isLogged}
                                            onIncrease={() => handleIncreaseQuantity(product.id, product.productid)}
                                            onDecrease={() => handleDecreaseQuantity(product.id, product.productid)}
                                            onRemove={() => handleRemoveProduct(product.id, product.productid)}
                                        />
                                    ))}
                                    <div className="flex-1 flex mt-4">
                                        <button
                                            onClick={handleClearCart}
                                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-400 focus:outline-none">
                                            Limpiar carrito
                                        </button>
                                    </div>
                                </Fragment>
                            ) : (
                                <div className="text-center border-2 border-dashed p-6 grid grid-rows-2 border-gray-200 rounded-lg">
                                    <p className="text-2xl">Carrito vacío</p>
                                    <Link href="/dashboard">
                                        <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-400">
                                            Volver al dashboard
                                        </button>
                                    </Link>
                                </div>
                            )
                    }
                </div>
                <div className="w-full lg:w-3/4 bg-white rounded-lg p-6 flex flex-col justify-between shadow-xl shadow-slate-300">
                    <h2 className="text-2xl font-bold">Resumen de compra</h2>
                    <div className="flex flex-col gap-2">
                        {products.map(product => (
                            <div key={product.id} className="flex justify-between">
                                <p>{product.productname}</p> X {product.quantity}
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between mt-4 border-t pt-6">
                        <p className="text-xl font-bold">Total:</p>
                        <p className="text-4xl">${products.reduce((acc, product) => acc + product.productprice * product.quantity, 0).toFixed(2)}</p>
                    </div>
                    {products.length > 0 && (
                        <button
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-400 text-center"
                            onClick={handleSubmit}
                        >
                            Comprar
                        </button>
                    )}
                </div>
            </div>
        </Fragment>
    );
}
