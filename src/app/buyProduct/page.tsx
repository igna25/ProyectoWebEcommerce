
import Link from "next/link"
import { BuyList } from "../ui/buyProduct/BuyList"
import { getCartProductsFromLocalStorage } from "../lib/actions/getProductFromLocalStorage"
import { OrderItem } from "../lib/Entities/Order"
import { Product } from "../lib/Entities/Product"
import { getServerSession, Session } from "next-auth"
import { authOptions } from "../api/auth/[...nextauth]/auth-config"
import { unstable_noStore as noStore } from 'next/cache';
import CartsRepository from "../lib/Repositories/CartsRepository"
import OrderItemsRepository from "../lib/Repositories/OrdersRepository"

export default async function BuyPage() {
  noStore();
  const session: Session | null = await getServerSession(authOptions)

  const cartsRepository = new CartsRepository()
  const ordersRepository = new OrderItemsRepository()

  let isLogged = false

  let cartProducts: (OrderItem & Product)[] = []
  if (session != null) {
    isLogged = true
    let cart = await cartsRepository.getCartByUserId(session.user.id)
    if (!!cart)
      cartProducts = await ordersRepository.getOrdersByCartId(cart.id)
  }

  return (
    <section className="w-full mb-4">
      <div className="container px-4 md:px-6 text-center">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl">Tu Carrito</h1>
        {cartProducts.length > 0 ? <h1 className="text-2xl text-center ">Tu carrito tiene los siguientes productos</h1> : <h1 className="text-2xl text-center ">El carrito está vacío</h1>}
      </div>
      <div className="pt-2 flex-1 flex">
        <button className="bg-gray-100 text-gray-500 font-semibold px-4 rounded hover:bg-gray-200 focus:outline-none">
          <Link href="/cart">
            {"<"} Volver al carrito
          </Link>
        </button>
      </div>
      <div className="container grid md:grid-cols-2 gap-8 px-4 md:px-6 mt-12">
        <div className="grid gap-6">
          {
            cartProducts.length > 0
              ? (
                  <BuyList products={cartProducts} userId={session?.user.id} />
                
              ) : (
                <div className="text-center border-2 border-dashed p-6 grid grid-rows-2 border-gray-200 rounded-lg">
                  <p className="text-2xl">No dispones de ningun producto en tu carrito</p>
                </div>
              )
          }
        </div>
      </div>
    </section>
  )
};

