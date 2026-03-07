import { TicketIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

const BuysRecordButton = () => {
  return (
    <Link
      href="/buyProduct/buys"
      className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
    >
      <TicketIcon className="w-5 h-5" />
      <span className="hidden sm:inline">Mis compras</span>
    </Link>
  );
};

export default BuysRecordButton;
