import { axiosInstance, publicAxiosInstance } from '@/api/axiosInstance';
import { Experience, RawExperienceResponse } from '@/features/admin/experiences/ExperienceTypes';

const transformExperienceResponse = (Experience: RawExperienceResponse): Experience => ({
    ...Experience,
    name: Experience.name_experience,
    location: Experience.location,
    type: Experience.type || ' ',
    status: Experience.status
});

export const ExperiencesApi = {
    getExperienceById: async (id: number): Promise<Experience> => {
        const response = await publicAxiosInstance.get(`/dashboard/experiencias/${id}`);
        return response.data;
    },

    getExperiences: async (): Promise<Experience[]> => {
        const response = await publicAxiosInstance.get<{ experiences: RawExperienceResponse[] }>('/experiencias/nombre?estado=Publicada');
        return response.data.experiences.map(transformExperienceResponse);
    },

    getExperiencesHome: async () => {
        const response = await publicAxiosInstance.get('/experiencias/mapa');
        return response.data;
    },

    gettotalIncome: async (userId : string) => {
        const response = await axiosInstance.get(`/experiencias/ingresos/${userId}`);
        return response.data;
    }

}