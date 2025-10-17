import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import RegisterSW from "./pwa/RegisterSW";
import Providers from "./Providers";
import PersistUserId from "./pwa/PersistUserId";
import { Fragment } from "react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "IAW-commerce",
  description: "IAW Commerce es una aplicación web progresiva desarrollada en el marco de la materia Ingeniería de Aplicaciones Web. Permite gestionar un bazar online con funcionalidades de catálogo, carrito de compras y administración, ofreciendo una experiencia fluida tanto en modo online como offline.",
  manifest: "/manifest.webmanifest",
  themeColor: {
    media: "(prefers-color-scheme: light)",
    color: "#004AAD",
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/icons/apple-touch-icon.png"
  }
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
            {children}
          </Providers>
        </body>
      </html>
    </Fragment>
  );
}
