import { SearchResult } from "@/services/home/search";
import { motion } from "framer-motion";
import Picture from "@/components/ui/display/Picture";
import { getImageUrl } from "@/utils/getImageUrl";
import { getResultTypeLabel } from "@/features/home/searchBar/helper/getResultTypeLabel";

export const SearchResultItem: React.FC<{
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