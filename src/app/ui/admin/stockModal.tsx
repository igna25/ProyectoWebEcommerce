'use client'
import React, { Fragment, useState } from 'react';
import Modal from 'react-modal';
import { updateStock } from '@/app/lib/actions/updateStock';

const StockModal = ({ data }:{data:{id:string, currentStock:number}}) => {
  const { id, currentStock } = data;
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [stock, setStock] = useState(currentStock || 0);

  const openModal = () => setModalIsOpen(true);
  const closeModal = () => {
      setModalIsOpen(false);
      setStock(currentStock)
  }

  const handleSubmit = async () => {
    try {
       const result = await updateStock({ productId:id, newStock:stock });
       if (result.success) {
         console.log("Stock updated successfully");
       } else {
         console.log("Error updating stock");
       }
    } catch (error) {
      console.error("Error:", error);
    }
    closeModal();
  };

  return (
    <Fragment>
      <button
        type="button"
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full"
        onClick={openModal}
      >
        Stock
      </button>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Update Stock"
        className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
      >
        <div className="bg-white p-4 rounded shadow-lg w-96">
          <h2 className="text-xl font-bold mb-4">Modicación de Stock</h2>
          <form onSubmit={handleSubmit}>
            <label className="block mb-2">
              Nuevo stock:
              <input
                type="number"
                value={stock}
                onChange={(e) => setStock(parseInt(e.target.value))}
                className="mt-1 block w-full rounded-lg border border-gray-300 bg-white py-1.5 px-3 text-sm text-gray-800',
                'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400"
              />
            </label>
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
                onClick={closeModal}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Confirmar
              </button>
            </div>
          </form>
        </div>
      </Modal>
    </Fragment>
  );
};

export default StockModal;
