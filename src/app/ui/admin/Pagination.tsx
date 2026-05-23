"use client";
import React from "react";
import Link from "next/link";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

const Pagination = ({
  totalPages,
  currentPage,
  query,
}: {
  totalPages: number;
  currentPage: number;
  query?: string;
}) => {
  const getPageLink = (page: number) => {
    const params = new URLSearchParams();
    params.set("page", String(page));
    if (query && query.length > 0) params.set("query", query);
    return `?${params.toString()}`;
  };

  return (
    <div className="flex justify-center items-center gap-1 my-8">
      {currentPage > 1 && (
        <Link
          href={getPageLink(currentPage - 1)}
          className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <ChevronLeftIcon className="w-4 h-4" />
          Anterior
        </Link>
      )}

      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        <Link
          key={page}
          href={getPageLink(page)}
          className={`w-9 h-9 flex items-center justify-center text-sm font-medium rounded-lg border transition-colors ${
            currentPage === page
              ? "bg-[#004AAD] text-white border-[#004AAD]"
              : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
          }`}
        >
          {page}
        </Link>
      ))}

      {currentPage < totalPages && (
        <Link
          href={getPageLink(currentPage + 1)}
          className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Siguiente
          <ChevronRightIcon className="w-4 h-4" />
        </Link>
      )}
    </div>
  );
};

export default Pagination;
