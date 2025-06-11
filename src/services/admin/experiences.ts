import { axiosInstance, publicAxiosInstance } from '@/api/axiosInstance';
import { Experience, ExperienceApiResponse, RawExperienceResponse } from '@/features/admin/experiences/ExperienceTypes';

const transformExperienceResponse = (Experience: RawExperienceResponse): Experience => ({
    ...Experience,
    name: Experience.name_experience,
    location: Experience.location,
    type: Experience.type || ' ',
    status: Experience.status,
    logo: Experience.logo,
    name_entrepreneur: Experience.name_entrepreneur,
});

export const ExperiencesApi = {
    public: {
        getExperienceById: async (id: number): Promise<Experience> => {
            const response = await publicAxiosInstance.get(`/dashboard/experiencias/${id}`);
            return response.data;
        },
        
        getExperiences: async (): Promise<Experience[]> => {
            const response = await publicAxiosInstance.get<{experiences: RawExperienceResponse[]}>('/dashboard/experiencias/nombre?estado=Publicada');
            return response.data.experiences.map(transformExperienceResponse);
        }
    },

    // Endpoints protegidos que requieren autenticación
    getExperienceById: async (id: number): Promise<Experience> => {
        const response = await axiosInstance.get(`/dashboard/experiencias/${id}`);
        return response.data;
    },

    getAllExperiences: async (): Promise<Experience[]> => {
        const response = await axiosInstance.get<ExperienceApiResponse>('/dashboard/experiencias');
        return response.data.experiences;
    },

    // Obtiene la experiencia del emprendedor actual
    getMyExperience: async (): Promise<Experience> => {
        const response = await axiosInstance.get('/dashboard/experiencias/mi-experiencia');
        return response.data;
    },


    updateExperience: async (id: number, Experience: Partial<Experience>): Promise<Experience> => {
        const response = await axiosInstance.put(`/dashboard/experiencias/${id}`, Experience);
        return response.data;
    },

    deleteExperience: async (id: number): Promise<void> => {
        await axiosInstance.delete(`/experiencia/${id}`);
    },

    changeStatus: async (id: number, data: { status: string; entityType: string }): Promise<Experience> => {
        const response = await axiosInstance.patch(`/dashboard/estado/${id}`, data);
        return response.data;
    }
}; 