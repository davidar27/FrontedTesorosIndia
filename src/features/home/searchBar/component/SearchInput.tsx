import { Search, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface SearchInputProps {
    searchValue: string;
    isExpanded: boolean;
    onSearchClick: () => void;
    onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onClose: () => void;
}

export const SearchInput: React.FC<SearchInputProps> = ({
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
