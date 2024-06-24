import { getServerSession, Session } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/auth-config";
import CartsRepository from "../lib/Repositories/CartsRepository";
import ProductList from "../ui/cart/ProductList";
import { Product } from "../lib/Entities/Product";
import OrderItemsRepository from "../lib/Repositories/OrdersRepository";
import { OrderItem } from "../lib/Entities/Order";
import { unstable_noStore as noStore } from 'next/cache';
import { Fragment } from "react";
import Link from "next/link";
import { getCartProductsFromLocalStorage } from "../lib/actions/getProductFromLocalStorage";
import UsersRepository from "../lib/Repositories/Usersrepository";

export default async function CartPage() {
  noStore();
  const session: Session | null = await getServerSession(authOptions)

  const cartsRepository = new CartsRepository()

  const ordersRepository = new OrderItemsRepository()

  let cartProducts: (OrderItem & Product)[] = []
  if (session != null) {
    let cart = await cartsRepository.getCartByUserId(session.user.id)
    if (!!cart)
      cartProducts = await ordersRepository.getOrdersByCartId(cart.id)

  }else{
    cartProducts = getCartProductsFromLocalStorage()
  }

  return (
    <Fragment>
      <h1 className="text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl">Tu carrito</h1>
      <section className="w-full mb-2">
          <ProductList cartProducts={cartProducts} userId={session?.user.id}></ProductList>
      </section>
    </Fragment>
  )
}
