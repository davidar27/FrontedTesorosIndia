import { Search, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";

interface SearchBarProps {
    onToggle?: (expanded: boolean) => void;
    expanded?: boolean;
}

const mockSuggestions = [
    "Tours culturales",
    "Gastronomía local",
    "Aventura en la selva",
    "Artesanías tradicionales",
    "Festivales indígenas"
];

const SearchBar = ({ onToggle, expanded = false }: SearchBarProps) => {
    const [isExpanded, setIsExpanded] = useState(expanded);
    const [searchValue, setSearchValue] = useState("");
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const searchRef = useRef<HTMLDivElement>(null);

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
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchValue(value);

        // Simulación de autocompletado
        if (value.length > 0) {
            const filtered = mockSuggestions.filter(suggestion =>
                suggestion.toLowerCase().includes(value.toLowerCase())
            );
            setSuggestions(filtered);
            setShowSuggestions(true);
        } else {
            setSuggestions([]);
        }
    };

    const selectSuggestion = (suggestion: string) => {
        setSearchValue(suggestion);
        setShowSuggestions(false);
        // Aquí podrías redirigir a la página de búsqueda
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
                    placeholder="Buscar..."
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

            {/* Sugerencias de autocompletado */}
            <AnimatePresence>
                {showSuggestions && suggestions.length > 0 && (
                    <motion.ul
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden"
                    >
                        {suggestions.map((suggestion, index) => (
                            <motion.li
                                key={index}
                                whileHover={{ backgroundColor: "rgba(0, 166, 80, 0.1)" }}
                                className="px-4 py-2 cursor-pointer text-black"
                                onClick={() => selectSuggestion(suggestion)}
                            >
                                {suggestion}
                            </motion.li>
                        ))}
                    </motion.ul>
                )}
            </AnimatePresence>
        </div>
    );
};

export default SearchBar;