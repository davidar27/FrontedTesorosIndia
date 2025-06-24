import { useState, useCallback } from 'react';
import { SearchApi, SearchResult, SearchResponse } from '@/services/home/search';
import { Product } from '@/components/products/ProductCard';
import { Package } from '@/features/admin/packages/PackageTypes';
import { Experience } from '@/features/admin/experiences/ExperienceTypes';

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

// Transform search results function
const transformSearchResults = (searchResponse: SearchResponse): SearchResult[] => {
    const results: SearchResult[] = [];

    // Transform products
    if (searchResponse.products) {
        searchResponse.products.forEach((product: Product) => {
            results.push({
                type: 'product',
                id: product.id,
                name: product.name,
                description: product.category,
                price: product.price,
                image: product.image,
                category: product.category,
                rating: product.rating
            });
        });
    }

    // Transform packages
    if (searchResponse.packages) {
        searchResponse.packages.forEach((packageItem: Package) => {
            results.push({
                type: 'package',
                id: packageItem.id,
                name: packageItem.name,
                description: packageItem.description,
                price: packageItem.price,
                duration: packageItem.duration
            });
        });
    }

    // Transform experiences
    if (searchResponse.experiences) {
        searchResponse.experiences.forEach((experience: Experience) => {
            results.push({
                type: 'experience',
                id: experience.id || 0,
                name: experience.name_experience,
                description: experience.type,
                location: experience.location,
                image: experience.image
            });
        });
    }

    return results;
};