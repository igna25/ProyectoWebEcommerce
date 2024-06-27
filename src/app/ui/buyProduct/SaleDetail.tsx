import { Sale } from '@/app/lib/Entities/Sale';
import { SalesOrder } from '@/app/lib/Entities/SalesOrder';
import React from 'react';

interface SaleDetailProps {
  sale: Sale;
  orders: SalesOrder[];
}

const SaleDetail = ({ sale, orders }: SaleDetailProps) => {
  return (
    <div className="w-full rounded overflow-hidden shadow-lg bg-white m-4 p-6">
      <div className="flex justify-between items-center border-b pb-4 mb-4">
        <div>
          <h2 className="font-bold text-2xl">Detalle de Compra</h2>
          <p className="text-gray-600">Fecha: {new Date(sale.creationdate).toLocaleDateString()}</p>
          <p className="text-gray-600">Comprador: {sale.username}</p>
        </div>
        <div className="text-right">
          <p className="text-lg font-semibold">Total: ${sale.totalprice}</p>
        </div>
      </div>
      <div>
        <h3 className="font-bold text-xl mb-4">Productos</h3>
        {orders.map(order => (
          <div key={order.id} className="flex items-center border-b py-4">
            <div className="flex-1">
              <p className="font-semibold">{order.productname}</p>
              <p className="text-gray-600">Cantidad: {order.quantity}</p>
              <p className="text-gray-600">Precio: ${order.price}</p>
            </div>
            <div className="text-right">
              <p className="text-lg font-semibold">${(order.price * order.quantity)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SaleDetail;
