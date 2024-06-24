const { db } = require('@vercel/postgres');

async function dropTables(client) {
  try {
    await client.query('DROP TABLE IF EXISTS orderitems CASCADE');
    console.log('Tabla "orderitems" eliminada');

    await client.query('DROP TABLE IF EXISTS sales_orders CASCADE');
    console.log('Tabla "sales_orders" eliminada');
    
    await client.query('DROP TABLE IF EXISTS sales CASCADE');
    console.log('Tabla "sales" eliminada');
    
    await client.query('DROP TABLE IF EXISTS products CASCADE');
    console.log('Tabla "products" eliminada');
    
    await client.query('DROP TABLE IF EXISTS carts CASCADE');
    console.log('Tabla "carts" eliminada');
    
    await client.query('DROP TABLE IF EXISTS users CASCADE');
    console.log('Tabla "users" eliminada');

    
    
  } catch (error) {
    console.error('Error al eliminar tablas:', error);
    throw error;
  }
}

async function main() {
  const client = await db.connect();

  try {
    await dropTables(client);
  } catch (error) {
    console.error('Error al eliminar la base de datos:', error);
  } finally {
    await client.end();
  }
}

main().catch((err) => {
  console.error('Error:', err);
});
