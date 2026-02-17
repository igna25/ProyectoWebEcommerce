"use client";
import { useEffect } from "react";
import { useSession } from "next-auth/react";

export default function PersistAdminRole() {
  const { data: session, status } = useSession();

  useEffect(() => {
    const persist = () => {
      try {
        if (typeof window === "undefined") return;

        const isAdmin = session?.user?.role === "admin";
        if (isAdmin) {
          localStorage.setItem("isAdmin", "true");
        } else if (status === "unauthenticated") {
          localStorage.removeItem("isAdmin");
        }
      } catch (error) {
        console.error("Error al persistir rol de admin:", error);
      }
    };

    persist();
  }, [session, status]);

  return null;
}
