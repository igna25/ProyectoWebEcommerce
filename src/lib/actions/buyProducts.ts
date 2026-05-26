"use server";

import { MercadoPagoConfig, Preference } from "mercadopago";
import CartsRepository from "../Repositories/CartsRepository";
import OrderItemsRepository from "../Repositories/OrdersRepository";
const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN || "",
});
const cartsRepository = new CartsRepository();
const orderItemsRepository = new OrderItemsRepository();
export async function buyProducts(userID: string): Promise<{
  success: boolean;
  redirectUrl: string | undefined;
  outOfStock?: string[];
  inactive?: string[];
}> {
  try {
    const cart = await cartsRepository.getCartByUserId(userID);
    if (!cart) {
      throw new Error(`Cart not found`);
    } else {
      const orderItems = await orderItemsRepository.getOrdersByCartId(cart.id);

      if (orderItems.length === 0) {
        throw new Error(`No order items found for cart ID ${cart.id}.`);
      }

      const inactive = orderItems
        .filter((item) => !item.active)
        .map((item) => item.productname);

      if (inactive.length > 0) {
        return {
          success: false,
          redirectUrl: undefined,
          inactive,
        };
      }

      const outOfStock = orderItems
        .filter((item) => item.stock < item.quantity)
        .map((item) => item.productname);

      if (outOfStock.length > 0) {
        return {
          success: false,
          redirectUrl: undefined,
          outOfStock,
        };
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
            success: "https://proyecto-web-ecommerce.vercel.app/",
            failure: "https://proyecto-web-ecommerce.vercel.app/",
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
    console.error("Failed to complete purchase:", error);
    return { success: false, redirectUrl: undefined };
  }
}
