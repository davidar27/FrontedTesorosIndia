import { useState, useEffect } from 'react';
import { Experience } from '@/features/home/map/types/TouristRouteTypes';
import { transformExperienceData } from '../utils/transformExperienceData';
import { ExperiencesApi } from '@/services/home/experiences';

interface UseTouristRouteDataReturn {
    locations: Experience[];
    loading: boolean;
    error: string | null;
}

export const useTouristRouteData = (): UseTouristRouteDataReturn => {
    const [locations, setLocations] = useState<Experience[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchExperiences = async () => {
            try {
                setLoading(true);
                setError(null);

                const dataExperiences = await ExperiencesApi.getExperiencesHome() || [];
                const transformedExperiences = dataExperiences.map(transformExperienceData);

                setLocations(transformedExperiences);
            } catch (err) {
                setError('Error al cargar las experiencias');
                console.error('Error fetching experiences:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchExperiences();
    }, []);

    return { locations, loading, error };
};
