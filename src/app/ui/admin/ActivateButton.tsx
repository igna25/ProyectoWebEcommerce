'use client'
import React, { Fragment, useState } from 'react';
import Modal from 'react-modal'; 
import { activateProduct } from '@/app/lib/actions/activateProduct';
import { ToastContainer, toast } from 'react-toastify';


const ActivateButton = ({data}:{data:{id:string}}) => {
    const {id} = data
    const [modalIsOpen, setModalIsOpen] = useState(false);

    const openModal = () => setModalIsOpen(true);
    const closeModal = () => setModalIsOpen(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) =>{

        try{
            const form = new FormData()
            form.append('id', id)

            const result = await activateProduct(form)
            if(result.success){
                console.log("eliminado correctamente")
            }
            else{
                console.log("algo paso")
            }
        }
        catch(error){

        }
        closeModal();
    };

    return (
        <Fragment>            
            <button
                type='submit'
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded w-full"
                onClick={openModal}>
                Activar
            </button>
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                contentLabel="Confirm Delete"
                className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
            >
                <div className="bg-white p-4 rounded shadow-lg w-96">
                <h2 className="text-xl font-bold mb-4">Confirmar activacion de producto</h2>
                <p className="mb-4">¿Estás seguro de que deseas volver a activar este producto?</p>
                <div className="flex justify-end space-x-4">
                    <button
                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
                    onClick={closeModal}
                    >
                    Cancelar
                    </button>
                    <form onSubmit={handleSubmit}>
                        <button
                        type='submit'
                        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                        >
                        Activar
                        </button>
                    </form>
                </div>
                </div>
            </Modal>
        </Fragment>
    );
};

export default ActivateButton;
