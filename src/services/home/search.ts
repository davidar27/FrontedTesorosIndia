import { publicAxiosInstance } from "@/api/axiosInstance";
import { Product } from "@/components/products/ProductCard";
import { Package } from "@/features/admin/packages/PackageTypes";
import { Experience } from "@/features/admin/experiences/ExperienceTypes";

export interface SearchResult {
    type: 'product' | 'package' | 'experience';
    id: number;
    name: string;
    description?: string;
    price?: string | number;
    image?: string;
    category?: string;
    location?: string;
    duration?: string;
    rating?: number;
}

export interface SearchResponse {
    products: Product[];
    packages: Package[];
    experiences: Experience[];
}

export const SearchApi = {
    searchAll: async (query: string): Promise<SearchResponse> => {
        try {
            const [productsRes, packagesRes, experiencesRes] = await Promise.all([
                publicAxiosInstance.get(`/productos/?search=${encodeURIComponent(query)}`),
                publicAxiosInstance.get(`/paquetes/?search=${encodeURIComponent(query)}`),
                publicAxiosInstance.get(`/experiencias/?buscar=${encodeURIComponent(query)}`)
            ]);

            return {
                products: productsRes.data || [],
                packages: packagesRes.data || [],
                experiences: experiencesRes.data || []
            };
        } catch (error) {
            console.error('Error searching:', error);
            return {
                products: [],
                packages: [],
                experiences: []
            };
        }
    },

    // Search individual entities
    searchProducts: async (query: string): Promise<Product[]> => {
        try {
            const response = await publicAxiosInstance.get(`/productos/?search=${encodeURIComponent(query)}`);
            return response.data || [];
        } catch (error) {
            console.error('Error searching products:', error);
            return [];
        }
    },

    searchPackages: async (query: string): Promise<Package[]> => {
        try {
            const response = await publicAxiosInstance.get(`/paquetes/?search=${encodeURIComponent(query)}`);
            return response.data || [];
        } catch (error) {
            console.error('Error searching packages:', error);
            return [];
        }
    },

    searchExperiences: async (query: string): Promise<Experience[]> => {
        try {
            const response = await publicAxiosInstance.get(`/experiencias/?buscar=${encodeURIComponent(query)}`);
            return response.data || [];
        } catch (error) {
            console.error('Error searching experiences:', error);
            return [];
        }
    }
};

// Utility function to transform search results into a unified format
export const transformSearchResults = (searchResponse: SearchResponse): SearchResult[] => {
    const results: SearchResult[] = [];

    // Transform products
    searchResponse.products.forEach(product => {
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

    // Transform packages
    searchResponse.packages.forEach(pkg => {
        results.push({
            type: 'package',
            id: pkg.id,
            name: pkg.name,
            description: pkg.description,
            price: pkg.price,
            duration: pkg.duration
        });
    });

    // Transform experiences
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