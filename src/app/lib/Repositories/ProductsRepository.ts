import { sql } from '@vercel/postgres';
import { Product } from '../Entities/Product';
export const fetchCache = 'force-no-store';


class ProductsRepository {
  async getProductById(productId: string): Promise<Product | undefined> {
    try {
      const query = await sql<Product>`SELECT * FROM products WHERE id = ${productId}`;
      return query.rows[0];
    } catch (error) {
      console.error(`Failed to fetch product with ID ${productId}:`, error);
      throw new Error(`Failed to fetch product with ID ${productId}.`);
    }
  }

  async createProduct(data:{
    productName: string, 
    description: string, 
    imageURL: string, 
    imageKey: string, 
    price: number, 
    stock: number
  }
  ): Promise<number> {
    try {
      const {productName, description, imageURL, price, imageKey, stock} = data
      const query = await sql`
        INSERT INTO products (productName, description, imageURL, imageKey, price, stock) 
        VALUES (${productName}, ${description}, ${imageURL}, ${imageKey}, ${price}, ${stock}) 
        RETURNING id
      `;
      return query.rows[0].id;
    } catch (error) {
      console.error('Failed to create product:', error);
      throw new Error('Failed to create product.');
    }
  }

  async updateProduct(product:Product): Promise<void> {
    try {
      const {productname, description, imageurl, imagekey, price, stock, id} = product
      await sql`
        UPDATE products 
        SET productName = ${productname}, description = ${description}, imageURL = ${imageurl}, imageKey = ${imagekey}, price = ${price}, stock = ${stock} 
        WHERE id = ${id}
      `;
    } catch (error) {
      console.error('Failed to update product:', error);
      throw new Error('Failed to update product.');
    }
  }

  async getAllProducts(): Promise<Product[]> {
    try {
      const query = await sql<Product>`SELECT * FROM products`;
      return query.rows;
    } catch (error) {
      console.error('Failed to fetch products:', error);
      throw new Error('Failed to fetch products.');
    }
  }

  async getAllProductsPaginated(
    page: number,
    pageSize: number,
    active: boolean = true
  ): Promise<{products:Product[], total:number}> {
    try {
      const offset = (page - 1) * pageSize;
  
      const query = await sql<Product>
        `SELECT * FROM products 
        WHERE active = ${active}
        ORDER BY productName
        LIMIT ${pageSize} OFFSET ${offset}`;

      const totalQuery = await sql<{ count: number }>`
      SELECT COUNT(*) as count FROM products WHERE active = ${active}`;
      const total = totalQuery.rows[0].count;
      
      return {
        products:query.rows,
        total
      }
    } catch (error) {
      console.error('Failed to fetch products:', error);
      throw new Error('Failed to fetch products.');
    }
  }

  async searchProductsByName(
    productName: string,
    page: number,
    pageSize: number,
    active: boolean = true
  ): Promise<{ products: Product[], total: number }> {
    try {
      const offset = (page - 1) * pageSize;
  
      const totalQuery = await sql<{ count: number }>`
        SELECT COUNT(*) as count 
        FROM products 
        WHERE productName ILIKE ${'%' + productName + '%'} 
        AND active = ${active}
      `;
      const total = totalQuery.rows[0].count;
  
      const query = await sql<Product>`
        SELECT * FROM products
        WHERE productName ILIKE ${'%' + productName + '%'}
        AND active = ${active}
        ORDER BY productName
        LIMIT ${pageSize} OFFSET ${offset}
      `;
      return {
        products: query.rows,
        total: total,
      };
    } catch (error) {
      console.error(`Failed to fetch products with name matching "${productName}":`, error);
      throw new Error(`Failed to fetch products with name matching "${productName}".`);
    }
  }


  async changeProductActiveStatus(productId: string, active: boolean): Promise<{updatedRows:number}> {
    try {
      const result = await sql`
        UPDATE products
        SET active = ${active}
        WHERE id = ${productId}
      `;

      if(!active){
        const result2 = await sql`
          DELETE FROM orderitems
          WHERE productid = ${productId}
        `;  
      }
      return {
        updatedRows: result.rowCount
      }
    } catch (error) {
      console.error(`Failed to change active status for product with ID ${productId}:`, error);
      throw new Error(`Failed to change active status for product with ID ${productId}.`);
    }
  }

  async updateStock(productId: string, newStock:number): Promise<{updatedRows:number}> {
    try {
      const result = await sql`
        UPDATE products
        SET stock = ${newStock}
        WHERE id = ${productId}
      `;
      return {
        updatedRows: result.rowCount
      }
    } catch (error) {
      console.error(`Failed to change active status for product with ID ${productId}:`, error);
      throw new Error(`Failed to change active status for product with ID ${productId}.`);
    }
  }

  async getOutOfStockProducts(): Promise<Product[]> {
    try {
      const query = await sql<Product>`
        SELECT * FROM products
        WHERE stock = 0 AND active = true
      `;
      return query.rows;
    } catch (error) {
      console.error('Failed to fetch out-of-stock products:', error);
      throw new Error('Failed to fetch out-of-stock products.');
    }
  }

}

export default ProductsRepository;
