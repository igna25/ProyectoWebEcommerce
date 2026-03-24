import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Registrarse — IAW-commerce",
  description: "Crea tu cuenta en IAW-commerce",
};

export default function RegisterLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
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
            Únete a nuestra comunidad
          </p>
        </div>
      </div>
    </div>
  );
}
