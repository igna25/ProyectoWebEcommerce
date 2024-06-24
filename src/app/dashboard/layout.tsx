import { Fragment } from "react";
import NavBar from "../ui/navBar";
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Fragment>
      <NavBar></NavBar>
      <main className="flex-1">
        <div className="flex flex-col pt-2 px-2 space-y-2 bg-zinc-100 flex-grow pb-4">
          {children}
        </div>
      </main>
    </Fragment>
  );
}