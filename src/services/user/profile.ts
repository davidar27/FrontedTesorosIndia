import { axiosInstance } from "@/api/axiosInstance";
import { User } from "@/interfaces/user";

export const ProfileApi = {
    getProfile: async (id: string): Promise<User> => {
        const response = await axiosInstance.get(`/usuario/perfil/${id}`);
        return response.data;
    },
    updateProfile: async (id: string, data: FormData): Promise<User> => {
        const response = await axiosInstance.put(`/usuario/perfil/${id}`, data, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    }
}