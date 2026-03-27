"use client";
import { signOut } from "next-auth/react";
import { clearLocalCart } from "@/lib/cache/cartCache";

const LogoutButton = () => {
  return (
    <button
      onClick={() => {
        clearLocalCart();
        signOut();
      }}
      className="px-4 py-1.5 text-sm font-semibold text-white bg-[#004AAD] hover:bg-[#003d8f] rounded-lg transition-colors"
    >
      Cerrar sesión
    </button>
  );
};

export default LogoutButton;
