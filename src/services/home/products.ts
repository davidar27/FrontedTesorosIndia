import { publicAxiosInstance } from "@/api/axiosInstance";

export const ProductsApi = {
    getProducts: async () => {
        const response = await publicAxiosInstance.get(`/productos/`);
        return response.data;
    }
}