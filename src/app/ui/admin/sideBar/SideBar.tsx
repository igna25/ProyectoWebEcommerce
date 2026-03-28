"use client";

import React, { useState } from "react";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { SIDENAV_ITEMS } from "./Constants";
import { SideNavItem } from "./Types";
import { Icon } from "@iconify/react";

import { signOut } from "next-auth/react";
import { clearLocalCart } from "@/lib/cache/cartCache";
import { Button } from "@headlessui/react";

const SideNav = () => {
  return (
    <div className="md:w-60 bg-gray-900 text-white h-screen flex-1 fixed border-r border-gray-700 hidden md:flex">
      <div className="flex flex-col justify-between h-full">
        <div className="flex flex-col space-y-6 w-full">
          <Link
            href="/admin"
            className="flex flex-row space-x-2 items-center md:px-6 border-b border-gray-800 h-14 w-full"
          >
            <span className="font-bold text-xl hidden md:flex">
              IAW<span className="text-blue-400">.</span>
            </span>
            <span className="text-xs text-gray-400 hidden md:flex">Admin</span>
          </Link>

          <div className="flex flex-col space-y-1 md:px-3">
            {SIDENAV_ITEMS.map((item, idx) => {
              return <MenuItem key={idx} item={item} />;
            })}
          </div>
        </div>
        <Button
          onClick={async () => {
            clearLocalCart();
            localStorage.removeItem("userId");
            localStorage.removeItem("isAdmin");
            try {
              await signOut({ redirect: false });
            } catch {}
            window.location.href = "/login";
          }}
          className="flex flex-row space-x-3 items-center px-3 py-2.5 mx-3 mb-4 rounded-xl hover:bg-gray-800 text-gray-400 hover:text-white transition-colors"
        >
          <Icon icon="lucide:log-out" width="18" height="18" />
          <span className="font-medium text-sm flex">Cerrar sesión</span>
        </Button>
      </div>
    </div>
  );
};

export default SideNav;

const MenuItem = ({ item }: { item: SideNavItem }) => {
  const pathname = usePathname();
  const [subMenuOpen, setSubMenuOpen] = useState(false);
  const toggleSubMenu = () => {
    setSubMenuOpen(!subMenuOpen);
  };

  return (
    <div className="">
      {item.submenu ? (
        <>
          <Button
            onClick={toggleSubMenu}
            className={`flex flex-row items-center px-3 py-2.5 rounded-xl hover:bg-gray-800 w-full justify-between transition-colors ${
              pathname.includes(item.path)
                ? "bg-blue-500/10 text-blue-400"
                : "text-gray-300"
            }`}
          >
            <div className="flex flex-row space-x-3 items-center">
              {item.icon}
              <span className="font-medium text-sm">{item.title}</span>
            </div>
            <div
              className={`${subMenuOpen ? "rotate-180" : ""} flex transition-transform`}
            >
              <Icon icon="lucide:chevron-down" width="16" height="16" />
            </div>
          </Button>

          {subMenuOpen && (
            <div className="mt-1 ml-9 flex flex-col space-y-0.5">
              {item.subMenuItems?.map((subItem, idx) => {
                return (
                  <Link
                    key={idx}
                    href={subItem.path}
                    className={`text-sm py-1.5 px-3 rounded-lg transition-colors ${
                      subItem.path === pathname
                        ? "text-blue-400 font-semibold"
                        : "text-gray-400 hover:text-white"
                    }`}
                  >
                    {subItem.title}
                  </Link>
                );
              })}
            </div>
          )}
        </>
      ) : (
        <Link
          href={item.path}
          className={`flex flex-row space-x-3 items-center px-3 py-2.5 rounded-xl hover:bg-gray-800 transition-colors ${
            item.path === pathname
              ? "bg-blue-500/10 text-blue-400"
              : "text-gray-300"
          }`}
        >
          {item.icon}
          <span className="font-medium text-sm">{item.title}</span>
        </Link>
      )}
    </div>
  );
};
