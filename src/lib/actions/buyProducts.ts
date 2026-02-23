"use server";

import { MercadoPagoConfig, Preference } from "mercadopago";
import CartsRepository from "../Repositories/CartsRepository";
import OrderItemsRepository from "../Repositories/OrdersRepository";
const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN || "",
});
const cartsRepository = new CartsRepository();
const orderItemsRepository = new OrderItemsRepository();
export async function buyProducts(
  userID: string,
): Promise<{ success: boolean; redirectUrl: string | undefined }> {
  try {
    const cart = await cartsRepository.getCartByUserId(userID);
    if (!cart) {
      throw new Error(`Cart not found`);
    } else {
      const orderItems = await orderItemsRepository.getOrdersByCartId(cart.id);

      if (orderItems.length === 0) {
        throw new Error(`No order items found for cart ID ${cart.id}.`);
      }
      const items = orderItems.map((orderItem) => {
        return {
          id: orderItem.productid,
          title: orderItem.productname,
          quantity: orderItem.quantity,
          unit_price: parseFloat(orderItem.productprice + ""),
        };
      });
      console.log(items);
      const preference = await new Preference(client).create({
        body: {
          items,
          back_urls: {
            success: "https://proyecto-web-vercel.vercel.app/",
            failure: "https://proyecto-web-vercel.vercel.app/",
          },
          metadata: {
            cartid: cart.id,
          },
        },
      });
      console.log(preference);
      return {
        success: true,
        redirectUrl: preference.sandbox_init_point,
      };
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Failed to complete purchase:", error);
      return { success: false, redirectUrl: undefined };
    } else {
      console.error("Failed to complete purchase:", error);
      return { success: false, redirectUrl: undefined };
    }
  }
}
