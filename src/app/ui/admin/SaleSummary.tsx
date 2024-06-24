'use client'
import React from 'react';
import { Sale } from '@/app/lib/Entities/Sale';
import Link from 'next/link';



const SaleSummary = ({ sale }: {sale:Sale}) => {
  return (
    <div className="w-full rounded overflow-hidden shadow-lg bg-white m-4 p-6">
      <div className="flex justify-between items-center border-b pb-4 mb-4">
        <div>
            <h2 className="font-bold text-2xl">Resumen de Venta</h2>
            <p className="text-gray-600">Fecha: {new Date(sale.creationdate).toLocaleDateString()}</p>
            <p className="text-gray-600">Comprador: {sale.username}</p>
            <p className="text-gray-600">Cantidad de Productos: {sale.totalproducts}</p>
        </div>
        <div className="text-right">
            <p className="text-lg font-semibold">Total: ${sale.totalprice}</p>
            <Link href={`/admin/ventas/${sale.id}`}>
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                Ver Detalle
                </button>
            </Link>
        </div>
      </div>
    </div>
  );
};

export default SaleSummary;