"use client";
import { deactivateProduct } from "@/lib/actions/deactivateProduct";
import React, { Fragment, useState } from "react";
import Modal from "react-modal";
import { Button } from "@headlessui/react";

const DeleteButton = ({ data }: { data: { id: string; imageId: string } }) => {
  const { id, imageId } = data;
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const openModal = () => setModalIsOpen(true);
  const closeModal = () => setModalIsOpen(false);

  const handleSubmit = async () => {
    try {
      const form = new FormData();
      form.append("id", id);
      form.append("imageId", imageId);

      deactivateProduct(form);
      closeModal();
    } catch (error) {}
  };

  return (
    <Fragment>
      <Button
        type="button"
        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded w-full"
        onClick={openModal}
      >
        Desactivar
      </Button>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Confirm Delete"
        className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
      >
        <div className="bg-white p-4 rounded shadow-lg w-96">
          <h2 className="text-xl font-bold mb-4">Confirmar Desactivación</h2>
          <p className="mb-4">
            ¿Estás seguro de que deseas desactivar este producto?
          </p>
          <p className="mb-3">
            Si lo desactivas este producto no será visible en las busquedas ni
            podrá ser comprado de los carritos de los usuarios
          </p>
          <div className="flex justify-end space-x-4">
            <Button
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
              onClick={closeModal}
            >
              Cancelar
            </Button>
            <form onSubmit={handleSubmit}>
              <Button
                type="submit"
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
              >
                Desactivar
              </Button>
            </form>
          </div>
        </div>
      </Modal>
    </Fragment>
  );
};

export default DeleteButton;
