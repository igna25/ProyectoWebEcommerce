'use server';

import UsersRepository from '../Repositories/Usersrepository';
import { revalidatePath } from 'next/cache';
import { MercadoPagoConfig, Preference } from 'mercadopago';
import { z } from 'zod';
import { OrderItem } from '../Entities/Order';
import { Product } from '../Entities/Product';
import processPayment from './processPayment';
import CartsRepository from '../Repositories/CartsRepository';
import OrderItemsRepository from '../Repositories/OrdersRepository';

const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN || "" });
const cartsRepository = new CartsRepository();
const ordersItemsRepository = new OrderItemsRepository();

export async function buyProductsLocal(cartProducts: (OrderItem & Product)[]): Promise<{ success: boolean, redirectUrl: string | undefined }> {

    try {
        const usersRepository = new UsersRepository();
        const user = await usersRepository.getUsersByName('Guest User');

        const orders: (OrderItem & Product)[] = cartProducts.map((cartProduct) => ({
            //orderItem
            id: cartProduct.id,
            cartid: cartProduct.cartid,
            productid: cartProduct.productid,
            dateadded: cartProduct.dateadded,
            quantity: cartProduct.quantity,
            productprice: cartProduct.price,
            //product
            productname: cartProduct.productname,
            description: cartProduct.description,
            imageurl: cartProduct.imageurl,
            imagekey: cartProduct.imagekey,
            price: cartProduct.price,
            publicationdate: cartProduct.publicationdate,
            stock: cartProduct.stock,
            active: cartProduct.active,
        }));
        const totalPrice = orders.reduce((total, item) => total + item.quantity * item.productprice, 0);

        const cartId = await cartsRepository.createCart(user.id, totalPrice, 'abc');
        if (cartId == (null || undefined)) {
            throw new Error('Cart not found.');
        }
        else {
            cartProducts.map((cartProduct: (OrderItem & Product)) => (
                ordersItemsRepository.createOrderItem(cartId, cartProduct.productid, cartProduct.quantity, cartProduct.price)
            ));

            const orderItems = await ordersItemsRepository.getOrdersByCartId(cartId);
            if (orderItems.length === 0) {
                throw new Error(`No order items found for cart ID ${cartId}.`);
            }
            const items = orderItems.map((orderItem) => {
                return {
                    id: orderItem.productid,
                    title: orderItem.productname,
                    quantity: orderItem.quantity,
                    unit_price: parseFloat(orderItem.productprice + "")
                }
            })
            console.log(items)
            // ACA USAR PROCESS PAYMENT Y NO LO DE ABAJO
            // const preference = await (new Preference(client)).create(
            //     {
            //         body: {
            //             items,
            //             back_urls: {
            //                 success: "https://proyecto-web-vercel.vercel.app/",
            //                 pending: "https://proyecto-web-vercel.vercel.app/",
            //                 failure: "https://proyecto-web-vercel.vercel.app/"
            //             },
            //             auto_return: 'approved',
            //             metadata: {
            //                 cartid: cart.id,
            //             }
            //         },
            //     })
            //ESTO NO ^^
            if (await processPayment(cartId, "payimentID")) {
                revalidatePath('/')
                return {
                    success: true,
                    redirectUrl: "/",//preference.sandbox_init_point // ACA PONER STRING VACIO
                };

            } else {               
                return {
                    success: false,
                    redirectUrl: undefined,
                };
            }
        }
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error('Failed to complete purchase:', error);
            return { success: false, redirectUrl: undefined };
        } else {
            console.error('Failed to complete purchase:', error);
            return { success: false, redirectUrl: undefined };
        }
    }
}
