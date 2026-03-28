"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { SIDENAV_ITEMS } from "./Constants";
import { SideNavItem } from "./Types";
import { Icon } from "@iconify/react";
import { signOut } from "next-auth/react";
import { clearLocalCart } from "@/lib/cache/cartCache";

const HeaderMobile = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen((prev) => !prev);
  const closeMenu = () => setIsOpen(false);

  return (
    <>
      {/* Barra superior fija */}
      <header className="md:hidden fixed top-0 left-0 right-0 z-40 h-12 bg-gray-900 flex items-center justify-between px-4 border-b border-gray-700">
        <Link
          href="/admin"
          onClick={closeMenu}
          className="font-bold text-lg text-white"
        >
          IAW<span className="text-[#004AAD]">.</span>
        </Link>
        <button
          onClick={toggleMenu}
          className="text-gray-300 hover:text-white p-1 rounded"
          aria-label="Abrir menú"
        >
          {isOpen ? (
            <Icon icon="lucide:x" width="22" height="22" />
          ) : (
            <Icon icon="lucide:menu" width="22" height="22" />
          )}
        </button>
      </header>

      {/* Overlay oscuro */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-black/50"
          onClick={closeMenu}
        />
      )}

      {/* Drawer lateral desde la izquierda */}
      <nav
        className={`md:hidden fixed top-0 left-0 z-50 h-full w-64 bg-gray-900 text-white flex flex-col transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Encabezado del drawer */}
        <div className="flex items-center justify-between px-5 h-12 border-b border-gray-700 flex-shrink-0">
          <Link
            href="/admin"
            onClick={closeMenu}
            className="font-bold text-lg text-white"
          >
            IAW<span className="text-[#004AAD]">.</span>
          </Link>
          <button
            onClick={closeMenu}
            className="text-gray-400 hover:text-white"
            aria-label="Cerrar menú"
          >
            <Icon icon="lucide:x" width="20" height="20" />
          </button>
        </div>

        {/* Ítems de navegación */}
        <div className="flex-1 overflow-y-auto py-4 px-4 space-y-1">
          {SIDENAV_ITEMS.map((item, idx) => (
            <NavItem key={idx} item={item} closeMenu={closeMenu} />
          ))}
        </div>

        {/* Botón cerrar sesión */}
        <div className="border-t border-gray-700 p-4">
          <button
            onClick={async () => {
              clearLocalCart();
              localStorage.removeItem("userId");
              localStorage.removeItem("isAdmin");
              closeMenu();
              try {
                await signOut({ redirect: false });
              } catch {}
              window.location.href = "/login";
            }}
            className="flex items-center gap-3 w-full px-3 py-2 text-sm text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
          >
            <Icon icon="lucide:log-out" width="18" height="18" />
            Cerrar sesión
          </button>
        </div>
      </nav>
    </>
  );
};

export default HeaderMobile;

const NavItem = ({
  item,
  closeMenu,
}: {
  item: SideNavItem;
  closeMenu: () => void;
}) => {
  const pathname = usePathname();
  const [subMenuOpen, setSubMenuOpen] = useState(false);

  if (item.submenu) {
    return (
      <div>
        <button
          onClick={() => setSubMenuOpen((prev) => !prev)}
          className={`flex items-center justify-between w-full px-3 py-2 text-sm rounded-lg transition-colors ${
            pathname.includes(item.path)
              ? "bg-[#004AAD]/20 text-[#60a5fa]"
              : "text-gray-300 hover:bg-gray-800 hover:text-white"
          }`}
        >
          <div className="flex items-center gap-3">
            {item.icon}
            <span className="font-medium">{item.title}</span>
          </div>
          <Icon
            icon="lucide:chevron-down"
            width="16"
            height="16"
            className={`transition-transform ${subMenuOpen ? "rotate-180" : ""}`}
          />
        </button>
        {subMenuOpen && (
          <div className="ml-8 mt-1 space-y-1">
            {item.subMenuItems?.map((subItem, idx) => (
              <Link
                key={idx}
                href={subItem.path}
                onClick={closeMenu}
                className={`block px-3 py-2 text-sm rounded-lg transition-colors ${
                  subItem.path === pathname
                    ? "bg-[#004AAD]/20 text-[#60a5fa]"
                    : "text-gray-400 hover:bg-gray-800 hover:text-white"
                }`}
              >
                {subItem.title}
              </Link>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <Link
      href={item.path}
      onClick={closeMenu}
      className={`flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-colors ${
        item.path === pathname
          ? "bg-[#004AAD]/20 text-[#60a5fa]"
          : "text-gray-300 hover:bg-gray-800 hover:text-white"
      }`}
    >
      {item.icon}
      <span className="font-medium">{item.title}</span>
    </Link>
  );
};
