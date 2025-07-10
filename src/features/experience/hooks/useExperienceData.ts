import { useState, useEffect } from 'react';
import { ExperienceApi } from '@/services/experience/experience';
import { Experience, TeamMember, Review } from '@/features/experience/types/experienceTypes';
import { Product } from '@/features/products/components/ProductCard';
import { RatingStats } from '@/features/experience/components/reviews/RatingSummary';

// Tipo para la respuesta del backend
interface BackendMember {
    memberId: number;
    name: string;
    age: number;
    profession: string;
    description: string;
    image: string;
}

export const useExperienceData = (experienceId: number) => {
    const [experience, setExperience] = useState<Experience | null>(null);
    const [members, setMembers] = useState<TeamMember[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [reviewStats, setReviewStats] = useState<RatingStats | undefined>(undefined);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(false);

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
            setReviewStats(reviewsData.stats);
            setProducts(productsData);
            
            console.log('Miembros del backend:', membersData); 
            const transformedMembers = membersData.map((member: BackendMember) => ({
                id: member.memberId,
                name: member.name,
                age: member.age,
                profession: member.profession,
                description: member.description,
                image: member.image
            }));
            console.log('Miembros transformados:', transformedMembers); // Debug log
            setMembers(transformedMembers);
        } catch (error) {
            console.error('Error fetching experience data:', error);
            setError(true);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (experienceId) {
            fetchData();
        }
    }, [experienceId]);

    // Función para actualizar la experiencia localmente después de guardar
    const updateExperienceLocally = (updatedExperience: Partial<Experience>) => {
        setExperience(prev => prev ? { ...prev, ...updatedExperience } : null);
    };

    // Función para actualizar productos localmente
    const updateProductsLocally = (updatedProducts: Product[]) => {
        setProducts(updatedProducts);
    };

    // Función para actualizar miembros localmente
    const updateMembersLocally = (updatedMembers: TeamMember[]) => {
        setMembers(updatedMembers);
    };

    return {
        experience,
        members,
        products,
        reviews,
        reviewStats,
        setReviews,
        isLoading,
        error,
        refetch: fetchData,
        updateExperienceLocally,
        updateProductsLocally,
        updateMembersLocally
    };
};