import { axiosInstance, publicAxiosInstance } from '@/api/axiosInstance';
import { Farm, FarmApiResponse, RawFarmResponse } from '@/features/admin/farms/FarmTypes';

const transformFarmResponse = (farm: RawFarmResponse): Farm => ({
    ...farm,
    name: farm.name_farm,
    description: farm.description || '',
    location: farm.location,
    type: farm.type || ' ',
    status: farm.status,
    entrepreneur_id: farm.entrepreneur_id,
});

export const farmsApi = {
    public: {
        getFarmById: async (id: number): Promise<Farm> => {
            const response = await publicAxiosInstance.get(`/fincas/${id}`);
            return response.data;
        },
        
        getFarms: async (): Promise<Farm[]> => {
            const response = await publicAxiosInstance.get<{farms: RawFarmResponse[]}>('/fincas/nombre?estado=Publicada');
            return response.data.farms.map(transformFarmResponse);
        }
    },

    // Endpoints protegidos que requieren autenticación
    getFarmById: async (id: number): Promise<Farm> => {
        const response = await axiosInstance.get(`/fincas/${id}`);
        return response.data;
    },

    getAllFarms: async (): Promise<Farm[]> => {
        const response = await axiosInstance.get<FarmApiResponse>('/fincas');
        return response.data.farms;
    },

    // Obtiene la finca del emprendedor actual
    getMyFarm: async (): Promise<Farm> => {
        const response = await axiosInstance.get('/fincas/mi-finca');
        return response.data;
    },

    createFarm: async (farm: Partial<Farm>): Promise<Farm> => {
        const response = await axiosInstance.post('/fincas', farm);
        return response.data;
    },

    updateFarm: async (id: number, farm: Partial<Farm>): Promise<Farm> => {
        const response = await axiosInstance.put(`/fincas/${id}`, farm);
        return response.data;
    },

    // Cambia el estado de la finca a "Publicada"
    publishFarm: async (id: number): Promise<Farm> => {
        const response = await axiosInstance.patch(`/fincas/${id}/publicar`, {
            estado: 'Publicada'
        });
        return response.data;
    },

    // Cambia el estado de la finca a "Borrador"
    unpublishFarm: async (id: number): Promise<Farm> => {
        const response = await axiosInstance.patch(`/fincas/${id}/despublicar`, {
            estado: 'Borrador'
        });
        return response.data;
    },

    deleteFarm: async (id: number): Promise<void> => {
        await axiosInstance.delete(`/finca/${id}`);
    }
}; 