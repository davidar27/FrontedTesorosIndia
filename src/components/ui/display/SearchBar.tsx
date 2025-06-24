/* eslint-disable @typescript-eslint/no-explicit-any */
import { Search, X, Package, Star, MapPin } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef, useCallback } from "react";
import { usePageContext } from "@/context/PageContext";
import { SearchResult } from "@/services/home/search";
import { useNavigate } from "react-router-dom";
import { useSearch } from "@/hooks/useSearch";
import { formatPrice } from "@/utils/formatPrice";

interface SearchBarProps {
    onToggle?: (expanded: boolean) => void;
    expanded?: boolean;
}

const SearchBar = ({ onToggle, expanded = false }: SearchBarProps) => {
    const [isExpanded, setIsExpanded] = useState(expanded);
    const [searchValue, setSearchValue] = useState("");
    const { setSearchPageValue } = usePageContext();
    const [showSuggestions, setShowSuggestions] = useState(false);
    const searchRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();
    const { searchResults, isLoading, search, clearResults } = useSearch();

    useEffect(() => {
        if (onToggle) {
            onToggle(isExpanded);
        }
    }, [isExpanded, onToggle]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                if (window.innerWidth < 768) {
                    setIsExpanded(false);
                }
                setShowSuggestions(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleSearchClick = () => {
        if (window.innerWidth < 768) {
            setIsExpanded(true);
        }
        setShowSuggestions(true);
    };

    const handleClose = () => {
        setIsExpanded(false);
        setSearchValue("");
        setShowSuggestions(false);
        clearResults();
    };

    useEffect(() => {
        setSearchPageValue(searchValue);
    }, [searchValue, setSearchPageValue]);

    // Debounced search function
    const debouncedSearch = useCallback(
        debounce(async (query: string) => {
            await search(query);
        }, 300),
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
        setSearchValue(result.name);
        setShowSuggestions(false);
        
        // Navigate based on result type using the correct routes
        switch (result.type) {
            case 'product':
                navigate(`/productos?search=${encodeURIComponent(result.name)}`);
                break;
            case 'package':
                // Since there's no public packages route, navigate to products with package filter
                navigate(`/productos?type=package&search=${encodeURIComponent(result.name)}`);
                break;
            case 'experience':
                navigate(`/experiencias/${result.id}`);
                break;
        }
    };

    const getResultIcon = (type: SearchResult['type']) => {
        switch (type) {
            case 'product':
                return <Package className="w-4 h-4" />;
            case 'package':
                return <Package className="w-4 h-4" />;
            case 'experience':
                return <MapPin className="w-4 h-4" />;
            default:
                return <Search className="w-4 h-4" />;
        }
    };

    const getResultTypeLabel = (type: SearchResult['type']) => {
        switch (type) {
            case 'product':
                return 'Producto';
            case 'package':
                return 'Paquete';
            case 'experience':
                return 'Experiencia';
            default:
                return 'Resultado';
        }
    };

    return (
        <div ref={searchRef} className="relative">
            <motion.div
                className={`relative ${isExpanded ? 'w-full' : 'w-40'} sm:w-60 md:w-80 lg:w-100 !text-black`}
                whileFocus={{ scale: 1.02 }}
                layout
                transition={{ duration: 0.3, ease: "easeOut" }}
            >
                <Search
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10"
                    size={20}
                />

                <motion.input
                    type="text"
                    placeholder="Buscar productos, paquetes, experiencias..."
                    value={searchValue}
                    onChange={handleInputChange}
                    onClick={handleSearchClick}
                    className="w-full pl-10 pr-8 py-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-primary bg-white/90"
                    whileHover={{
                        backgroundColor: "rgba(255, 255, 255, 1)",
                        transition: { duration: 0.2 }
                    }}
                />

                {isExpanded && (
                    <motion.button
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 z-10"
                        onClick={handleClose}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.2 }}
                    >
                        <X size={20} />
                    </motion.button>
                )}
            </motion.div>

            {/* Search Results */}
            <AnimatePresence>
                {showSuggestions && (searchResults.length > 0 || isLoading) && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden max-h-96 overflow-y-auto"
                    >
                        {isLoading ? (
                            <div className="px-4 py-3 text-gray-500 text-center">
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary mx-auto"></div>
                                <span className="ml-2">Buscando...</span>
                            </div>
                        ) : searchResults.length > 0 ? (
                            <>
                                {searchResults.map((result) => (
                                    <motion.div
                                        key={`${result.type}-${result.id}`}
                                        whileHover={{ backgroundColor: "rgba(0, 166, 80, 0.1)" }}
                                        className="px-4 py-3 cursor-pointer border-b border-gray-100 last:border-b-0 hover:bg-green-50 transition-colors"
                                        onClick={() => handleResultClick(result)}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="flex-shrink-0 text-green-600">
                                                {getResultIcon(result.type)}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between">
                                                    <h4 className="text-sm font-medium text-gray-900 truncate">
                                                        {result.name}
                                                    </h4>
                                                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                                                        {getResultTypeLabel(result.type)}
                                                    </span>
                                                </div>
                                                {result.description && (
                                                    <p className="text-xs text-gray-500 truncate mt-1">
                                                        {result.description}
                                                    </p>
                                                )}
                                                <div className="flex items-center gap-2 mt-1">
                                                    {result.price && (
                                                        <span className="text-xs font-medium text-green-600">
                                                            {formatPrice(Number(result.price))}
                                                        </span>
                                                    )}
                                                    {result.rating && (
                                                        <div className="flex items-center gap-1">
                                                            <Star className="w-3 h-3 text-yellow-400 fill-current" />
                                                            <span className="text-xs text-gray-500">
                                                                {result.rating}
                                                            </span>
                                                        </div>
                                                    )}
                                                    {result.location && (
                                                        <span className="text-xs text-gray-500 flex items-center gap-1">
                                                            <MapPin className="w-3 h-3" />
                                                            {result.location}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                                <div className="px-4 py-2 text-xs text-gray-500 text-center border-t border-gray-100">
                                    Presiona Enter para ver todos los resultados
                                </div>
                            </>
                        ) : searchValue.length >= 2 ? (
                            <div className="px-4 py-3 text-gray-500 text-center">
                                No se encontraron resultados para "{searchValue}"
                            </div>
                        ) : null}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

// Debounce utility function
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

export default SearchBar;