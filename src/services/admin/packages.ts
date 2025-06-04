/* eslint-disable @typescript-eslint/no-explicit-any */
import { axiosInstance } from '@/api/axiosInstance';
import { Package, PackageStatus } from '@/features/admin/packages/PackageTypes';

interface PackageResponse {
    id: number;
    name: string;
    description: string;
    price: number;
    category: string;
    duration: string;
    capacity: string;
    status: PackageStatus;
}

const mapToPackage = (pkg: PackageResponse): Package => ({
    id: pkg.id,
    name: pkg.name,
    description: pkg.description,
    price: pkg.price,
    category: pkg.category,
    duration: pkg.duration,
    capacity: pkg.capacity,
    status: pkg.status
});

export const packagesApi = {
    getAllPackages: async (): Promise<Package[]> => {
        try {
            const response = await axiosInstance.get<PackageResponse[]>('dashboard/paquetes');
            if (!response.data || !Array.isArray(response.data)) {
                console.log('No packages data found in response');
                return [];
            }

            return response.data.map(mapToPackage);
        } catch (error: any) {
            console.error('Error fetching packages:', error);
            throw new Error('Error al obtener los paquetes');
        }
    },

    getPackageById: async (id: number): Promise<Package> => {
        try {
            const response = await axiosInstance.get<PackageResponse>(`/dashboard/paquetes/${id}`);
            return mapToPackage(response.data);
        } catch (error) {
            console.error('Error fetching package:', error);
            throw new Error('Error al obtener el paquete');
        }
    },

    createPackage: async (data: Omit<Package, 'id' | 'status'>): Promise<Package> => {
        try {
            const response = await axiosInstance.post<PackageResponse>('/dashboard/paquetes/crear', data);
            return mapToPackage(response.data);
        } catch (error: any) {
            throw new Error(error.response?.data?.message || 'Error al crear el paquete');
        }
    },

    updatePackage: async (id: number, data: Partial<Package>): Promise<Package> => {
        try {
            const response = await axiosInstance.put<PackageResponse>(`/dashboard/paquetes/${id}`, data);
            return mapToPackage(response.data);
        } catch (error) {
            console.error('Error updating package:', error);
            throw new Error('Error al actualizar el paquete');
        }
    },

    deletePackage: async (id: number): Promise<void> => {
        try {
            await axiosInstance.delete(`/dashboard/paquetes/${id}`);
        } catch (error) {
            console.error('Error deleting package:', error);
            throw new Error('Error al eliminar el paquete');
        }
    }
}; 