import { getServerSession, Session } from "next-auth";
import Link from "next/link";
import { authOptions } from "../../api/auth/[...nextauth]/auth-config";
import BuysRecordButton from "./BuysRecordButton";
import CartButton from "./CartButton";
import LoginButton from "./LoginButton";
import LogoutButton from "./LogoutButton";

const NavBar = async () => {
  const session: Session | null = await getServerSession(authOptions);

  return (
    <nav
      aria-label="Navegación principal"
      className="bg-gray-900 sticky top-0 z-50 h-14 border-b border-gray-800"
    >
      <div className="container mx-auto h-full flex justify-between items-center px-4">
        <Link
          href="/"
          className="text-lg font-bold text-white tracking-tight hover:text-blue-400 transition-colors"
        >
          IAW<span className="text-blue-400">.</span>
        </Link>

        <div className="flex items-center gap-2">
          <Link
            href="/dashboard"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
          >
            Productos
          </Link>
          <CartButton />
          {session ? (
            <>
              <BuysRecordButton />
              <LogoutButton />
            </>
          ) : (
            <LoginButton />
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
