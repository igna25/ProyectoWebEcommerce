"use client";
import { Fragment } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SideNav from "../ui/admin/sideBar/SideBar";
import HeaderMobile from "../ui/admin/sideBar/HeaderMobile";
import PrefetchAdminPage from "./PrefetchAdminPage";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Fragment>
      <ToastContainer position="top-right" />
      <PrefetchAdminPage />
      <SideNav></SideNav>
      <main className="flex-1">
        <div className="flex flex-col md:ml-60 sm:border-r sm:border-zinc-700 min-h-screen">
          <HeaderMobile />
          <div className="flex flex-col pt-2 px-4 space-y-2 bg-zinc-100 flex-grow pb-4">
            {children}
          </div>
        </div>
      </main>
    </Fragment>
  );
}
