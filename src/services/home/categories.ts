import { publicAxiosInstance } from "@/api/axiosInstance";

export const CategoriesApi = {
    getCategories: async () => {
        const response = await publicAxiosInstance.get(`/categorias/`);
        return response.data;
    }
}