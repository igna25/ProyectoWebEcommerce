'use client'
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';



export default function SearchBar(){
    const searchParams = useSearchParams();
    const { replace } = useRouter();
    const pathname = usePathname();
    const [search, setSearch] = useState<string>("")
    function handleSearch() {

        const params = new URLSearchParams(searchParams);

        params.set('page', '1');

        if (search) {
        params.set('query', search);
        } else {
        params.delete('query');
        }
        replace(`${pathname}?${params.toString()}`);
    }

    return (
    <div className="flex justify-center py-4">
      <div className="flex w-full sm:w-1/2">
        <input 
          type="text" 
          className="flex-grow px-4 py-2 border-2 border-gray-300 rounded-l-lg focus:outline-none focus:border-blue-500" 
          placeholder="Buscar..."
          defaultValue={searchParams.get('query')?.toString()}
          onChange={(e) => {
            setSearch(e.target.value);
          }}
        />
        <button 
            onClick={handleSearch}
            className="px-4 py-2 bg-blue-500 text-white border-2 border-blue-500 rounded-r-lg hover:bg-blue-600 focus:outline-none"
        >
          Buscar
        </button>
      </div>
    </div>
    )
}