import { Search } from 'lucide-react';

interface SearchBarProps {
    searchTerm: string;
    placeholder: string;
    onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onClearSearch: () => void;
    entityNamePlural: string;
    width?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
    searchTerm,
    placeholder,
    onSearchChange,
    onClearSearch,
    entityNamePlural,
    width
}) => (
    <div className={`relative flex-1 max-w-md ${width}`}>
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
        <input
            type="text"
            placeholder={placeholder}
            value={searchTerm}
            onChange={onSearchChange}
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-4 focus:ring-green-100 transition-all duration-300 bg-white shadow-md"
            aria-label={`Buscar ${entityNamePlural.toLowerCase()}`}
        />
        {searchTerm && (
            <button
                onClick={onClearSearch}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Limpiar búsqueda"
            >
                ×
            </button>
        )}
    </div>
); 