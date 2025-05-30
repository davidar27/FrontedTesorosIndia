import { useQuery as useReactQuery, UseQueryOptions, UseQueryResult } from '@tanstack/react-query';

export function useQuery<T>(options: UseQueryOptions<T, Error>): UseQueryResult<T, Error> {
    return useReactQuery<T, Error>(options);
} 