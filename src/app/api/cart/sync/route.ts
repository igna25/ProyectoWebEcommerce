import CartsRepository from "@/lib/Repositories/CartsRepository";
import OrderItemsRepository from "@/lib/Repositories/OrdersRepository";
import ProductsRepository from "@/lib/Repositories/ProductsRepository";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const { userId: rawUserId, items: rawItems } = (await request.json()) as {
      userId: string;
      items: Array<{
        productid: string;
        quantity: number;
        productprice?: number;
      }>;
    };

    const userId = (rawUserId || "").trim();
    const requestedItems = Array.isArray(rawItems) ? rawItems : [];

    const cartsRepository = new CartsRepository();
    const orderItemsRepository = new OrderItemsRepository();
    const productsRepository = new ProductsRepository();

    let userCart = await cartsRepository.getCartByUserId(userId);

    const itemsWithServerPrices = await Promise.all(
      requestedItems.map(async (requestedItem) => {
        const product = await productsRepository.getProductById(
          requestedItem.productid,
        );
        return {
          productid: requestedItem.productid,
          quantity: requestedItem.quantity,
          price: product ? Number(product.price) : 0,
        };
      }),
    );

    const newCartTotal = itemsWithServerPrices.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );

    if (!userCart) {
      const createdCartId = await cartsRepository.createCart(
        userId,
        newCartTotal,
        "sync",
      );
      userCart = await cartsRepository.getCartById(createdCartId);
    } else {
      await orderItemsRepository.deleteOrdersWithCartId(userCart.id);
    }

    if (userCart) {
      for (const normalizedItem of itemsWithServerPrices) {
        await orderItemsRepository.createOrderItem(
          userCart.id,
          normalizedItem.productid,
          normalizedItem.quantity,
          normalizedItem.price,
        );
      }
      await cartsRepository.updateCart(userCart.id, newCartTotal, "sync");
    }

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch {
    return NextResponse.json(
      { msg: "Error trying to sync cart" },
      { status: 500 },
    );
  }
}
