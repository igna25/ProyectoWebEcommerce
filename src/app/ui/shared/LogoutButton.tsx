"use client";
import { signOut } from "next-auth/react";
import { clearLocalCart } from "@/lib/cache/cartCache";
import { isOfflineSyncSupported, queueLogout } from "@/lib/offlineQueue";

const LogoutButton = () => {
  const handleLogout = async () => {
    clearLocalCart();
    localStorage.removeItem("userId");
    localStorage.removeItem("isAdmin");
    if (!navigator.onLine) {
      if (isOfflineSyncSupported()) {
        await queueLogout();
      } else {
        localStorage.setItem("pendingLogout", "true");
      }
      try {
        await signOut({ redirect: false });
      } catch {}
      window.location.href = "/login";
      return;
    }
    try {
      await signOut({ redirect: false });
    } catch {}
    window.location.href = "/login";
  };

  return (
    <button
      onClick={handleLogout}
      className="px-4 py-1.5 text-sm font-semibold text-white bg-[#004AAD] hover:bg-[#003d8f] rounded-lg transition-colors"
    >
      Cerrar sesión
    </button>
  );
};

export default LogoutButton;
