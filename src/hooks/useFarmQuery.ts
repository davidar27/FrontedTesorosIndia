import { useAuthenticatedQuery } from './useAuthenticatedQuery';
import { useQuery } from './useQuery';
import { useAuth } from './useAuth';
import { farmsApi } from '@/services/admin/farms';

interface AuthUser {
    id: number;
    role: string;
}

interface AuthContextType {
    user: AuthUser | null;
}

export const useFarmQuery = (farmId: string | undefined) => {
    const { user } = useAuth() as AuthContextType;
    const enabled = Boolean(farmId);

    const publicResult = useQuery({
        queryKey: ['farm', farmId],
        queryFn: () => farmsApi.public.getFarmById(Number(farmId)),
        enabled: enabled && !user
    });

    const authenticatedResult = useAuthenticatedQuery({
        queryKey: ['farm', farmId],
        queryFn: () => farmsApi.getFarmById(Number(farmId)),
        enabled: enabled && !!user
    });

    return user ? authenticatedResult : publicResult;
}; 