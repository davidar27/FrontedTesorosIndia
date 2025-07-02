import { publicAxiosInstance } from "@/api/axiosInstance";

export const HostelApi = {
    getHostels: async () => {
        const response = await publicAxiosInstance.get("hostales/");
        return response.data;
    },
    getRoomsHostel: async (id: number) => {
        const response = await publicAxiosInstance.get(`hostales/${id}`);
        return response.data;
    },
}