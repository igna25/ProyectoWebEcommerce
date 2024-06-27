import ProductsRepository from "../lib/Repositories/ProductsRepository";
import { unstable_noStore as noStore } from 'next/cache';
import { Product } from "../lib/Entities/Product";
import { Fragment } from "react";
import Link from "next/link";
import SalesRepository from "../lib/Repositories/SalesRepositor";
import { Sale } from '../lib/Entities';

export default async function AdminPage() {
  noStore();

  const salesRepository = new SalesRepository()
  const productsRepository = new ProductsRepository()

  const recentSales: Sale[] = await salesRepository.getRecentSales();
  const { totalEarnings, totalSales } = await salesRepository.getMonthlyEarnings();
  const lowStockProducts: Product[] = await productsRepository.getOutOfStockProducts();

  let products: Product[] = [];
  let totalPages = 1;

  return (
    <Fragment>
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white shadow-md rounded-lg p-6">

          <div className="mb-6 border-t-2 border-gray-300 pt-4">
            <h2 className="text-2xl font-bold mb-4">Resumen del Administrador</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            <div className="bg-gray-100 rounded-lg p-4">
              <h3 className="text-xl font-semibold">Total Ganado</h3>
              <p className="mt-2">${totalEarnings.toFixed(2)}</p>
            </div>

            <div className="bg-gray-100 rounded-lg p-4">
              <h3 className="text-xl font-semibold">Total de Ventas</h3>
              <p className="mt-2">{totalSales}</p>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4">Últimas 3 Ventas</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {recentSales.map(sale => (
                <div key={sale.id} className="bg-gray-100 rounded-lg p-4">
                  <p className="text-lg font-semibold">{sale.username}</p>
                  <p className="text-sm text-gray-600">${sale.totalprice}</p>
                  <p className="text-xs text-gray-500">{new Date(sale.creationdate).toLocaleDateString()}</p>
                </div>
              ))}
            </div>
            <Link href="/admin/ventas">
              <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4">Ir a Ventas</button>
            </Link>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-4">Productos sin Stock</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {lowStockProducts.length > 0 ? (
                lowStockProducts.map(product => (
                  <div key={product.id} className="bg-red-100 rounded-lg p-4">
                    <p className="text-lg font-semibold">{product.productname}</p>
                    <p className="text-sm text-gray-600">Stock: {product.stock}</p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">Todos los productos están al día</p>
              )}
            </div>
            <Link href={`/admin/activos}`}>
              <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-2">Ir a Productos</button>
            </Link>
          </div>

        </div>
      </div>
    </Fragment>
  );
}
