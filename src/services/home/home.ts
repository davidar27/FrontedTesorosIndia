import { publicAxiosInstance } from "@/api/axiosInstance";
import { Farm, FarmStatus } from "@/features/admin/farms/FarmTypes";

interface RawFarmResponse {
    id: number;
    name: string;
    description?: string;
    location: string;
    type?: string;
    status: FarmStatus;
    entrepreneur_id: string | number;
    created_at: string;
}

const transformFarmResponse = (farm: RawFarmResponse): Farm => ({
    id: farm.id,
    name: farm.name,
    description: farm.description || '',
    location: farm.location,
    type: farm.type || ' ',
    status: farm.status,
    entrepreneur_id: farm.entrepreneur_id,
    created_at: farm.created_at
});

export const homeApi = {
    getFarms: async (): Promise<Farm[]> => {
        const response = await publicAxiosInstance.get<{farms: RawFarmResponse[]}>('/finca/nombres?estado=Publicada');
        return response.data.farms.map(transformFarmResponse);
    }
};