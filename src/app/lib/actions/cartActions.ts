'use server';

import { revalidatePath } from 'next/cache';
import CartsRepository from '../Repositories/CartsRepository';
import OrderItemsRepository from '../Repositories/OrdersRepository';
import { OrderItem } from '../Entities/Order';
import { Product } from '../Entities/Product';

const cartsRepository = new CartsRepository();
const orderItemsRepository = new OrderItemsRepository();

export const removeProduct = async (orderitemid: string, cartId: string) => {
    const orderItem = await orderItemsRepository.getOrderItemById(orderitemid);
    try {
        if (orderItem) {
            await orderItemsRepository.deleteOrderItem(orderitemid);
            const updatedOrderItems = await orderItemsRepository.getOrdersByCartId(cartId);
    
            if (updatedOrderItems.length === 0) {
                await cartsRepository.deleteCart(cartId);
            } else {
                const updatedCartTotal = updatedOrderItems.reduce((acc, product) => acc + product.productprice * product.quantity, 0);
                await cartsRepository.updateCart(cartId, updatedCartTotal);
            }
        }
        revalidatePath('/')
        return {
            success: true
        }
    }
    catch (error) {
        return {
            mgs: "Error deleting a product",
            success: false
        }
    }
};

export const increaseQuantity = async (orderitemid: string, cartId: string) => {
    
    
    const orderItem = await orderItemsRepository.getOrderItemById(orderitemid);
    try {
        if (orderItem) {
            await orderItemsRepository.updateOrderItem(orderitemid, orderItem.quantity + 1, orderItem.productprice);
            const updatedOrderItems = await orderItemsRepository.getOrdersByCartId(cartId);
            const updatedCartTotal = updatedOrderItems.reduce((acc, product) => acc + product.productprice * product.quantity, 0);
            await cartsRepository.updateCart(cartId, updatedCartTotal, "abc");
        }
        revalidatePath('/')
        return {
            success: true
        }
    }
    catch (error) {
        return {
            mgs: "Error deleting a product",
            success: false
        }
    }
};

export const decreaseQuantity = async (orderitemid: string, cartId: string) => {
    const orderItem = await orderItemsRepository.getOrderItemById(orderitemid);
    try {
        if (orderItem && orderItem.quantity > 1) {
            await orderItemsRepository.updateOrderItem(orderitemid, orderItem.quantity - 1, orderItem.productprice);
            const updatedOrderItems = await orderItemsRepository.getOrdersByCartId(cartId);
            const updatedCartTotal = updatedOrderItems.reduce((acc, product) => acc + product.productprice * product.quantity, 0);
            await cartsRepository.updateCart(cartId, updatedCartTotal, "abc");
        }
        revalidatePath('/')
        return {
            success: true
        }
    }
    catch (error) {
        return {
            mgs: "Error deleting a product",
            success: false
        }
    }
};

export const clearCart = async (cartId: string) => {
    const orderItems = await orderItemsRepository.getOrdersByCartId(cartId);
    try {
        for (const orderItem of orderItems) {
            await orderItemsRepository.deleteOrderItem(orderItem.id);
        }
        await cartsRepository.updateCart(cartId, 0, "abc");
        await cartsRepository.deleteCart(cartId)
        revalidatePath('/')
        return {
            success: true
        }
    }
    catch (error) {
        return {
            mgs: "Error deleting a product",
            success: false
        }
    }
};
