import { useState, useCallback } from 'react';
import { CreatePackageData } from '@/features/admin/packages/PackageTypes';

export const usePackageForm = (initialData?: Partial<CreatePackageData>) => {
    const [formData, setFormData] = useState<CreatePackageData>({
        title: initialData?.title || '',
        description: initialData?.description || '',
        selectedExperiences: initialData?.selectedExperiences || [],
        unavailableDates: initialData?.unavailableDates || [],
        duration: initialData?.duration || 0,
        capacity: initialData?.capacity || 0,
        pricePerPerson: initialData?.pricePerPerson || '',
        selectedDetails: initialData?.selectedDetails || []
    });

    const [errors, setErrors] = useState<Partial<Record<keyof CreatePackageData, string>>>({});

    const handleInputChange = useCallback((field: keyof CreatePackageData, value: string | string[] | number[]): void => {
        setFormData(prev => ({
            ...prev,
            [field]: value
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

        if (!formData.title.trim()) {
            newErrors.title = 'El título es requerido';
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

        if (!formData.pricePerPerson) {
            newErrors.pricePerPerson = 'El precio es requerido';
        } else if (isNaN(Number(formData.pricePerPerson)) || Number(formData.pricePerPerson) <= 0) {
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
            title: '',
            description: '',
            selectedExperiences: [],
            unavailableDates: [],
            duration: 0,
            capacity: 0,
            pricePerPerson: '',
            selectedDetails: []
        });
        setErrors({});
    }, []);

    return {
        formData,
        errors,
        handleInputChange,
        toggleArrayItem,
        validateForm,
        resetForm
    };
};
