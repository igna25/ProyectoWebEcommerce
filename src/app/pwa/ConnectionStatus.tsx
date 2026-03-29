"use client";
import { useEffect, useState } from "react";
import { signOut } from "next-auth/react";

export default function ConnectionStatus() {
  const [isOnline, setIsOnline] = useState(true);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setIsOnline(navigator.onLine);

    const completePendingLogout = async () => {
      localStorage.removeItem("pendingLogout");
      try {
        await signOut({ redirect: false });
      } catch {}
      window.location.href = "/login";
    };

    if (navigator.onLine && localStorage.getItem("pendingLogout") === "true") {
      completePendingLogout();
    }

    const handleOnline = () => {
      setIsOnline(true);
      setVisible(true);
      const timer = setTimeout(() => setVisible(false), 3000);
      if (localStorage.getItem("pendingLogout") === "true") {
        completePendingLogout();
      }
      return () => clearTimeout(timer);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setVisible(true);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  if (!visible && isOnline) return null;

  return (
    <div
      className={`fixed bottom-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-4 py-2 rounded-full shadow-lg text-sm font-medium transition-all duration-300 ${
        isOnline
          ? "bg-green-100 text-green-800 border border-green-300"
          : "bg-amber-100 text-amber-800 border border-amber-300"
      }`}
    >
      <span
        className={`w-2 h-2 rounded-full ${isOnline ? "bg-green-500" : "bg-amber-500 animate-pulse"}`}
      />
      {isOnline
        ? "Conexión restaurada"
        : "Sin conexión — mostrando datos guardados"}
    </div>
  );
}
