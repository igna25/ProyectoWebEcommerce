import CartsRepository from "@/lib/Repositories/CartsRepository";
import OrderItemsRepository from "@/lib/Repositories/OrdersRepository";
import { NextResponse } from "next/server";
import { unstable_noStore as noStore } from "next/cache";

export async function GET(request: Request) {
  noStore();
  try {
    const { searchParams: searchParameters } = new URL(request.url || "");
    const userId = (searchParameters.get("userId") || "").trim();
    if (!userId) {
      return NextResponse.json({ items: [], cartId: null }, { status: 200 });
    }

    const cartsRepository = new CartsRepository();
    const orderItemsRepository = new OrderItemsRepository();

    const userCart = await cartsRepository.getCartByUserId(userId);
    if (!userCart) {
      return NextResponse.json({ items: [], cartId: null }, { status: 200 });
    }

    const cartItems = await orderItemsRepository.getOrdersByCartId(userCart.id);
    return NextResponse.json(
      { items: cartItems, cartId: userCart.id },
      { status: 200 },
    );
  } catch {
    return NextResponse.json(
      { msg: "Error trying to fetch cart" },
      { status: 500 },
    );
  }
}
