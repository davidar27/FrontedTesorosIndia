import { useAuthenticatedQuery } from '@/hooks/useAuthenticatedQuery';
import { useQuery } from '@/hooks/useQuery';
import useAuth from '@/context/useAuth';
import { ExperiencesApi } from '@/services/home/experiences';

interface AuthUser {
    id: string;
    role: string;
}

interface AuthContextType {
    user: AuthUser | null;
}

export const useExperienceQuery = (experienceid: string | undefined) => {
    const { user } = useAuth() as AuthContextType;
    const enabled = Boolean(experienceId);

    const publicResult = useQuery({
        queryKey: ['Experience', experienceId],
        queryFn: () => ExperiencesApi.getExperienceById(Number(experienceId)),
        enabled: enabled && !user
    });

    const authenticatedResult = useAuthenticatedQuery({
        queryKey: ['Experience', experienceId],
        queryFn: () => ExperiencesApi.getExperienceById(Number(experienceId)),
        enabled: enabled && !!user
    });

    return user ? authenticatedResult : publicResult;
}; 