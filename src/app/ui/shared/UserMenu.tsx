"use client";
import { useState, useRef, useEffect } from "react";
import { signOut } from "next-auth/react";
import { UserCircleIcon } from "@heroicons/react/24/outline";
import { clearLocalCart } from "@/lib/cache/cartCache";
import { isOfflineSyncSupported, queueLogout } from "@/lib/offlineQueue";

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export default function UserMenu({ userName }: { userName?: string }) {
  const [open, setOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [isStandalone, setIsStandalone] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsStandalone(window.matchMedia("(display-mode: standalone)").matches);

    const handlePrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };
    window.addEventListener("beforeinstallprompt", handlePrompt);
    return () =>
      window.removeEventListener("beforeinstallprompt", handlePrompt);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    setOpen(false);
    setIsLoggingOut(true);
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

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    setOpen(false);
    await deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    setDeferredPrompt(null);
  };

  const showInstall = !isStandalone && !!deferredPrompt;

  if (isLoggingOut) {
    return (
      <div className="fixed inset-0 z-[9999] bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white" />
      </div>
    );
  }

  return (
    <div ref={menuRef} className="relative">
      <button
        onClick={() => setOpen((prev) => !prev)}
        aria-label="Menú de usuario"
        className="p-1.5 rounded-full text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
      >
        <UserCircleIcon className="w-6 h-6" />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-44 bg-white rounded-xl border border-gray-100 shadow-lg py-1 z-50">
          {userName && (
            <div className="px-4 py-2 text-sm font-semibold text-gray-900 border-b border-gray-100 truncate">
              {userName}
            </div>
          )}
          {showInstall && (
            <button
              onClick={handleInstall}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Instalar app
            </button>
          )}
          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cerrar sesión
          </button>
        </div>
      )}
    </div>
  );
}
