import { publicAxiosInstance } from "@/api/axiosInstance";

export const EntrepreneursApi = {
    getEntrepreneurs: async () => {
        const response = await publicAxiosInstance.get(`/usuario/emprendedores`);
        return response.data;
    }
}