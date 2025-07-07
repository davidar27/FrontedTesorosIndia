import { useEffect, useState } from 'react';
import { Experience, Product, TeamMember } from '@/features/experience/types/experienceTypes';
import { axiosInstance } from '@/api/axiosInstance';

export const useEditMode = (
    initialExperience: Experience | null,
    initialProducts: Product[],
    initialMembers: TeamMember[]
) => {
    const [editData, setEditData] = useState<Partial<Experience>>(initialExperience || {});
    const [editProducts, setEditProducts] = useState<Product[]>(initialProducts);
    const [editMembers, setEditMembers] = useState<TeamMember[]>(initialMembers);
    const [status] = useState<string[]>(['publicada', 'borrador']);

    useEffect(() => {
        if (initialExperience) setEditData(initialExperience);
    }, [initialExperience]);

    useEffect(() => {
        setEditProducts(initialProducts);
    }, [initialProducts]);

    useEffect(() => {
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

    const handleChangeStatus = async () => {
        const newStatus = editData.status === 'publicada' ? 'borrador' : 'publicada';
        
        setEditData(prev => ({ ...prev, status: newStatus }));
        
        try {
            await axiosInstance.put(`/experiencias/estado/${editData.id}`, { status: newStatus });
        } catch (error) {
            setEditData(prev => ({ ...prev, status: editData.status === 'publicada' ? 'publicada' : 'borrador' }));
            console.error('Error al cambiar el estado:', error);
        }
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
        setEditMembers,
        handleChangeStatus,
        status
    };
};

