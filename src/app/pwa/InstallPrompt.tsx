"use client";
import { useEffect, useState } from "react";

const PWA_INSTALL_DISMISSED_KEY = "pwa-install-dismissed";

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [showBanner, setShowBanner] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(display-mode: standalone)").matches) return;
    try {
      const dismissed = localStorage.getItem(PWA_INSTALL_DISMISSED_KEY);
      if (dismissed === "true") return;
    } catch {
      return;
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowBanner(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt,
      );
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    setIsInstalling(true);
    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") {
        setShowBanner(false);
        setDeferredPrompt(null);
      }
    } finally {
      setIsInstalling(false);
    }
  };

  const handleDismiss = () => {
    setShowBanner(false);
    try {
      localStorage.setItem(PWA_INSTALL_DISMISSED_KEY, "true");
    } catch {}
  };

  if (!showBanner || !deferredPrompt) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-sm z-50 flex flex-col gap-2 p-4 rounded-lg shadow-lg bg-white border border-gray-200 text-sm">
      <p className="font-medium text-gray-800">
        Instala IAW-commerce para usarla desde tu pantalla de inicio.
      </p>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={handleInstall}
          disabled={isInstalling}
          className="flex-1 bg-[#004AAD] hover:bg-[#003d8f] text-white font-semibold py-2 px-3 rounded transition-colors disabled:opacity-70"
        >
          {isInstalling ? "Instalando…" : "Instalar"}
        </button>
        <button
          type="button"
          onClick={handleDismiss}
          className="px-3 py-2 rounded font-medium text-gray-600 hover:bg-gray-100 transition-colors"
        >
          Ahora no
        </button>
      </div>
    </div>
  );
}
