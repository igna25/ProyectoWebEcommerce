"use client";
import React, { Fragment, useState } from "react";
import Modal from "react-modal";

const StockModal = ({
  data,
}: {
  data: { id: string; currentStock: number };
}) => {
  const { id, currentStock } = data;
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [stock, setStock] = useState(currentStock || 0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const openModal = () => setModalIsOpen(true);
  const closeModal = () => {
    setModalIsOpen(false);
    setStock(currentStock);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (typeof stock !== "number" || stock < 0) {
      setError("El stock debe ser un número positivo");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch("/api/admin/products/stock", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          productId: id,
          stock: stock,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update stock");
      }

      closeModal();
      window.location.reload();
    } catch (err) {
      setError("Error al actualizar el stock");
    } finally {
      setIsLoading(false);
    }
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
          <h2 className="text-xl font-bold mb-4">Actualizar Stock</h2>
          <form onSubmit={handleSubmit}>
            <label className="block mb-4">Stock Actual: {currentStock}</label>
            <input
              type="number"
              min="0"
              value={stock}
              onChange={(e) => setStock(parseInt(e.target.value))}
              className="w-full px-3 py-2 border rounded mb-4"
              disabled={isLoading}
            />
            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded disabled:opacity-50"
                onClick={closeModal}
                disabled={isLoading}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
                disabled={isLoading}
              >
                {isLoading ? "Actualizando..." : "Actualizar"}
              </button>
            </div>
          </form>
        </div>
      </Modal>
    </Fragment>
  );
};

export default StockModal;
