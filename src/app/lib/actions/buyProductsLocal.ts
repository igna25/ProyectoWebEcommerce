/*'use server';

import { OrderItem } from '../Entities/Order';
import { Product } from '../Entities/Product';
import CartsRepository from '../Repositories/CartsRepository';
import OrderItemsRepository from '../Repositories/OrdersRepository';
import ProductsRepository from '../Repositories/ProductsRepository';
import SalesRepository from '../Repositories/SalesRepository';
import SalesOrdersRepository from '../Repositories/SalesOrdersRepository';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import UsersRepository from '../Repositories/Usersrepository';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});


const cartsRepository = new CartsRepository();
const orderItemsRepository = new OrderItemsRepository();
const salesRepository = new SalesRepository()
const salesOrdersRepository = new SalesOrdersRepository()

export async function buyProductsLocal(formData: FormData): Promise<{ success: boolean, error?: string }> {
    const orderId = formData.get('orderId');
    const cartId = formData.get('cartId');
    const dateString = formData.get('date') as string;
    const date = new Date(dateString);
    const quantity = formData.get('quantity');
    const totalPrice = formData.get('totalPrice');
    //Campos Product
    const productId = formData.get('productId');
    const productName = formData.get('productName');
    const description = formData.get('description');
    const image = formData.get('image') as File;
    const productPrice = formData.get('productPrice');
    const publicationDateString = formData.get('publicationDate') as string;
    const publicationDate = new Date(publicationDateString);
    const productStock = formData.get('productStock');

    try {

        const usersRepository = new UsersRepository();
        const user = await usersRepository.getUsersByName('Guest User');
        const productsRepository = new ProductsRepository();
        const arrayBuffer = await image.arrayBuffer();
        const buffer = new Uint8Array(arrayBuffer);

        const result: UploadApiResponse | undefined = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream({ folder: "proyecto_web" }, function (error, result) {
                if (error) {
                    reject(error);
                    return;
                }
                resolve(result);
            }).end(buffer);
        });

        if (result != undefined) {
            const product = {
                id: String(productId),
                productname: String(productName),
                description: String(description),
                imageurl: result.url,
                imagekey: result.public_id,
                price: Number(productPrice),
                publicationdate: (publicationDate),
                stock: Number(productStock),
            };
            product.stock--;
            productsRepository.updateProduct(product);
        }

        const orderItem = {
            orderitemid: String(orderId),
            cartid: String(cartId),
            productid: String(productId),
            dateadded: (date),
            quantity: Number(quantity),
            productprice: Number(productPrice),
        }

        // Retrieve the cart and its items
        const cart = await cartsRepository.getCartByUserId(user.id);
        if (!!cart) {
            throw new Error(`Cart with ID ${cartId} not found.`);
        }

        const orderItems = await orderItemsRepository.getOrdersByCartId(orderItem.cartid)

        if (orderItems.length === 0) {
            throw new Error(`No order items found for cart ID ${cartId}.`);
        }

        // Calculate the total price
        const totalPrice = orderItems.reduce((sum, item) => sum + (item.productprice * item.quantity), 0);

        // Assuming we have a payment integration (like Mercado Pago)
        const paymentResult = await processPayment(totalPrice); // This function would handle the payment process
        if (!paymentResult.success) {
            throw new Error('Payment failed.');
        }

        // Update the cart with payment details
        await cartsRepository.updateCart(orderItem.cartid, totalPrice, paymentResult.mercadoPagoID);
        orderItems.map(async (order: (OrderItem & Product)) => {
            const saleId = await salesRepository.createSale(user.id, totalPrice, order.quantity, paymentResult.mercadoPagoID);
            salesOrdersRepository.createOrder(saleId, order.productid, order.quantity, totalPrice);
            orderItemsRepository.deleteOrderItem(order.id);

        })
        // Return success
        revalidatePath("/");
        return {
            success: true
        };

    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error('Failed to complete purchase:', error);
            return { success: false, error: error.message };
        } else {
            console.error('Failed to complete purchase:', error);
            return { success: false, error: 'Unknown error occurred' };
        }
    }
}

// Mock function for processing payment
async function processPayment(totalPrice: number): Promise<{ success: boolean, mercadoPagoID?: string }> {
    // Implement your payment processing logic here
    // For demonstration, we assume the payment is always successful and return a mock ID
    return { success: true, mercadoPagoID: 'MercadoPagoID' };
}
*/