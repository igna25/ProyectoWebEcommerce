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

    console.log(rawItems);

    const userId = (rawUserId || "").trim();
    const requestedItems = Array.isArray(rawItems) ? rawItems : [];

    const cartsRepository = new CartsRepository();
    const orderItemsRepository = new OrderItemsRepository();
    const productsRepository = new ProductsRepository();

    let userCart = await cartsRepository.getCartByUserId(userId);

    const resolved = await Promise.all(
      requestedItems.map(async (requestedItem) => {
        const product = await productsRepository.getProductById(
          requestedItem.productid,
        );
        if (!product) return { item: null, staleId: requestedItem.productid };
        return {
          item: {
            productid: product.id,
            quantity: requestedItem.quantity,
            price: Number(product.price),
          },
          staleId: null,
        };
      }),
    );

    const itemsWithServerPrices = resolved
      .filter((r) => r.item !== null)
      .map((r) => r.item!);
    const staleProductIds = resolved
      .filter((r) => r.staleId !== null)
      .map((r) => r.staleId!);

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

    return NextResponse.json({ ok: true, staleProductIds }, { status: 200 });
  } catch (error) {
    console.error("Error trying to sync cart:", error);
    return NextResponse.json(
      { msg: "Error trying to sync cart" },
      { status: 500 },
    );
  }
}
