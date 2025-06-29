import { useState } from 'react';
import { Experience, Product, TeamMember } from '@/features/experience/types/experienceTypes';
import React from 'react';

export const useEditMode = (
    initialExperience: Experience | null,
    initialProducts: Product[],
    initialMembers: TeamMember[]
) => {
    const [editData, setEditData] = useState<Partial<Experience>>(initialExperience || {});
    const [editProducts, setEditProducts] = useState<Product[]>(initialProducts);
    const [editMembers, setEditMembers] = useState<TeamMember[]>(initialMembers);

    // Actualizar estados cuando cambien los datos iniciales
    React.useEffect(() => {
        if (initialExperience) setEditData(initialExperience);
    }, [initialExperience]);

    React.useEffect(() => {
        setEditProducts(initialProducts);
    }, [initialProducts]);

    React.useEffect(() => {
        setEditMembers(initialMembers);
    }, [initialMembers]);

    const updateExperienceData = (field: keyof Experience, value: string | number | boolean) => {
        setEditData(prev => ({ ...prev, [field]: value }));
    };

    const addProduct = (product: Product) => {
        setEditProducts(prev => [...prev, product]);
    };

    const removeProduct = (productId: number) => {
        setEditProducts(prev => prev.filter(p => p.id !== productId));
    };

    const addMember = (member: TeamMember) => {
        setEditMembers(prev => [...prev, member]);
    };

    const removeMember = (memberId: number) => {
        setEditMembers(prev => prev.filter(m => m.id !== memberId));
    };

    return {
        editData,
        editProducts,
        editMembers,
        updateExperienceData,
        addProduct,
        removeProduct,
        addMember,
        removeMember,
        setEditData,
        setEditProducts,
        setEditMembers
    };
};

