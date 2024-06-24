import { Fragment } from "react";
import SideNav from "../ui/admin/sideBar/SideBar";
import Header from "../ui/admin/sideBar/header";
import HeaderMobile from "../ui/admin/sideBar/header-mobile";
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Fragment>
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
