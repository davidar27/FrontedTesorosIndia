import { Experience } from '@/features/admin/experiences/ExperienceTypes';
import { useGenericApi } from '@/hooks/useGenericApi';


export function useExperiencesManagement() {

    return useGenericApi<Experience, number>(
        {
            entityKey: 'experiences',
            endpoints: {
                getAll: '/dashboard/experiencias',
                getById: (id) => `/dashboard/experiencia/${id}`,
                create: '/dashboard/experiencias/crear',
                update: (id) => `/dashboard/experiencias/actualizar/${id}`,
                delete: (id) => `/dashboard/experiencias/${id}`,
                changeStatus: (id) => `/dashboard/estado/${id}`,
                search: '/usuario/experiencias/search',
            },

        }
    );
}

