'use server'
import CartsRepository from "../Repositories/CartsRepository";
import OrderItemsRepository from "../Repositories/OrdersRepository";
import SalesOrdersRepository from "../Repositories/SalesOrdersRepository";

import SalesRepository from "../Repositories/SalesRepository";
import UsersRepository from "../Repositories/Usersrepository";

const cartsRepository = new CartsRepository()
const orderItemsRepository = new OrderItemsRepository()
const salesRepository = new SalesRepository()
const salesOrdersRepository = new SalesOrdersRepository()
const usersRepository = new UsersRepository()

export default async function processPayment(cartid:string, paymentId:string){
    try {
        const cart = await cartsRepository.getCartById(cartid)
        const orderItems = await orderItemsRepository.getOrderItemsByCartId(cartid)
        let totalProducts = orderItems.reduce((accumulator, item) => accumulator + item.quantity, 0);
        if(!cart || !orderItems){
            return {
                succes:false
            }
        }
        else{
            const user= await usersRepository.getUserById(cart.userid)
            const saleId = await salesRepository.createSale(cart.userid,cart.totalprice,totalProducts,user?.name,paymentId)
            orderItems.forEach(async (orderItem)=>{
                await salesOrdersRepository.createOrder(saleId, orderItem.productid,orderItem.quantity,orderItem.productprice, orderItem.productname)
            })

            await orderItemsRepository.deleteOrdersWithCartId(cart.id)
            await cartsRepository.deleteCart(cart.id)
        }
        return {
            success: true
        };       
    } catch (error) {
        return {
            success: false
        };   
    }
}