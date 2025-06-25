/* eslint-disable @typescript-eslint/no-explicit-any */
import { Search, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { usePageContext } from "@/context/PageContext";
import { SearchResult } from "@/services/home/search";
import { useSearch } from "@/hooks/useSearch";
import Picture from "../../../components/ui/display/Picture";
import { getImageUrl } from "@/utils/getImageUrl";
import LoadingSpinner from "@/components/layouts/LoadingSpinner";

// Types and interfaces
interface SearchBarProps {
    onToggle?: (expanded: boolean) => void;
    expanded?: boolean;
}

interface SearchInputProps {
    searchValue: string;
    isExpanded: boolean;
    onSearchClick: () => void;
    onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onClose: () => void;
}

interface SearchResultsProps {
    showSuggestions: boolean;
    searchResults: SearchResult[];
    isLoading: boolean;
    searchValue: string;
    onResultClick: (result: SearchResult) => void;
}

// Constants
const DEBOUNCE_DELAY = 300;
const MIN_SEARCH_LENGTH = 2;
const MOBILE_BREAKPOINT = 768;

// Utility function - moved to top for better organization
const debounce = <T extends (...args: any[]) => any>(
    func: T,
    wait: number
): ((...args: Parameters<T>) => void) => {
    let timeout: NodeJS.Timeout;
    return (...args: Parameters<T>) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
};

// Helper function for result type labels
const getResultTypeLabel = (type: SearchResult['type']): string => {
    const typeLabels = {
        'product': 'Producto',
        'package': 'Paquete',
        'experience': 'Experiencia'
    } as const;

    return typeLabels[type] || 'Resultado';
};

// Navigation helper
const getNavigationPath = (result: SearchResult): string => {
    const encodedName = encodeURIComponent(result.name || '');

    switch (result.type) {
        case 'product':
            return `/productos?search=${encodedName}`;
        case 'package':
            return `/productos?type=package&search=${encodedName}`;
        case 'experience':
            return `/experiencias/${result.id}`;
        default:
            return `/productos?search=${encodedName}`;
    }
};

// Custom hook for search expansion logic
const useSearchExpansion = (initialExpanded: boolean, onToggle?: (expanded: boolean) => void) => {
    const [isExpanded, setIsExpanded] = useState(initialExpanded);
    const searchRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        onToggle?.(isExpanded);
    }, [isExpanded, onToggle]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                if (window.innerWidth < MOBILE_BREAKPOINT) {
                    setIsExpanded(false);
                }
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return { isExpanded, setIsExpanded, searchRef };
};

// Custom hook for search logic
const useSearchLogic = () => {
    const [searchValue, setSearchValue] = useState("");
    const [showSuggestions, setShowSuggestions] = useState(false);
    const { setSearchPageValue } = usePageContext();
    const { searchResults, isLoading, search, clearResults } = useSearch();
    const navigate = useNavigate();

    // Update page context when search value changes
    useEffect(() => {
        setSearchPageValue(searchValue);
    }, [searchValue, setSearchPageValue]);

    // Debounced search function
    const debouncedSearch = useCallback(
        debounce(async (query: string) => {
            await search(query);
        }, DEBOUNCE_DELAY),
        [search]
    );

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchValue(value);

        if (value.length > 0) {
            setShowSuggestions(true);
            debouncedSearch(value);
        } else {
            clearResults();
            setShowSuggestions(false);
        }
    };

    const handleResultClick = (result: SearchResult) => {
        setSearchValue(result.name || '');
        setShowSuggestions(false);
        navigate(getNavigationPath(result));
    };

    const clearSearch = () => {
        setSearchValue("");
        setShowSuggestions(false);
        clearResults();
    };

    return {
        searchValue,
        showSuggestions,
        searchResults,
        isLoading,
        setShowSuggestions,
        handleInputChange,
        handleResultClick,
        clearSearch
    };
};



// No results component
const NoResults: React.FC<{ searchValue: string }> = ({ searchValue }) => (
    <div className="px-4 py-3 text-gray-500 text-center">
        No se encontraron resultados para "{searchValue}"
    </div>
);

// Search result item component
const SearchResultItem: React.FC<{
    result: SearchResult;
    onClick: (result: SearchResult) => void;
}> = ({ result, onClick }) => (
    <motion.div
        whileHover={{ backgroundColor: "rgba(0, 166, 80, 0.1)" }}
        className="px-4 py-3 cursor-pointer border-b border-gray-100 last:border-b-0 hover:bg-green-50 transition-colors"
        onClick={() => onClick(result)}
    >
        <div className="flex items-center gap-3">
            <div className="flex-shrink-0">
                <Picture
                    className="w-8 h-8 rounded object-cover"
                    src={getImageUrl(result.image)}
                    alt={result.name || 'Resultado de búsqueda'}
                />
            </div>
            <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium text-gray-900 truncate">
                        {result.name}
                    </h4>
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full ml-2">
                        {getResultTypeLabel(result.type)}
                    </span>
                </div>
            </div>
        </div>
    </motion.div>
);

// Search input component
const SearchInput: React.FC<SearchInputProps> = ({
    searchValue,
    isExpanded,
    onSearchClick,
    onInputChange,
    onClose
}) => (
    <motion.div
        className={`relative ${isExpanded ? 'w-full' : 'w-40'} sm:w-60 md:w-80 lg:w-100 !text-black`}
        whileFocus={{ scale: 1.02 }}
        layout
        transition={{ duration: 0.3, ease: "easeOut" }}
    >
        <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10 text-gray-400"
            size={20}
        />

        <motion.input
            type="text"
            placeholder="Buscar productos, paquetes, experiencias..."
            value={searchValue}
            onChange={onInputChange}
            onClick={onSearchClick}
            className="w-full pl-10 pr-8 py-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-primary bg-white/90 text-gray-900 placeholder-gray-500"
            whileHover={{
                backgroundColor: "rgba(255, 255, 255, 1)",
                transition: { duration: 0.2 }
            }}
        />

        <AnimatePresence>
            {isExpanded && (
                <motion.button
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 z-10 text-gray-400 hover:text-gray-600"
                    onClick={onClose}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                >
                    <X size={20} />
                </motion.button>
            )}
        </AnimatePresence>
    </motion.div>
);

// Search results dropdown component
const SearchResults: React.FC<SearchResultsProps> = ({
    showSuggestions,
    searchResults,
    isLoading,
    searchValue,
    onResultClick
}) => (
    <AnimatePresence>
        {showSuggestions && (searchResults.length > 0 || isLoading || searchValue.length >= MIN_SEARCH_LENGTH) && (
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden max-h-96 overflow-y-auto"
            >
                {isLoading ? (
                    <LoadingSpinner
                        message="Buscando..."
                        position="center"
                        size="md"
                        variant="primary"
                        speed="slow"
                        overlayBg="bg-white/90"
                    />
                ) : searchResults.length > 0 ? (
                    <>
                        {searchResults.map((result) => (
                            <SearchResultItem
                                key={`${result.type}-${result.id}`}
                                result={result}
                                onClick={onResultClick}
                            />
                        ))}
                        <div className="px-4 py-2 text-xs text-gray-500 text-center border-t border-gray-100">
                            Presiona Enter para ver todos los resultados
                        </div>
                    </>
                ) : searchValue.length >= MIN_SEARCH_LENGTH ? (
                    <NoResults searchValue={searchValue} />
                ) : null}
            </motion.div>
        )}
    </AnimatePresence>
);

// Main SearchBar component
const SearchBar: React.FC<SearchBarProps> = ({ onToggle, expanded = false }) => {
    const { isExpanded, setIsExpanded, searchRef } = useSearchExpansion(expanded, onToggle);
    const {
        searchValue,
        showSuggestions,
        searchResults,
        isLoading,
        setShowSuggestions,
        handleInputChange,
        handleResultClick,
        clearSearch
    } = useSearchLogic();

    const handleSearchClick = () => {
        if (window.innerWidth < MOBILE_BREAKPOINT) {
            setIsExpanded(true);
        }
        setShowSuggestions(true);
    };

    const handleClose = () => {
        setIsExpanded(false);
        clearSearch();
    };

    // Close suggestions when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setShowSuggestions(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [setShowSuggestions]);

    return (
        <div ref={searchRef} className="relative">
            <SearchInput
                searchValue={searchValue}
                isExpanded={isExpanded}
                onSearchClick={handleSearchClick}
                onInputChange={handleInputChange}
                onClose={handleClose}
            />

            <SearchResults
                showSuggestions={showSuggestions}
                searchResults={searchResults}
                isLoading={isLoading}
                searchValue={searchValue}
                onResultClick={handleResultClick}
            />
        </div>
    );
};

export default SearchBar;