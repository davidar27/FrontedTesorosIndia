import { publicAxiosInstance } from "@/api/axiosInstance";

export const PackagesApi = {
    getPackages: async () => {
        const response = await publicAxiosInstance.get(`/paquetes/`);
        return response.data;
    }
    
}