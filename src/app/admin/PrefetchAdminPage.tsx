"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function PrefetchAdminPage() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname || !pathname.startsWith("/admin")) return;
    fetch(pathname, {
      method: "GET",
      credentials: "include",
      headers: { Accept: "text/html" },
    }).catch(() => {});
  }, [pathname]);

  return null;
}
