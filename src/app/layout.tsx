import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import RegisterSW from "./pwa/RegisterSW";
import Providers from "./Providers";
import PersistUserId from "./pwa/PersistUserId";
import PersistAdminRole from "./pwa/PersistAdminRole";
import ConnectionStatus from "./pwa/ConnectionStatus";
import InstallPrompt from "./pwa/InstallPrompt";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "IAW-commerce",
  description:
    "IAW Commerce es una aplicación web progresiva desarrollada en el marco de la materia Ingeniería de Aplicaciones Web. Permite gestionar un bazar online con funcionalidades de catálogo, carrito de compras y administración, ofreciendo una experiencia fluida tanto en modo online como offline.",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: "/icons/iaw-favicon-32.svg",
    apple: "/icons/iaw-96.svg",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
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
    <html lang="es">
      <body className={inter.className}>
        <Providers>
          <RegisterSW />
          <PersistUserId />
          <PersistAdminRole />
          <ConnectionStatus />
          <InstallPrompt />
          {children}
        </Providers>
      </body>
    </html>
  );
}
