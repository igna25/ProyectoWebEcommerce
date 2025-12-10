"use client";
import { useEffect } from "react";

export default function RegisterSW() {
  useEffect(() => {
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      const register = async () => {
        try {
          const reg = await navigator.serviceWorker.register("/sw.js");

          reg.addEventListener("updatefound", () => {
            const newWorker = reg.installing;
            if (!newWorker) return;

            newWorker.addEventListener("statechange", () => {
              if (
                newWorker.state === "installed" &&
                navigator.serviceWorker.controller
              ) {
                console.log("Nueva versión del service worker disponible");

                if (
                  confirm(
                    "Hay una actualización disponible. ¿Deseas recargar la página?",
                  )
                ) {
                  window.location.reload();
                }
              }
            });
          });

          if (reg && reg.update) {
            await reg.update();
          }

          console.log("Service Worker registrado exitosamente");
        } catch (error) {
          console.error("Error al registrar el service worker:", error);
        }
      };
      register();
    }
  }, []);

  return null;
}
