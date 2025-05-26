import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { BaseEntity } from '@/components/admin/GenericManagent';

export function useGenericManagement<T extends BaseEntity>(
    entityKey: string,
    apiEndpoint: string
) {
    const queryClient = useQueryClient();

    const { data: items = [], isLoading, error } = useQuery({
        queryKey: [entityKey],
        queryFn: async () => {
            const response = await axios.get<T[]>(apiEndpoint);
            return response.data;
        }
    });

    // Create mutation
    const createMutation = useMutation({
        mutationFn: (newItem: Omit<T, 'id'>) =>
            axios.post<T>(apiEndpoint, newItem).then(res => res.data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [entityKey] });
        }
    });

    // Update mutation
    const updateMutation = useMutation({
        mutationFn: ({ id, ...data }: T) =>
            axios.put<T>(`${apiEndpoint}/${id}`, data).then(res => res.data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [entityKey] });
        }
    });

    // Delete mutation
    const deleteMutation = useMutation({
        mutationFn: (id: number) =>
            axios.delete(`${apiEndpoint}/${id}`),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [entityKey] });
        }
    });

    return {
        items,
        isLoading,
        error,
        create: createMutation.mutate,
        update: updateMutation.mutate,
        delete: deleteMutation.mutate,
        isCreating: createMutation.isPending,
        isUpdating: updateMutation.isPending,
        isDeleting: deleteMutation.isPending
    };
}
