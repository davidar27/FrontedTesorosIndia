/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState, useCallback } from 'react';
import { Experience, TeamMember } from '@/features/experience/types/experienceTypes';
import { Product } from '@/features/products/components/ProductCard';
import { axiosInstance } from '@/api/axiosInstance';
import { ExperienceApi } from '@/services/experience/experience';
import { toast } from 'sonner';
import useAuth from '@/context/useAuth';
// import { CreateProductData } from '@/features/products/components/CreateProductForm';

export const useEditMode = (
    initialExperience: Experience | null,
    initialProducts: Product[],
    initialMembers: TeamMember[]
) => {
    const { user } = useAuth();
    const [editData, setEditData] = useState<Partial<Experience>>(initialExperience || {});
    const [editProducts, setEditProducts] = useState<Product[]>(initialProducts);
    const [editMembers, setEditMembers] = useState<TeamMember[]>(initialMembers);
    const [status] = useState<string[]>(['publicada', 'borrador']);
    const [isSaving, setIsSaving] = useState(false);
    const [imageFile, setImageFile] = useState<File | null>(null);

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
        console.log(`Updating ${field} to:`, value); // Debug log
        setEditData(prev => ({ ...prev, [field]: value }));
    };

    const handleImageChange = (file: File) => {
        console.log('Image file selected:', file.name); // Debug log
        setImageFile(file);
    };

    const addProduct = (product: Product) => {
        setEditProducts(prev => [...prev, product]);
    };

    const removeProduct = (productId: number) => {
        setEditProducts(prev => prev.filter(p => p.id !== productId));
    };

    const addMember = (member: TeamMember) => {
        console.log('Agregando miembro al estado local:', member); // Debug log
        setEditMembers(prev => {
            const newMembers = [...prev, member];
            console.log('Nuevo estado de miembros:', newMembers); // Debug log
            return newMembers;
        });
    };

    const removeMember = (memberId: number) => {
        console.log('Eliminando miembro del estado local con ID:', memberId); // Debug log
        setEditMembers(prev => {
            const newMembers = prev.filter(m => m.id !== memberId);
            console.log('Nuevo estado de miembros después de eliminar:', newMembers); // Debug log
            return newMembers;
        });
    };

    const updateMember = (memberId: number, updatedMember: TeamMember) => {
        console.log('Actualizando miembro del estado local con ID:', memberId, 'datos:', updatedMember); // Debug log
        setEditMembers(prev => {
            const newMembers = prev.map(m => m.id === memberId ? updatedMember : m);
            console.log('Nuevo estado de miembros después de actualizar:', newMembers); // Debug log
            return newMembers;
        });
    };

    // Debug effect to log editData changes
    useEffect(() => {
        console.log('editData changed:', editData);
    }, [editData]);

    const handleSaveChanges = useCallback(async () => {
        console.log('handleSaveChanges called with editData:', editData); // Debug log
        
        if (!editData.id) {
            toast.error('No se pudo identificar la experiencia');
            return false;
        }

        if (!user?.id) {
            toast.error('Usuario no autenticado');
            return false;
        }

        setIsSaving(true);
        try {
            // Prepare data for backend
            const dataToSend: any = {
                name: editData.name,
                description: editData.description,
                story: editData.history, // Map history to story for backend
                location: editData.location,
                lat: editData.lat,
                lng: editData.lng,
                userId: user.id, // Include userId as required by backend
            };

            // Remove undefined values
            Object.keys(dataToSend).forEach(key => {
                if (dataToSend[key] === undefined || dataToSend[key] === null) {
                    delete dataToSend[key];
                }
            });

            console.log('Sending data to backend:', dataToSend); // Debug log

            let result;
            if (imageFile) {
                // If there's an image, use FormData
                const formData = new FormData();
                
                // Add text fields
                Object.entries(dataToSend).forEach(([key, value]) => {
                    if (value !== undefined && value !== null) {
                        formData.append(key, String(value));
                    }
                });
                
                // Add image file
                formData.append('file', imageFile);
                
                console.log('Sending FormData with image'); // Debug log
                
                // Use the updateInfoExperience endpoint
                result = await ExperienceApi.updateExperienceInfo(editData.id, formData);
            } else {
                // No image, use regular JSON update
                console.log('Sending JSON data without image'); // Debug log
                result = await ExperienceApi.updateExperienceInfo(editData.id, dataToSend);
            }

            console.log('Backend response:', result); // Debug log

            toast.success('Cambios guardados correctamente');
            setImageFile(null); // Clear the image file after successful save
            return true;
        } catch (error) {
            console.error('Error al guardar los cambios:', error);
            toast.error('Error al guardar los cambios');
            return false;
        } finally {
            setIsSaving(false);
        }
    }, [editData, user?.id, imageFile]);

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
        handleImageChange,
        addProduct,
        removeProduct,
        addMember,
        removeMember,
        updateMember,
        setEditData,
        setEditProducts,
        setEditMembers,
        handleChangeStatus,
        handleSaveChanges,
        isSaving,
        status
    };
};

