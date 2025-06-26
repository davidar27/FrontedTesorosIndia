import { publicAxiosInstance } from "@/api/axiosInstance";

export const ProductsApi = {
    getProducts: async (search?: string) => {
        const url = search
            ? `/productos?search=${encodeURIComponent(search)}`
            : `/productos`;
        const response = await publicAxiosInstance.get(url);
        return response.data;
    }
}