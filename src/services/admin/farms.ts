import { axiosInstance, publicAxiosInstance } from '@/api/axiosInstance';
import { Farm, FarmApiResponse } from '@/features/admin/farms/FarmTypes';


export const farmsApi = {
    public: {
        getFarmById: async (id: number): Promise<Farm> => {
            const response = await publicAxiosInstance.get(`/finca/${id}`);
            return response.data;
        },
        
        getAllFarms: async (): Promise<Farm[]> => {
            const response = await publicAxiosInstance.get<FarmApiResponse>('/finca');
            return response.data.farms;
        },
    },

    // Endpoints protegidos que requieren autenticación
    getFarmById: async (id: number): Promise<Farm> => {
        const response = await axiosInstance.get(`/finca/${id}`);
        return response.data;
    },

    getAllFarms: async (): Promise<Farm[]> => {
        const response = await axiosInstance.get<FarmApiResponse>('/finca');
        return response.data.farms;
    },

    // Obtiene la finca del emprendedor actual
    getMyFarm: async (): Promise<Farm> => {
        const response = await axiosInstance.get('/finca/mi-finca');
        return response.data;
    },

    createFarm: async (farm: Partial<Farm>): Promise<Farm> => {
        const response = await axiosInstance.post('/finca', farm);
        return response.data;
    },

    updateFarm: async (id: number, farm: Partial<Farm>): Promise<Farm> => {
        const response = await axiosInstance.put(`/finca/${id}`, farm);
        return response.data;
    },

    // Cambia el estado de la finca a "Publicada"
    publishFarm: async (id: number): Promise<Farm> => {
        const response = await axiosInstance.patch(`/finca/${id}/publicar`, {
            estado: 'Publicada'
        });
        return response.data;
    },

    // Cambia el estado de la finca a "Borrador"
    unpublishFarm: async (id: number): Promise<Farm> => {
        const response = await axiosInstance.patch(`/finca/${id}/despublicar`, {
            estado: 'Borrador'
        });
        return response.data;
    },

    deleteFarm: async (id: number): Promise<void> => {
        await axiosInstance.delete(`/finca/${id}`);
    }
}; 