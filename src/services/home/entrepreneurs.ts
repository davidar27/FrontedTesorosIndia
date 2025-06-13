import { publicAxiosInstance } from "@/api/axiosInstance";

export const EntrepreneursApi = {
    getEntrepreneurs: async () => {
        const response = await publicAxiosInstance.get(`/productos/emprendedores`);
        return response.data;
    }
}