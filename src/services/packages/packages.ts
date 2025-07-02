import { publicAxiosInstance } from "@/api/axiosInstance";

export const PackagesApi = {
    getPackageById: async (id: number) => {
        const response = await publicAxiosInstance.get(`/paquetes/${id}`);
        return response.data;
    },
}