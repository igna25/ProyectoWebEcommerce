"use client";
import React from "react";
import { Sale, SalesOrder } from "@/lib/Entities";

interface SaleDetailProps {
  sale: Sale;
  orders: SalesOrder[];
}

const SaleDetail = ({ sale, orders }: SaleDetailProps) => {
  return (
    <div className="space-y-4">
      {/* Encabezado */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
          <div>
            <h2 className="text-xl font-bold text-gray-800">
              Detalle de Venta
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {new Date(sale.creationdate).toLocaleDateString()}
            </p>
            <p className="text-sm text-gray-600 mt-0.5">
              Comprador: <span className="font-medium">{sale.username}</span>
            </p>
          </div>
          <div className="sm:text-right">
            <p className="text-xs text-gray-500 uppercase tracking-wide">
              Total
            </p>
            <p className="text-2xl font-bold text-[#004AAD]">
              ${sale.totalprice}
            </p>
          </div>
        </div>
      </div>

      {/* Líneas de pedido */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <h3 className="text-base font-semibold text-gray-800 mb-3">
          Productos
        </h3>
        <div className="divide-y divide-gray-100">
          {orders.map((order) => (
            <div
              key={order.id}
              className="flex items-center justify-between py-3 gap-4"
            >
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-800 truncate">
                  {order.productname}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">
                  {order.quantity} × ${order.price}
                </p>
              </div>
              <p className="text-base font-bold text-gray-800 shrink-0">
                ${order.price * order.quantity}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SaleDetail;
