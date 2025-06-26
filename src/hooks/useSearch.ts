import { useState, useCallback } from 'react';
import { SearchApi, SearchResult, transformSearchResults } from '@/services/home/search';



export const useSearch = () => {
    const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const search = useCallback(async (query: string) => {
        if (query.length < 2) {
            setSearchResults([]);
            setError(null);
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const searchResponse = await SearchApi.searchAll(query);
            const results = transformSearchResults(searchResponse);
            setSearchResults(results);
        } catch (err) {
            console.error('Error searching:', err);
            setError('Error al buscar. Intenta de nuevo.');
            setSearchResults([]);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const clearResults = useCallback(() => {
        setSearchResults([]);
        setError(null);
    }, []);

    return {
        searchResults,
        isLoading,
        error,
        search,
        clearResults
    };
};

