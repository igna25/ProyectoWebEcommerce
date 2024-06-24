'use client'
import React from 'react';
import Link from 'next/link';

const Pagination = ({ totalPages, currentPage, query }:{totalPages:number, currentPage:number, query?:string}) => {
  const getPageLink = (page: number, query?:string) => {
    if(query != undefined && query.length>0){
      return `?page=${page}&query=${query}`
    }
    else{
      return `?page=${page}`
    }
  }
  return (
    <div className="flex justify-center my-5">
      {currentPage > 1 && (
        <Link href={getPageLink(currentPage-1, query)} passHref>
          <div className="mx-2 px-4 py-2 cursor-pointer">Previous</div>
        </Link>
      )}
      {Array.from({ length: totalPages }, (_, index) => (
        <Link key={index + 1} href={getPageLink(index + 1,query)} passHref>
          <div className={`mx-2 px-4 py-2 cursor-pointer ${currentPage === index + 1 ? 'font-bold' : ''}`}>
            {index + 1}
          </div>
        </Link>
      ))}
      {currentPage < totalPages && (
        <Link href={getPageLink(currentPage+1, query)} passHref>
          <div className="mx-2 px-4 py-2 cursor-pointer">Next</div>
        </Link>
      )}
    </div>
  );
};

export default Pagination;
