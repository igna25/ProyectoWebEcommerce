"use client";
import { useEffect } from "react";

export default function PersistUserId() {
  useEffect(() => {
    const persist = async () => {
      try {
        if (typeof window === 'undefined') return;
        if (!navigator.onLine) return;
        const res = await fetch('/api/auth/session');
        if (!res.ok) return;
        const json = await res.json();
        const id = json?.user?.id;
        if (id) {
          localStorage.setItem('userId', id);
        }
      } catch {}
    };
    persist();
  }, []);
  return null;
}


