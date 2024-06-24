import Link from "next/link"
import { HomeIcon } from '@heroicons/react/24/outline';
import { Button } from "@headlessui/react";

const HomeButton =()=>{
    return (
        <Button className="pt-2 text-sm/5 font-semibold text-gray-100 focus:outline-none data-[active]:text-white data-[hover]:text-white data-[focus]:outline-1 data-[focus]:outline-white">
            <Link href="/">
                <HomeIcon/>
                Home
            </Link>
        </Button>
    )
}
export default HomeButton
