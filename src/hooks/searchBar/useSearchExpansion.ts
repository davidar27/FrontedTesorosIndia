import { MOBILE_BREAKPOINT } from "@/features/home/searchBar/SearchBar";
import { useEffect, useState, useRef } from "react";

export const useSearchExpansion = (initialExpanded: boolean, onToggle?: (expanded: boolean) => void) => {
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