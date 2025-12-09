"use client";
import { useEffect } from "react";
import { useSession } from "next-auth/react";

export default function PersistUserId() {
  const { data: session, status } = useSession();

  useEffect(() => {
    const persist = () => {
      try {
        if (typeof window === "undefined") return;

        const userId = session?.user?.id;
        if (userId) {
          localStorage.setItem("userId", userId);
        } else if (status === "unauthenticated") {
          localStorage.removeItem("userId");
        }
      } catch (error) {
        console.error("Error al persistir userId:", error);
      }
    };

    persist();
  }, [session, status]);

  return null;
}
