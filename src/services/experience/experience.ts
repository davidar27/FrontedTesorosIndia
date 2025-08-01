/* eslint-disable @typescript-eslint/no-explicit-any */
import { publicAxiosInstance } from "@/api/axiosInstance";
import { axiosInstance } from "@/api/axiosInstance";
import { Experience } from "@/features/experience/types/experienceTypes";

export const ExperienceApi = {
    getInfo: async (experience_id: number) => {
        const response = await publicAxiosInstance.get(`/experiencias/informacion/${experience_id}`);
        return response.data;
    },
    getReviews: async (experience_id: number) => {
        const response = await publicAxiosInstance.get(`/experiencias/valoraciones/${experience_id}`);
        return response.data;
    },
    getProducts: async (experience_id: number) => {
        const response = await publicAxiosInstance.get(`/experiencias/productos/${experience_id}`);
        return response.data;
    },
    getMembers: async (experience_id: number) => {
        const response = await publicAxiosInstance.get(`/experiencias/miembros/${experience_id}`);
        console.log('Respuesta del servicio getMembers:', response.data); // Debug log
        return response.data;
    },
    updateExperience: async (experienceId: number, data: Partial<Experience>) => {
        const response = await axiosInstance.put(`/experiencias/${experienceId}`, data);
        return response.data;
    },
    updateExperienceInfo: async (experienceId: number, data: FormData | any) => {
        const response = await axiosInstance.put(`/experiencias/actualizar-informacion/${experienceId}`, data, {
            headers: data instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : { 'Content-Type': 'application/json' }
        });
        return response.data;
    },
}