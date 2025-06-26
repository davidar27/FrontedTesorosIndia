import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { usePageContext } from "@/context/PageContext";
import { SearchResult } from "@/services/home/search";
import { useSearch } from "@/hooks/useSearch";
import { useSearchExpansion } from "@/hooks/searchBar/useSearchExpansion";
import { getNavigationPath } from "@/features/home/searchBar/helper/getNavigationPath";
import { SearchInput } from "@/features/home/searchBar/component/SearchInput";
import { SearchResults } from "@/features/home/searchBar/component/SearchResults";

interface SearchBarProps {
    onToggle?: (expanded: boolean) => void;
    expanded?: boolean;
}


const DEBOUNCE_DELAY = 300;
export const MOBILE_BREAKPOINT = 768;

const debounce = <T extends (...args: Parameters<T>) => void>(
    func: T,
    wait: number
): ((...args: Parameters<T>) => void) => {
    let timeout: NodeJS.Timeout;
    return (...args: Parameters<T>) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
};


const useSearchLogic = () => {
    const [searchValue, setSearchValue] = useState("");
    const [showSuggestions, setShowSuggestions] = useState(false);
    const { setSearchPageValue, searchValue: globalSearchValue } = usePageContext();
    const { searchResults, isLoading, search, clearResults } = useSearch();
    const navigate = useNavigate();

    useEffect(() => {
        setSearchPageValue(searchValue);
    }, [searchValue, setSearchPageValue]);

    const debouncedSearch = useRef(
        debounce(async (query: string) => {
            await search(query);
        }, DEBOUNCE_DELAY)
    ).current;

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

    useEffect(() => {
        if (!globalSearchValue) {
            setSearchValue("");
        }
    }, [globalSearchValue]);

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

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setShowSuggestions(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [setShowSuggestions, searchRef]);

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