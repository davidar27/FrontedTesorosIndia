import LoadingSpinner from "@/components/layouts/LoadingSpinner";
import { SearchResult } from "@/services/home/search";
import { motion, AnimatePresence } from "framer-motion";
import { SearchResultItem } from "@/features/home/searchBar/component/SearchResultItem";
import { NoResults } from "@/features/home/searchBar/component/NoResults";


interface SearchResultsProps {
    showSuggestions: boolean;
    searchResults: SearchResult[];
    isLoading: boolean;
    searchValue: string;
    onResultClick: (result: SearchResult) => void;
}
const MIN_SEARCH_LENGTH = 2;


export const SearchResults: React.FC<SearchResultsProps> = ({
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
