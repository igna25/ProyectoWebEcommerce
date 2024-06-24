"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@headlessui/react";

const ExploreButton =()=>{
  return (
    <Button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-400 focus:outline-none">
      <Link href="/dashboard">Ver productos</Link>
    </Button>
  )
}
export default ExploreButton
