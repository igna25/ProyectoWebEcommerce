"use client";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { useState } from "react";

export default function SearchBar() {
  const searchParams = useSearchParams();
  const { replace } = useRouter();
  const pathname = usePathname();
  const [search, setSearch] = useState<string>("");

  function handleSearch() {
    const params = new URLSearchParams(searchParams);
    params.set("page", "1");
    if (search) {
      params.set("query", search);
    } else {
      params.delete("query");
    }
    replace(`${pathname}?${params.toString()}`);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") handleSearch();
  }

  return (
    <div className="flex w-full sm:w-2/3 lg:w-1/2">
      <div className="relative flex-grow">
        <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        <input
          type="text"
          className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-l-xl focus:outline-none focus:ring-2 focus:ring-[#004AAD] focus:border-transparent bg-white"
          placeholder="Buscar productos..."
          defaultValue={searchParams.get("query")?.toString()}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={handleKeyDown}
        />
      </div>
      <button
        onClick={handleSearch}
        className="px-5 py-2.5 text-sm font-semibold text-white bg-[#004AAD] hover:bg-[#003d8f] rounded-r-xl transition-colors"
      >
        Buscar
      </button>
    </div>
  );
}
