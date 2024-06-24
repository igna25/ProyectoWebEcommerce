import Image from "next/image";
import Link from "next/link";
import { Button } from "@headlessui/react";
import { Product } from "@/app/lib/Entities/Product";

function ViewProductDetailsButton ({ product}: { product: Product }) {
  return (
    <Button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full">
      <Link href={"/dashboard/"+product.id}>Ver detalles</Link>
    </Button>
  )
}
export default ViewProductDetailsButton