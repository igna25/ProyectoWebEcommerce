import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import RegisterSW from "./pwa/RegisterSW";
import Providers from "./Providers";
import PersistUserId from "./pwa/PersistUserId";
import ConnectionStatus from "./pwa/ConnectionStatus";
import { Fragment } from "react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "IAW-commerce",
  description:
    "IAW Commerce es una aplicación web progresiva desarrollada en el marco de la materia Ingeniería de Aplicaciones Web. Permite gestionar un bazar online con funcionalidades de catálogo, carrito de compras y administración, ofreciendo una experiencia fluida tanto en modo online como offline.",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: "/favicon.ico",
    apple: "/icons/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#004AAD",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Fragment>
      <html lang="en">
        <body className={inter.className}>
          <Providers>
            <RegisterSW />
            <PersistUserId />
            <ConnectionStatus />
            {children}
          </Providers>
        </body>
      </html>
    </Fragment>
  );
}
