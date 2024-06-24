import Link from "next/link"
import { ChevronDownIcon, ShoppingCartIcon } from '@heroicons/react/24/outline';
import { Popover, PopoverButton, PopoverPanel, Transition } from "@headlessui/react";


const CartButton = () => {
  return (
    <div className="flex justify-center pt-4">
      <div className="flex gap-3">
        <Popover>
          <PopoverButton className="text-sm/6 font-semibold text-gray-100 focus:outline-none data-[active]:text-white data-[hover]:text-white data-[focus]:outline-1 data-[focus]:outline-white">
            <ShoppingCartIcon />
            Cart

          </PopoverButton>
          <Transition
            enter="transition ease-out duration-200"
            enterFrom="opacity-100 translate-y-1"
            enterTo="opacity-100 translate-y-0"
            leave="transition ease-in duration-150"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-100 translate-y-1"
          >
            <PopoverPanel
              anchor="bottom"
              className="divide-y divide-white/5 rounded-xl bg-gray-400 text-sm/6 [--anchor-gap:var(--spacing-3)]"
            >
              <div className="p-2">
                <a className="block rounded-lg py-2 px-3 transition hover:bg-white/5" href="#">
                  <p className="font-semibold text-white">Buy products</p>
                </a>
                <a className="block rounded-lg py-2 px-3 transition hover:bg-white/5" href="#">
                  <Link href="/cart">Carrito
                  </Link>
                </a>
              </div>
            </PopoverPanel>
          </Transition>
        </Popover>
      </div>
    </div>
  )
}
export default CartButton