/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery, useMutation, useQueryClient, QueryKey } from '@tanstack/react-query';
import { axiosInstance } from '@/api/axiosInstance';
import { AxiosError } from 'axios';

interface BaseEntity<TId extends string | number = string> {
    id?: TId;
    [key: string]: any;
}

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

interface EndpointConfig {
    getAll?: string;
    getById?: string | ((id: string | number) => string);
    create?: string;
    update?: string | ((id: string | number) => string);
    delete?: string | ((id: string | number) => string);
    changeStatus?: string | ((id: string | number) => string);
    search?: string;
    [customEndpoint: string]: any;
}

interface MethodConfig<T> {
    getAll?: () => Promise<T[]>;
    getById?: (id: string | number) => Promise<T>;
    create?: (data: Omit<T, 'id'>) => Promise<T>;
    update?: (id: string | number, data: Partial<T>) => Promise<T>;
    delete?: (id: string | number) => Promise<void>;
    changeStatus?: (id: string | number, status: string, entityType: string) => Promise<T>;
    search?: (query: string) => Promise<T[]>;
    [customMethod: string]: any;
}

interface QueryOptions {
    staleTime?: number;
    cacheTime?: number;
    refetchOnWindowFocus: false;
    refetchOnMount: false;
    refetchOnReconnect: false;
    enabled?: boolean;
}

interface MutationOptions {
    onSuccess?: (data: any, variables: any, context: any) => void;
    onError?: (error: AxiosError, variables: any, context: any) => void;
}

interface GenericApiOptions<T> {
    entityKey: string | QueryKey;
    endpoints?: EndpointConfig;
    methods?: MethodConfig<T>;
    defaultQueryOptions?: QueryOptions;
    defaultMutationOptions?: MutationOptions;
}

export function useGenericApi<T extends BaseEntity<TId>, TId extends string | number = string>(
    options: GenericApiOptions<T>
) {
    const {
        entityKey,
        endpoints = {},
        methods = {},
        defaultQueryOptions = {},
        defaultMutationOptions = {},
    } = options;

    const queryClient = useQueryClient();

    // Helper para construir URLs
    const buildUrl = (endpoint: string | ((id: string | number) => string), id?: string | number) => {
        if (!id) throw new Error('ID is required');
        return typeof endpoint === 'function' ? endpoint(id) : `${endpoint}/${id}`;
    };

    // GET ALL
    const {
        data: items = [],
        isLoading,
        isError,
        error,
        refetch,
    } = useQuery<T[], AxiosError>({
        queryKey: Array.isArray(entityKey) ? entityKey : [entityKey],
        queryFn: async () => {
            if (methods.getAll) return methods.getAll();

            const endpoint = endpoints.getAll;
            if (!endpoint) throw new Error('No getAll endpoint or method provided');

            const response = await axiosInstance.get<T[]>(endpoint);
            return response.data;
        },
        ...defaultQueryOptions,
    });

    // GET BY ID
    const getById = async (id: string | number): Promise<T> => {
        if (methods.getById) return methods.getById(id);

        const endpoint = endpoints.getById;
        if (!endpoint) throw new Error('No getById endpoint or method provided');

        const response = await axiosInstance.get<T>(buildUrl(endpoint, id));
        return response.data;
    };

    // CREATE
    const createMutation = useMutation<T, AxiosError, Omit<T, 'id'>>({
        mutationFn: async (data) => {
            if (methods.create) return methods.create(data);

            const endpoint = endpoints.create;
            if (!endpoint) throw new Error('No create endpoint or method provided');

            const response = await axiosInstance.post<T>(endpoint, data);
            return response.data;
        },
        onSuccess: (data) => {
            queryClient.setQueryData(Array.isArray(entityKey) ? entityKey : [entityKey], (old: T[] = []) => [...old, data]);
            defaultMutationOptions.onSuccess?.(data, null, null);
        },
        onError: defaultMutationOptions.onError,
    });

    // UPDATE
    const updateMutation = useMutation<T, AxiosError, any>({
        mutationFn: async (dataOrFormData) => {
            console.log('DEBUG - updateMutation called with:', dataOrFormData, 'is FormData:', dataOrFormData instanceof FormData);

            if (dataOrFormData instanceof FormData) {
                for (const pair of dataOrFormData.entries()) {
                    console.log('DEBUG - FormData in updateMutation:', pair[0], pair[1]);
                }
                const id = dataOrFormData.get('id');
                if (!id) throw new Error('ID is required for update');
                const endpoint = endpoints.update;
                if (!endpoint) throw new Error('No update endpoint or method provided');
                const response = await axiosInstance.put<T>(buildUrl(endpoint, id as string | number), dataOrFormData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                return response.data;
            } else {
                console.log('DEBUG - Object in updateMutation:', dataOrFormData);
                const { id, ...data } = dataOrFormData;
                if (!id) throw new Error('ID is required for update');
                if (methods.update) return methods.update(id, data as Partial<T>);

                const endpoint = endpoints.update;
                if (!endpoint) throw new Error('No update endpoint or method provided');

                const hasFormData = Object.values(data).some(value => value instanceof FormData);
                const config = {
                    headers: {
                        'Content-Type': hasFormData ? 'multipart/form-data' : 'application/json'
                    }
                };

                const response = await axiosInstance.put<T>(buildUrl(endpoint, id), data, config);
                return response.data;
            }
        },
        onSuccess: (data, variables) => {
            queryClient.setQueryData(Array.isArray(entityKey) ? entityKey : [entityKey], (old: T[] = []) =>
                old.map(item => {
                    const id = variables instanceof FormData ? variables.get('id') : variables.id;
                    if (String(item.id) === String(id)) {
                        if (data.updatedFields) {
                            return { ...item, ...data.updatedFields };
                        }
                        return data;
                    }
                    return item;
                })
            );
            defaultMutationOptions.onSuccess?.(data, variables, null);
        },
        onError: defaultMutationOptions.onError,
    });

    // DELETE
    const deleteMutation = useMutation<void, AxiosError, string | number>({
        mutationFn: async (id) => {
            if (methods.delete) return methods.delete(id);

            const endpoint = endpoints.delete;
            if (!endpoint) throw new Error('No delete endpoint or method provided');

            await axiosInstance.delete(buildUrl(endpoint, id));
        },
        onSuccess: (_, id) => {
            queryClient.setQueryData(Array.isArray(entityKey) ? entityKey : [entityKey], (old: T[] = []) =>
                old.filter(item => item.id !== id)
            );
            defaultMutationOptions.onSuccess?.(null, id, null);
        },
        onError: defaultMutationOptions.onError,
    });

    // CHANGE STATUS
    const changeStatusMutation = useMutation<T, AxiosError, { id: string | number; status: string; entityType: string }>({
        mutationFn: async ({ id, status, entityType }) => {
            if (methods.changeStatus) return methods.changeStatus(id, status, entityType);

            const endpoint = endpoints.changeStatus;
            if (!endpoint) throw new Error('No changeStatus endpoint or method provided');

            const url = buildUrl(endpoint, id);
            const response = await axiosInstance.patch<T>(url, { status, entityType });
            return response.data;
        },
        onSuccess: (data, variables) => {
            queryClient.setQueryData(Array.isArray(entityKey) ? entityKey : [entityKey], (old: T[] = []) =>
                old.map(item => {
                    if (item.id === variables.id) {
                        return {
                            ...item,
                            status: variables.status
                        };
                    }
                    return item;
                })
            );
            defaultMutationOptions.onSuccess?.(data, variables, null);
        },
        onError: defaultMutationOptions.onError,
    });

    // SEARCH
    const search = async (query: string): Promise<T[]> => {
        if (methods.search) return methods.search(query);

        const endpoint = endpoints.search;
        if (!endpoint) throw new Error('No search endpoint or method provided');

        const response = await axiosInstance.get<T[]>(endpoint, { params: { q: query } });
        return response.data;
    };

    // Custom request helper
    const customRequest = async <R = any>(
        endpointKey: string,
        method: HttpMethod,
        data?: any,
        id?: string | number
    ): Promise<R> => {
        const endpoint = endpoints[endpointKey];
        if (!endpoint) throw new Error(`Endpoint ${endpointKey} not configured`);

        const url = buildUrl(endpoint, id);

        switch (method) {
            case 'GET':
                return (await axiosInstance.get<R>(url)).data;
            case 'POST':
                return (await axiosInstance.post<R>(url, data)).data;
            case 'PUT':
                return (await axiosInstance.put<R>(url, data)).data;
            case 'PATCH':
                return (await axiosInstance.patch<R>(url, data)).data;
            case 'DELETE':
                return (await axiosInstance.delete<R>(url)).data;
            default:
                throw new Error(`Unsupported HTTP method: ${method}`);
        }
    };

    return {
        // Query state
        items,
        isLoading,
        isError,
        error,
        refetch,

        // Methods
        getById,
        search,

        // Mutations
        create: createMutation.mutate,
        createAsync: createMutation.mutateAsync,
        update: updateMutation.mutate,
        updateAsync: updateMutation.mutateAsync,
        delete: deleteMutation.mutate,
        deleteAsync: deleteMutation.mutateAsync,
        changeStatus: changeStatusMutation.mutate,
        changeStatusAsync: changeStatusMutation.mutateAsync,

        // Mutation states
        isCreating: createMutation.isPending,
        isUpdating: updateMutation.isPending,
        isDeleting: deleteMutation.isPending,
        isChangingStatus: changeStatusMutation.isPending,

        // Custom request
        customRequest,
    };
}