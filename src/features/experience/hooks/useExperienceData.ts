import { useState, useEffect } from 'react';
import { ExperienceApi } from '@/services/experience/experience';
import { Experience, Product, TeamMember, Review } from '@/features/experience/types/experienceTypes';

export const useExperienceData = (experienceId: number) => {
    const [experience, setExperience] = useState<Experience | null>(null);
    const [members, setMembers] = useState<TeamMember[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);

                const [infoData, reviewsData, productsData, membersData] = await Promise.all([
                    ExperienceApi.getInfo(experienceId),
                    ExperienceApi.getReviews(experienceId),
                    ExperienceApi.getProducts(experienceId),
                    ExperienceApi.getMembers(experienceId)
                ]);

                setExperience(infoData[0] || null);
                setReviews(reviewsData.reviews || []);
                setProducts(productsData);
                setMembers(membersData);
            } catch (error) {
                console.error('Error fetching experience data:', error);
                setError(true);
            } finally {
                setIsLoading(false);
            }
        };

        if (experienceId) {
            fetchData();
        }
    }, [experienceId]);

    return {
        experience,
        members,
        products,
        reviews,
        setReviews,
        isLoading,
        error,
        refetch: () => {
            // Función para recargar los datos si es necesario
            if (experienceId) {
                const fetchData = async () => {
                    // ... mismo código de arriba
                };
                fetchData();
            }
        }
    };
};