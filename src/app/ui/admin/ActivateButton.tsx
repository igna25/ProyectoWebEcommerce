"use client";
import React, { Fragment, useState } from "react";
import Modal from "react-modal";
import { Button } from "@headlessui/react";
import { queueOfflineOp, isOfflineSyncSupported } from "@/lib/offlineQueue";

const ActivateButton = ({ data }: { data: { id: string } }) => {
  const { id } = data;
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [queued, setQueued] = useState(false);

  const openModal = () => setModalIsOpen(true);
  const closeModal = () => {
    setModalIsOpen(false);
    setError(null);
    setQueued(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch("/api/admin/products/status", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          productId: id,
          active: true,
        }),
      });

      if (!response.ok) {
        if (response.status === 503 && isOfflineSyncSupported()) {
          await queueOfflineOp({
            url: "/api/admin/products/status",
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ productId: id, active: true }),
          });
          setQueued(true);
          return;
        }
        throw new Error("Failed to activate product");
      }

      closeModal();
      window.location.reload();
    } catch (err) {
      if (isOfflineSyncSupported()) {
        await queueOfflineOp({
          url: "/api/admin/products/status",
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productId: id, active: true }),
        });
        setQueued(true);
        return;
      }
      setError("Error al activar el producto");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Fragment>
      <Button
        type="button"
        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded w-full"
        onClick={openModal}
      >
        Activar
      </Button>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Confirm Activation"
        className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
      >
        <div className="bg-white p-4 rounded shadow-lg w-96">
          <h2 className="text-xl font-bold mb-4">
            Confirmar activación de producto
          </h2>
          <p className="mb-4">
            ¿Estás seguro de que deseas volver a activar este producto?
          </p>
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          {queued && (
            <p className="text-amber-600 text-sm mb-4">
              Sin conexión. Se activará cuando vuelva la conexión.
            </p>
          )}
          <div className="flex justify-end space-x-4">
            <Button
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded disabled:opacity-50"
              onClick={closeModal}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <form onSubmit={handleSubmit}>
              <Button
                type="submit"
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
                disabled={isLoading}
              >
                {isLoading ? "Activando..." : "Activar"}
              </Button>
            </form>
          </div>
        </div>
      </Modal>
    </Fragment>
  );
};

export default ActivateButton;
