import { CursorArrowRippleIcon } from "@heroicons/react/24/outline";
import { getServerSession, Session } from "next-auth";
import Link from "next/link";
import { Fragment } from "react";
import { authOptions } from "../../api/auth/[...nextauth]/auth-config";
import BuysRecordButton from "./BuysRecordButton";
import HomeButton from "./HomeButton";
import LoginButton from "./LoginButton";
import LogoutButton from "./LogoutButton";
import CartButton from "./CartButton";

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
    <nav aria-label="Navegación principal" className="bg-gray-800 sticky top-0">
      <div className="container mx-auto flex justify-between items-center">
        <Link
          href="/"
          className="pt-2 text-sm/5 font-semibold text-gray-100 hover:text-white focus:outline-none focus:outline-1 focus:outline-white flex items-center gap-1"
        >
          <CursorArrowRippleIcon className="w-5 h-5" />
          Logo
        </Link>
        <div className="flex items-center">
          <div className="mr-10">
            <HomeButton />
          </div>
          <div className="mr-10">
            <CartButton />
          </div>
          {AuthButton}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
