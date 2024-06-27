import Link from "next/link"
import { ChevronDownIcon, ShoppingCartIcon } from '@heroicons/react/24/outline';
import { Button, Popover, PopoverButton, PopoverPanel, Transition } from "@headlessui/react";


const CartButton = () => {
  return (
    <div className="flex justify-center pt-4">
      <div className="flex gap-3">
      <Link href="/cart">
          <Button className="text-sm/6 font-semibold text-gray-100 focus:outline-none data-[active]:text-white data-[hover]:text-white data-[focus]:outline-1 data-[focus]:outline-white">
          
            <ShoppingCartIcon />
            Cart
          </Button>
      </Link>
          
      </div>
    </div>
  )
}
export default CartButton