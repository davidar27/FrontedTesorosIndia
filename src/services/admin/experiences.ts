import { axiosInstance, publicAxiosInstance } from '@/api/axiosInstance';
import { Experience, ExperienceApiResponse, RawExperienceResponse } from '@/features/admin/experiences/ExperienceTypes';

const transformExperienceResponse = (Experience: RawExperienceResponse): Experience => ({
    ...Experience,
    name: Experience.name_experience,
    description: Experience.description || '',
    location: Experience.location,
    type: Experience.type || ' ',
    status: Experience.status,
    entrepreneur_id: Experience.entrepreneur_id,
});

export const ExperiencesApi = {
    public: {
        getExperienceById: async (id: number): Promise<Experience> => {
            const response = await publicAxiosInstance.get(`/experiencias/${id}`);
            return response.data;
        },
        
        getExperiences: async (): Promise<Experience[]> => {
            const response = await publicAxiosInstance.get<{experiences: RawExperienceResponse[]}>('/experiencias/nombre?estado=Publicada');
            return response.data.experiences.map(transformExperienceResponse);
        }
    },

    // Endpoints protegidos que requieren autenticación
    getExperienceById: async (id: number): Promise<Experience> => {
        const response = await axiosInstance.get(`/experiencias/${id}`);
        return response.data;
    },

    getAllExperiences: async (): Promise<Experience[]> => {
        const response = await axiosInstance.get<ExperienceApiResponse>('/experiencias');
        return response.data.experiences;
    },

    // Obtiene la experiencia del emprendedor actual
    getMyExperience: async (): Promise<Experience> => {
        const response = await axiosInstance.get('/experiencias/mi-experiencia');
        return response.data;
    },

    createExperience: async (Experience: Partial<Experience>): Promise<Experience> => {
        const response = await axiosInstance.post('/experiencias', Experience);
        return response.data;
    },

    updateExperience: async (id: number, Experience: Partial<Experience>): Promise<Experience> => {
        const response = await axiosInstance.put(`/experiencias/${id}`, Experience);
        return response.data;
    },

    // Cambia el estado de la experiencia a "Publicada"
    publishExperience: async (id: number): Promise<Experience> => {
        const response = await axiosInstance.patch(`/experiencias/${id}/publicar`, {
            estado: 'Publicada'
        });
        return response.data;
    },

    // Cambia el estado de la experiencia a "Borrador"
    unpublishExperience: async (id: number): Promise<Experience> => {
        const response = await axiosInstance.patch(`/experiencias/${id}/despublicar`, {
            estado: 'Borrador'
        });
        return response.data;
    },

    deleteExperience: async (id: number): Promise<void> => {
        await axiosInstance.delete(`/experiencia/${id}`);
    }
}; 