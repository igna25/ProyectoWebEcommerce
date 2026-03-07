import { ShoppingCartIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

const CartButton = () => {
  return (
    <Link
      href="/cart"
      className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
    >
      <ShoppingCartIcon className="w-5 h-5" />
      <span className="hidden sm:inline">Carrito</span>
    </Link>
  );
};

export default CartButton;
