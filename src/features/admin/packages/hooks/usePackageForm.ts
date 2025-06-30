import { useState, useCallback } from 'react';
import { CreatePackageData } from '@/features/admin/packages/PackageTypes';

export const usePackageForm = (initialData?: Partial<CreatePackageData> & { id?: number }) => {
    const [formData, setFormData] = useState<CreatePackageData & { id?: number }>({
        id: initialData?.id,
        name: initialData?.name || '',
        description: initialData?.description || '',
        selectedExperiences: initialData?.selectedExperiences || [],
        unavailableDates: initialData?.unavailableDates || [],
        duration: initialData?.duration || 0,
        capacity: initialData?.capacity || 0,
        pricePerPerson: initialData?.pricePerPerson || 0,
        selectedDetails: initialData?.selectedDetails || [],
        price: initialData?.price || 0
    });

    const [errors, setErrors] = useState<Partial<Record<keyof CreatePackageData, string>>>({});

    const handleInputChange = useCallback((field: keyof CreatePackageData, value: string | string[] | number): void => {
        setFormData(prev => ({
            ...prev,
            [field]: field === 'price' || field === 'duration' || field === 'capacity'
                ? Number(value)
                : value
        }));

        if (errors[field]) {
            setErrors(prev => ({
                ...prev,
                [field]: undefined
            }));
        }
    }, [errors]);

    const toggleArrayItem = useCallback(<K extends keyof Pick<CreatePackageData, 'selectedExperiences' | 'unavailableDates' | 'selectedDetails'>>(
        key: K,
        item: CreatePackageData[K][number]
    ) => {
        setFormData(prev => {
            const list = prev[key] as (string | number)[];
            const updatedList = list.includes(item)
                ? list.filter(i => i !== item)
                : [...list, item];
            return { ...prev, [key]: updatedList };
        });
    }, []);

    const validateForm = useCallback((): boolean => {
        const newErrors: Partial<Record<keyof CreatePackageData, string>> = {};

        if (!formData.name.trim()) {
            newErrors.name = 'El nombre es requerido';
        }

        if (!formData.description.trim()) {
            newErrors.description = 'La descripción es requerida';
        }

        if (formData.selectedExperiences.length === 0) {
            newErrors.selectedExperiences = 'Selecciona al menos una experiencia';
        }

        if (!formData.duration) {
            newErrors.duration = 'La duración es requerida';
        }

        if (!formData.capacity) {
            newErrors.capacity = 'La capacidad es requerida';
        }

        if (!formData.pricePerPerson) {
            newErrors.pricePerPerson = 'El precio es requerido';
        } else if (formData.pricePerPerson <= 0) {
            newErrors.pricePerPerson = 'Ingresa un precio válido';
        }

        if (formData.selectedDetails.length === 0) {
            newErrors.selectedDetails = 'Los servicios son requeridos';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }, [formData]);

    const resetForm = useCallback(() => {
        setFormData({
            id: 0,
            name: '',
            description: '',
            selectedExperiences: [],
            unavailableDates: [],
            duration: 0,
            capacity: 0,
            pricePerPerson: 0,
            selectedDetails: [],
            price: 0
        });
        setErrors({});
    }, []);



    return {
        formData,
        errors,
        handleInputChange,
        toggleArrayItem,
        validateForm,
        resetForm,
        setFormData,
    };
};
