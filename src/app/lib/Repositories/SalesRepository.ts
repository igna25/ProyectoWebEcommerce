import { QueryResult } from '@vercel/postgres';
import { v4 as uuidv4 } from 'uuid';
import { Sale } from '../Entities/Sale';
import { sql } from '@vercel/postgres';

class SalesRepository {
  async getSaleById(saleId: string): Promise<Sale | undefined> {
    try {
      const query = await sql<Sale>`SELECT * FROM sales WHERE id = ${saleId}`;
      return query.rows[0];
    } catch (error) {
      console.error(`Failed to fetch sale with ID ${saleId}:`, error);
      throw new Error(`Failed to fetch sale with ID ${saleId}.`);
    }
  }

  async createSale(userID: string, totalPrice: number, totalProducts:number, username:string = "", mercadoPagoID?: string): Promise<string> {
    try {
      const saleId = uuidv4();
      await sql`
        INSERT INTO sales(id, userID, totalPrice, totalProducts, mercadoPagoID, username) 
        VALUES (${saleId}, ${userID}, ${totalPrice}, ${totalProducts}, ${mercadoPagoID}, ${username})
      `;
      return saleId;
    } catch (error) {
      console.error('Failed to create sale:', error);
      throw new Error('Failed to create sale.');
    }
  }

  async deleteSale(saleId: string): Promise<void> {
    try {
      await sql`
        DELETE FROM sales 
        WHERE id = ${saleId}
      `;
    } catch (error) {
      console.error('Failed to delete sale:', error);
      throw new Error('Failed to delete sale.');
    }
  }

  async getAllSalesPaginated(
    page: number,
    pageSize: number,
  ): Promise<{sales:Sale[], total:number}> {
    try {
        const offset = (page - 1) * pageSize;
        const query = await sql<Sale>
        `SELECT * FROM sales
        ORDER BY creationDate
        LIMIT ${pageSize} OFFSET ${offset}`;

        const totalQuery = await sql<{ count: number }>`
            SELECT COUNT(*) as count FROM sales`;
        const total = totalQuery.rows[0].count;
        
        return {
            sales:query.rows,
            total
        }
    } catch (error) {
        console.error('Failed to fetch sales:', error);
        throw new Error('Failed to fetch sales.');
    }
  }
  async getRecentSales(limit: number = 3): Promise<Sale[]> {
    try {
      const query = await sql<Sale>`
        SELECT * FROM sales
        ORDER BY creationDate DESC
        LIMIT ${limit}
      `;
      return query.rows;
    } catch (error) {
      console.error('Failed to fetch recent sales:', error);
      throw new Error('Failed to fetch recent sales.');
    }
  }

  async getMonthlyEarnings(): Promise<{ totalEarnings: number, totalSales: number }> {
    try {
      const currentDate = new Date();
      const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

      const query = await sql<Sale>`
        SELECT * FROM sales
        WHERE creationDate >= ${firstDayOfMonth.toISOString()} AND creationDate <= ${lastDayOfMonth.toISOString()}`;

      const totalEarnings = query.rows.reduce((total, sale) => total + parseFloat(""+sale.totalprice), 0);
      const totalSales = query.rows.length;

      return { totalEarnings, totalSales };
    } catch (error) {
      console.error('Failed to fetch monthly earnings:', error);
      throw new Error('Failed to fetch monthly earnings.');
    }
  }
}

export default SalesRepository;
