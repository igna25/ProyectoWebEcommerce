import Link from "next/link";
import Image from "next/image";
import CartButton from "./CartButton";
import NavbarAuthSection from "./NavbarAuthSection";

const NavBar = () => {
  return (
    <nav
      aria-label="Navegación principal"
      className="bg-gray-900 sticky top-0 z-50 h-14 border-b border-gray-800"
    >
      <div className="container mx-auto h-full flex justify-between items-center px-4">
        <Link href="/" className="hover:opacity-80 transition-opacity">
          <Image
            src="/icons/iaw-navbar.svg"
            alt="IAW Commerce"
            width={40}
            height={40}
            priority
          />
        </Link>

        <div className="flex items-center gap-2">
          <Link
            href="/dashboard"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
          >
            Productos
          </Link>
          <CartButton />
          <NavbarAuthSection />
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
