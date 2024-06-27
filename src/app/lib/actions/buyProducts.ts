'use server';

import { OrderItem } from '../Entities/Order';
import { Product } from '../Entities/Product';
import CartsRepository from '../Repositories/CartsRepository';
import OrderItemsRepository from '../Repositories/OrdersRepository';
import ProductsRepository from '../Repositories/ProductsRepository';
import SalesRepository from '../Repositories/SalesRepository';
import SalesOrdersRepository from '../Repositories/SalesOrdersRepository';
import { revalidatePath } from 'next/cache';
import { MercadoPagoConfig, Preference } from 'mercadopago';
import { title } from 'process';
import { redirect } from 'next/navigation';

const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN || "" });
const productsRepository = new ProductsRepository();
const cartsRepository = new CartsRepository();
const orderItemsRepository = new OrderItemsRepository();
const salesRepository = new SalesRepository()
const salesOrdersRepository = new SalesOrdersRepository()

export async function buyProducts(userID: string): Promise<{ success: boolean, redirectUrl:string | undefined}> {
    try {
        const cart = await cartsRepository.getCartByUserId(userID);
        if (cart == (null || undefined)) {
            throw new Error(`Cart with not found.`);
        }
        else {
            const orderItems = await orderItemsRepository.getOrdersByCartId(cart.id);
            
            if (orderItems.length === 0) {
                throw new Error(`No order items found for cart ID ${cart.id}.`);
            }
            const items = orderItems.map((orderItem)=>{
                return {
                    id:orderItem.productid,
                    title: orderItem.productname,
                    quantity:orderItem.quantity,
                    unit_price: parseFloat(orderItem.productprice+"")
                }
            })
            console.log(items)
            const preference = await (new Preference(client)).create(
                {
                body: {
                    items,
                    back_urls: {
                        success: "https://proyecto-web-vercel.vercel.app/",
                        failure:"https://proyecto-web-vercel.vercel.app/"
                    },
                    metadata: {
                        cartid: cart.id,
                    }
                },
                
            })
            console.log(preference)
            return {
                success: true,
                redirectUrl: preference.sandbox_init_point
            };

        }
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error('Failed to complete purchase:', error);
            return { success: false ,redirectUrl:undefined};
        } else {
            console.error('Failed to complete purchase:', error);
            return { success: false, redirectUrl:undefined};
        }
    }
}