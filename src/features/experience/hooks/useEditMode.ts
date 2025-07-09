import { useEffect, useState } from 'react';
import { Experience, TeamMember } from '@/features/experience/types/experienceTypes';
import { Product } from '@/features/products/components/ProductCard';
import { axiosInstance } from '@/api/axiosInstance';
import { ExperienceApi } from '@/services/experience/experience';
import { toast } from 'sonner';
// import { CreateProductData } from '@/features/products/components/CreateProductForm';

export const useEditMode = (
    initialExperience: Experience | null,
    initialProducts: Product[],
    initialMembers: TeamMember[]
) => {
    const [editData, setEditData] = useState<Partial<Experience>>(initialExperience || {});
    const [editProducts, setEditProducts] = useState<Product[]>(initialProducts);
    const [editMembers, setEditMembers] = useState<TeamMember[]>(initialMembers);
    const [status] = useState<string[]>(['publicada', 'borrador']);
    const [isSaving, setIsSaving] = useState(false);

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

    const handleSaveChanges = async () => {
        if (!editData.id) {
            toast.error('No se pudo identificar la experiencia');
            return;
        }

        setIsSaving(true);
        try {
            await ExperienceApi.updateExperience(editData.id, editData);
            toast.success('Cambios guardados correctamente');
            return true;
        } catch (error) {
            console.error('Error al guardar los cambios:', error);
            toast.error('Error al guardar los cambios');
            return false;
        } finally {
            setIsSaving(false);
        }
    };

    const handleChangeStatus = async () => {
        if (!editData.id) return;
        const newStatus = editData.status === 'publicada' ? 'borrador' : 'publicada';

        setEditData(prev => ({ ...prev, status: newStatus }));

        try {
            const response = await axiosInstance.put(`/experiencias/estado/${editData.id}`, { status: newStatus });
            if (response?.data?.status) {
                setEditData(prev => ({ ...prev, status: response.data.status }));
            }
        } catch (error) {
            setEditData(prev => ({ ...prev, status: editData.status }));
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
        handleSaveChanges,
        isSaving,
        status
    };
};

