import type { Metadata } from "next";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Iniciar sesión — IAW-commerce",
  description: "Ingresa a tu cuenta de IAW-commerce",
};

export default function LoginLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <div className="flex w-full min-h-screen">
          <div className="w-full flex items-center justify-center bg-gray-50 px-4 lg:w-1/2">
            {children}
          </div>
          <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-gray-900 via-[#003580] to-[#004AAD] items-center justify-center p-12">
            <div className="text-center text-white">
              <p className="text-5xl font-extrabold tracking-tight mb-3">
                IAW<span className="text-blue-300">.</span>
              </p>
              <p className="text-blue-200 text-lg font-medium">
                Tu tienda online de confianza
              </p>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
