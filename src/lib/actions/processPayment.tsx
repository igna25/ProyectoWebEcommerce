"use server";
import CartsRepository from "../Repositories/CartsRepository";
import OrderItemsRepository from "../Repositories/OrdersRepository";
import SalesOrdersRepository from "../Repositories/SalesOrdersRepository";
import SalesRepository from "../Repositories/SalesRepository";
import UsersRepository from "../Repositories/UsersRepository";
import ProductsRepository from "../Repositories/ProductsRepository";

const cartsRepository = new CartsRepository();
const orderItemsRepository = new OrderItemsRepository();
const salesRepository = new SalesRepository();
const salesOrdersRepository = new SalesOrdersRepository();
const usersRepository = new UsersRepository();
const productsRepository = new ProductsRepository();

export default async function processPayment(
  cartid: string,
  paymentId: string,
) {
  try {
    const cart = await cartsRepository.getCartById(cartid);
    const orderItems = await orderItemsRepository.getOrderItemsByCartId(cartid);
    const totalProducts = orderItems.reduce(
      (accumulator, item) => accumulator + item.quantity,
      0,
    );
    if (!cart || !orderItems) {
      return { success: false };
    }

    const hasInactive = orderItems.some((item) => item.active === false);
    if (hasInactive) {
      return { success: false };
    }

    const user = await usersRepository.getUserById(cart.userid);
    const saleId = await salesRepository.createSale(
      cart.userid,
      cart.totalprice,
      totalProducts,
      user?.name,
      paymentId,
    );

    await Promise.all(
      orderItems.map((orderItem) =>
        salesOrdersRepository.createOrder(
          saleId,
          orderItem.productid,
          orderItem.quantity,
          orderItem.productprice,
          orderItem.productname,
        ),
      ),
    );

    await Promise.all(
      orderItems.map((orderItem) =>
        productsRepository.decreaseStock(
          orderItem.productid,
          orderItem.quantity,
        ),
      ),
    );

    await orderItemsRepository.deleteOrdersWithCartId(cart.id);
    await cartsRepository.deleteCart(cart.id);

    return {
      success: true,
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
    };
  }
}
