"use client";

import React, { Fragment, useState } from "react";
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { CheckCircleIcon } from "@heroicons/react/24/outline";
import { Product } from "@/lib/Entities/Product";
import Link from "next/link";
import { addItemToLocalCart, syncCartToServer } from "@/lib/cache/cartCache";

function AddCartButton({
  product,
  userID,
}: {
  product: Product;
  userID: string | undefined;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = () => {
    addItemToLocalCart(product);
    if (userID && navigator.onLine) {
      syncCartToServer(userID).catch(() => {});
    }
    setIsOpen(true);
  };

  return (
    <Fragment>
      <button
        onClick={handleClick}
        className="w-full py-2 px-4 rounded-xl text-sm font-semibold text-white bg-[#004AAD] hover:bg-[#003d8f] transition-colors"
      >
        Agregar al carrito
      </button>

      <Transition show={isOpen} as={Fragment}>
        <Dialog onClose={() => setIsOpen(false)} className="relative z-50">
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-200"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-150"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/50" />
          </TransitionChild>

          <div className="fixed inset-0 flex items-center justify-center p-4">
            <TransitionChild
              as={Fragment}
              enter="ease-out duration-200"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-150"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <DialogPanel className="w-full max-w-sm bg-white rounded-2xl p-6 shadow-xl">
                <div className="flex flex-col items-center text-center gap-3">
                  <CheckCircleIcon className="w-12 h-12 text-green-500" />
                  <DialogTitle className="text-lg font-bold text-gray-900">
                    ¡Agregado al carrito!
                  </DialogTitle>
                  <p className="text-sm text-gray-500">{product.productname}</p>
                </div>
                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => setIsOpen(false)}
                    className="flex-1 py-2 text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
                  >
                    Seguir comprando
                  </button>
                  <Link
                    href="/cart"
                    onClick={() => setIsOpen(false)}
                    className="flex-1 py-2 text-sm font-semibold text-white bg-[#004AAD] hover:bg-[#003d8f] rounded-xl text-center transition-colors"
                  >
                    Ir al carrito
                  </Link>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </Dialog>
      </Transition>
    </Fragment>
  );
}

export default AddCartButton;
