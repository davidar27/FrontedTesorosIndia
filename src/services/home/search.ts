import { publicAxiosInstance } from "@/api/axiosInstance";
import { Product } from "@/features/products/components/ProductCard";
import { Package } from "@/features/admin/packages/PackageTypes";
import { Experience } from "@/features/admin/experiences/ExperienceTypes";

export interface SearchResult {
    type: 'product' | 'package' | 'experience';
    id: number;
    name?: string;
    image?: string;
    category?: string;
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
                publicAxiosInstance.get(`/productos/buscar?search=${encodeURIComponent(query)}`),
                publicAxiosInstance.get(`/paquetes/buscar?search=${encodeURIComponent(query)}`),
                publicAxiosInstance.get(`/experiencias/buscar?search=${encodeURIComponent(query)}`)
            ]);

            return {
                products: productsRes.data.products || [],
                packages: packagesRes.data.packages || [],
                experiences: experiencesRes.data.experiences || []
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
            const response = await publicAxiosInstance.get(`/productos/buscar?search=${encodeURIComponent(query)}`);
            return response.data.products || [];
        } catch (error) {
            console.error('Error searching products:', error);
            return [];
        }
    },

    searchPackages: async (query: string): Promise<Package[]> => {
        try {
            const response = await publicAxiosInstance.get(`/paquetes/buscar?search=${encodeURIComponent(query)}`);
            return response.data.packages || [];
        } catch (error) {
            console.error('Error searching packages:', error);
            return [];
        }
    },

    searchExperiences: async (query: string): Promise<Experience[]> => {
        try {
            const response = await publicAxiosInstance.get(`/experiencias/buscar?search=${encodeURIComponent(query)}`);
            return response.data.experiences || [];
        } catch (error) {
            console.error('Error searching experiences:', error);
            return [];
        }
    }
};

export const transformSearchResults = (searchResponse: SearchResponse): SearchResult[] => {
    const results: SearchResult[] = [];

    (searchResponse.products ?? []).forEach(product => {
        results.push({
            type: 'product',
            id: product.id || 0,
            name: product.name || product.name_product || '',
            image: product.image || '',
            category: product.category || '',
        });
    });

    (searchResponse.packages ?? []).forEach(pkg => {
        results.push({
            type: 'package',
            id: pkg.id || 0,
            name: pkg.name || pkg.name_package || '',
            image: pkg.image || '',
        });
    });

    (searchResponse.experiences ?? []).forEach((experience: Experience) => {
        results.push({
            type: 'experience',
            id: experience.id || 0,
            name: experience.name_experience || '',
            image: experience.image || '',
            category: experience.type || '',
        });
    });

    return results;
}; 