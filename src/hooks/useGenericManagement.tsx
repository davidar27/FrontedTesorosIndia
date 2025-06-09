/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery, useMutation } from '@tanstack/react-query';
import { axiosInstance } from '@/api/axiosInstance';
import { BaseEntity } from '@/features/admin/types';
interface GenericManagementOptions<T> {
    customEndpoints?: {
        getAll?: string;
        getById?: (id: string | number) => string;
        create?: string;
        update?: (id: string | number) => string;
        delete?: (id: string | number) => string;
        changeStatus?: (id: string | number) => string;
        search?: string;
    };
    customMethods?: {
        create?: (data: any) => Promise<T>;
        update?: (id: string | number, data: any) => Promise<T>;
        changeStatus?: (id: string | number, status: any) => Promise<T>;
        search?: (query: string) => Promise<T[]>;
    };
}

export function useGenericManagement<T extends BaseEntity<string>>(
    entityKey: string,
    apiEndpoint: string,
    options?: GenericManagementOptions<T>
) {
    const endpoints = options?.customEndpoints || {};
    const methods = options?.customMethods || {};

    // GET ALL
    const { data, isLoading, error } = useQuery({
        queryKey: [entityKey],
        queryFn: async () => {
            const url = endpoints.getAll || apiEndpoint;
            const response = await axiosInstance.get<T[]>(url);
            return Array.isArray(response.data) ? response.data : [];
        }
    });
    const items = data ?? [];

    // CREATE
    const createMutation = useMutation({
        mutationFn: (newItem: Omit<T, 'id'>) => {
            if (methods.create) return methods.create(newItem);
            const url = endpoints.create || apiEndpoint;
            return axiosInstance.post<T>(url, newItem).then(res => res.data);
        }
    });

    // UPDATE
    const updateMutation = useMutation({
        mutationFn: ({ id, ...data }: T) => {
            if (id === undefined) throw new Error('ID is required for update');
            if (methods.update) return methods.update(id, data);
            const url = endpoints.update ? endpoints.update(id) : `${apiEndpoint}/${id}`;
            return axiosInstance.put<T>(url, data).then(res => res.data);
        }
    });

    // DELETE
    const deleteMutation = useMutation({
        mutationFn: (id: number) => {
            const url = endpoints.delete ? endpoints.delete(id) : `${apiEndpoint}/${id}`;
            return axiosInstance.delete(url);
        }
    });

    // GET BY ID
    const getById = async (id: string | number) => {
        if (endpoints.getById) {
            const url = endpoints.getById(id);
            const response = await axiosInstance.get<T>(url);
            return response.data;
        }
        const response = await axiosInstance.get<T>(`${apiEndpoint}/${id}`);
        return response.data;
    };

    // CHANGE STATUS
    const changeStatus = async (id: string | number, status: any) => {
        if (methods.changeStatus) return methods.changeStatus(id, status);
        if (endpoints.changeStatus) {
            const url = endpoints.changeStatus(id);
            const response = await axiosInstance.patch<T>(url, { status });
            return response.data;
        }
        throw new Error('No changeStatus endpoint defined');
    };

    // SEARCH
    const search = async (query: string) => {
        if (methods.search) return methods.search(query);
        if (endpoints.search) {
            const response = await axiosInstance.get<T[]>(endpoints.search, { params: { q: query } });
            return response.data;
        }
        throw new Error('No search endpoint defined');
    };

    return {
        items,
        isLoading,
        error,
        create: createMutation.mutate,
        update: updateMutation.mutate,
        delete: deleteMutation.mutate,
        isCreating: createMutation.isPending,
        isUpdating: updateMutation.isPending,
        isDeleting: deleteMutation.isPending,
        getById,
        changeStatus,
        search
    };
}
