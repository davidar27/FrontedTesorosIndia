import { publicAxiosInstance } from "@/api/axiosInstance";

export const PackagesApi = {
    getPackageById: async (id: string) => {
        const response = await publicAxiosInstance.get(`/paquetes/${id}`);
        return response.data;
    },
    getPackageDetails: async (id: string) => {
        const response = await publicAxiosInstance.get(`/paquetes/${id}/detalles`);
        return response.data;
    }
}