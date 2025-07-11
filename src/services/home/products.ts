import { publicAxiosInstance } from "@/api/axiosInstance";

export const ProductsApi = {
    getProducts: async (search?: string) => {
        const url = search
            ? `/productos?search=${encodeURIComponent(search)}`
            : `/productos`;
        const response = await publicAxiosInstance.get(url);
        return response.data;
    },

    getTopProducts: async (userId: string) => {
        const url = userId 
            ? `/productos/top/${encodeURIComponent(userId)}`
            : `/productos/top`;
        const response = await publicAxiosInstance.get(url);
        return response.data;
    }
}