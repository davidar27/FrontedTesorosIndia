import { publicAxiosInstance } from "@/api/axiosInstance";

export const ProductsApi = {
    getProductById: async (id: number) => {
        const response = await publicAxiosInstance.get(`/productos/informacion/${id}`);
        return response.data;
    },
}