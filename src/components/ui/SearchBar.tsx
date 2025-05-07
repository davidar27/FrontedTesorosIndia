import React from 'react';
import { Search } from 'lucide-react';

const SearchBar: React.FC = () => {
    return (
        <div className="relative w-full max-w-md mx-auto mt-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
                type="text"
                placeholder="Buscar..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
        </div>
    );
};

export default SearchBar;
