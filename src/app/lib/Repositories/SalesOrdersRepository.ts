import { QueryResult } from '@vercel/postgres';
import { v4 as uuidv4 } from 'uuid';
import { SalesOrder } from '../Entities';
import { sql } from '@vercel/postgres';

class SalesOrdersRepository {
  async getOrderById(orderId: string): Promise<SalesOrder | undefined> {
    try {
      const query = await sql<SalesOrder>`SELECT * FROM sales_orders WHERE id = ${orderId}`;
      return query.rows[0];
    } catch (error) {
      console.error(`Failed to fetch order with ID ${orderId}:`, error);
      throw new Error(`Failed to fetch order with ID ${orderId}.`);
    }
  }

  async createOrder(saleID: string, productID: string, quantity: number, price: number, productname:string): Promise<string> {
    try {
      const orderId = uuidv4();
      await sql`
        INSERT INTO sales_orders(id, saleID, productID, quantity, price, productname) 
        VALUES (${orderId}, ${saleID}, ${productID}, ${quantity}, ${price}, ${productname})
      `;
      return orderId;
    } catch (error) {
      console.error('Failed to create order:', error);
      throw new Error('Failed to create order.');
    }
  }

  async updateOrder(orderId: string, quantity: number, price: number): Promise<void> {
    try {
      await sql`
        UPDATE sales_orders 
        SET quantity = ${quantity}, price = ${price} 
        WHERE id = ${orderId}
      `;
    } catch (error) {
      console.error('Failed to update order:', error);
      throw new Error('Failed to update order.');
    }
  }

  async deleteOrder(orderId: string): Promise<void> {
    try {
      await sql`
        DELETE FROM sales_orders 
        WHERE id = ${orderId}
      `;
    } catch (error) {
      console.error('Failed to delete order:', error);
      throw new Error('Failed to delete order.');
    }
  }

  async getOrdersBySaleId(saleId: string): Promise<SalesOrder[]> {
    try {
      const query = await sql<SalesOrder>`SELECT * FROM sales_orders WHERE saleID = ${saleId}`;
      return query.rows;
    } catch (error) {
      console.error(`Failed to fetch orders for sale with ID ${saleId}:`, error);
      throw new Error(`Failed to fetch orders for sale with ID ${saleId}.`);
    }
  }

  async getAllOrders(): Promise<SalesOrder[]> {
    try {
      const query = await sql<SalesOrder>`SELECT * FROM sales_orders`;
      return query.rows;
    } catch (error) {
      console.error('Failed to fetch orders:', error);
      throw new Error('Failed to fetch orders.');
    }
  }
}

export default SalesOrdersRepository;
