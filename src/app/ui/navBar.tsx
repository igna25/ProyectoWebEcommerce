import Link from 'next/link';
import AuthButton from './LogoutButton';
import { Session } from 'next-auth';
import { getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]/auth-config';
import LogoutButton from './LogoutButton';
import LoginButton from './LoginButton';
import CartButton from './dashboard/CartButton';
import Image from "next/image";
import HomeButton from './HomeButton';
import SearchBar from './dashboard/SearchBar';
import { Fragment } from 'react';
import BuysRecordButton from './BuysRecordButton';
import { CursorArrowRippleIcon } from '@heroicons/react/24/outline';
import { Button } from "@headlessui/react";


const NavBar = async () => {
  const session: Session | null = await getServerSession(authOptions);
  const AuthButton = session ? (
    <Fragment>
      <div className="mr-10">
        <BuysRecordButton />
      </div>
      <div className="mr-10">
        <LogoutButton />
      </div>
    </Fragment>
  ) : (
    <LoginButton />
  );

  return (
    <div className="bg-gray-800 sticky top-0">
      <div className="container mx-auto flex justify-between items-center">
        <Button className="pt-2 text-sm/5 font-semibold text-gray-100 focus:outline-none data-[active]:text-white data-[hover]:text-white data-[focus]:outline-1 data-[focus]:outline-white">
            <Link href="/">
                <CursorArrowRippleIcon/>
                Logo
            </Link>
        </Button>
        <div className="flex items-center">
          <div className="mr-10">
            <HomeButton  /> 
          </div>
          <div className="mr-10">
            <CartButton  />
          </div>
          {AuthButton}
        </div>
      </div>
    </div>
  );
};

export default NavBar;
