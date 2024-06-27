import Link from "next/link"
import { TicketIcon } from '@heroicons/react/24/outline';
import { Button } from "@headlessui/react";

const BuysRecordButton =()=>{
    return (
        <div className="justify-between items-center">
        <Button className="pt-2 text-sm/4 font-semibold text-gray-100 focus:outline-none data-[active]:text-white data-[hover]:text-white data-[focus]:outline-1 data-[focus]:outline-white">                                
            <Link href="/buyProduct/buys">
            <TicketIcon className="size-10"/>
                Tus compras
            </Link>                   
        </Button>
        </div>
    )
}
export default BuysRecordButton
