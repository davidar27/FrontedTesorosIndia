/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useCallback, FormEvent } from 'react';
import { Clock } from 'lucide-react';
import { UpdatePackageData } from '@/features/admin/packages/PackageTypes';
import { ExperiencesApi } from '@/services/home/experiences';
import { Experience } from '../experiences/ExperienceTypes';
import { usePackagesManagement } from '@/services/admin/usePackagesManagement';
import { usePackageForm } from './hooks/usePackageForm';
import { ImageUpload } from '@/features/admin/packages/components/ImageUpload';
import { ExperienceSelector } from '@/features/admin/packages/components/ExperienceSelector';
import { PriceField } from '@/features/admin/packages/components/PriceField';
import { DetailsSelector } from '@/features/admin/packages/components/DetailsSelector';
import Input from '@/components/ui/inputs/Input';
import { PackagesApi } from "@/services/packages/packages";
import { DateCalendar } from '@/features/admin/packages/components/DateCalendar';


interface PackageFormProps {
    initialData?: Partial<UpdatePackageData> & { image: string | File };
    onSave?: (data: UpdatePackageData, file: File | null) => void;
    onCancel?: () => void;
    isLoading?: boolean;
}

interface DashboardDetails {
    detail_id: number;
    description: string;
}

function parseInitialData(data: any) {
    let unavailableDates: string[] = [];
    const toYYYYMMDD = (date: string) => {
        if (date.includes('/')) {
            const [day, month, year] = date.split('/');
            return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
        } else if (date.includes('-')) {
            return date;
        }
        return date;
    };

    if (Array.isArray(data.unavailableDates)) {
        unavailableDates = data.unavailableDates.map(toYYYYMMDD);
    } else if (typeof data.unavailableDates === 'string' && data.unavailableDates.trim().length > 0) {
        try {
            unavailableDates = JSON.parse(data.unavailableDates).map(toYYYYMMDD);
        } catch {
            unavailableDates = [];
        }
    }


    return {
        ...data,
        price: data.price ? Number(data.price) : (data.pricePerPerson ? Number(data.pricePerPerson) : 0),
        duration: data.duration ? Number(data.duration) : 0,
        capacity: data.capacity ? Number(data.capacity) : 0,
        unavailableDates,
        selectedDetails: Array.isArray(data.details)
            ? data.details.map((d: any) => d.detail_id)
            : [],
        selectedExperiences: Array.isArray(data.experiences)
            ? data.experiences.map((e: any) => e.experience_id)
            : [],
    };
}

const EditPackageForm: React.FC<PackageFormProps> = ({
    initialData,
    onSave,
    onCancel,
    isLoading = false
}) => {
    const [parsedInitialData] = useState(() =>
        initialData ? parseInitialData(initialData) : undefined
    );

    const { formData, errors, handleInputChange, toggleArrayItem, validateForm, resetForm, setFormData } = usePackageForm(parsedInitialData as Partial<UpdatePackageData>);
    const [experiences, setExperiences] = useState<Experience[]>([]);
    const [loadingExperiences, setLoadingExperiences] = useState(true);
    const [details, setDetails] = useState<DashboardDetails[] | null>(null);
    const [loadingDetails, setLoadingDetails] = useState(true);
    const [dataLoaded, setDataLoaded] = useState(false);
    const { getDashboardDetails } = usePackagesManagement();
    const [imageFile, setImageFile] = useState<File | string | null>(initialData?.image ?? null);

    React.useEffect(() => {
        const fetchData = async () => {
            if (dataLoaded) return;
            setLoadingExperiences(true);
            setLoadingDetails(true);
            try {
                const [experiencesData, detailsData] = await Promise.all([
                    ExperiencesApi.getExperiences(),
                    getDashboardDetails()
                ]);
                setExperiences(experiencesData);
                setDetails(detailsData as DashboardDetails[]);
                if (initialData?.id && !dataLoaded) {
                    const packageData = await PackagesApi.getPackageById(initialData.id);
                    if (packageData) {
                        const parsed = parseInitialData(packageData);
                        setFormData(prevData => {
                            const newData = { ...prevData, ...parsed };
                            return newData;
                        });
                    }
                }
                setDataLoaded(true);
            } catch (error) {
                console.error('Error al cargar los datos del dashboard:', error);
            } finally {
                setLoadingExperiences(false);
                setLoadingDetails(false);
            }
        };
        fetchData();
    }, [getDashboardDetails, initialData?.id, setFormData, dataLoaded]);
    
    const handleExperienceToggle = useCallback((id: number) => {
        toggleArrayItem('selectedExperiences', id);
    }, [toggleArrayItem]);

    const handleDetailToggle = useCallback((id: number) => {
        toggleArrayItem('selectedDetails', id);
    }, [toggleArrayItem]);

    const handleDateToggle = useCallback((dateString: string) => {

        const toYYYYMMDD = (date: string) => {
            if (date.includes('/')) {
                const [day, month, year] = date.split('/');
                return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
            } else if (date.includes('-')) {
                return date;
            }
            return date;
        };

        setFormData(prev => {
            const currentDates = (prev.unavailableDates || []).map(toYYYYMMDD);
            const normalizedDate = toYYYYMMDD(dateString);


            let newDates;
            if (currentDates.includes(normalizedDate)) {
                newDates = currentDates.filter(date => date !== normalizedDate);
            } else {
                newDates = [...currentDates, normalizedDate];
            }

            return {
                ...prev,
                unavailableDates: newDates
            };
        });
    }, [setFormData]);

    const handleSubmit = (e: FormEvent<HTMLButtonElement>): void => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        // Filtrar unavailableDates para eliminar fechas pasadas
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const filteredUnavailableDates = (formData.unavailableDates || []).filter(dateStr => {
            // dateStr formato YYYY-MM-DD
            const [year, month, day] = dateStr.split('-');
            const dateObj = new Date(Number(year), Number(month) - 1, Number(day));
            dateObj.setHours(0, 0, 0, 0);
            return dateObj >= today;
        });

        const dataToSend = {
            ...formData,
            unavailableDates: filteredUnavailableDates,
            id: initialData?.id,
            details: formData.selectedDetails?.map((id: number) => ({ detail_id: id })) ?? [],
            experiences: formData.selectedExperiences?.map((id: number) => ({ experience_id: id })) ?? [],
        };

        if (imageFile instanceof File) {
            const formDataObj = new FormData();
            Object.entries(dataToSend).forEach(([key, value]) => {
                if (Array.isArray(value)) {
                    formDataObj.append(key, JSON.stringify(value));
                } else if (value !== undefined && value !== null) {
                    formDataObj.append(key, value as any);
                }
            });
            formDataObj.append('file', imageFile);
            onSave?.(formDataObj as any, imageFile);
        } else {
            onSave?.(dataToSend as unknown as UpdatePackageData, null);
        }
    };

    const handleCancel = (): void => {
        if (onCancel) {
            onCancel();
        } else {
            resetForm();
            setImageFile(null);
        }
    };

    return (
        <div className="w-full max-w-3xl mx-auto bg-white rounded-2xl shadow-2xl p-8 border border-primary/20">
            <header className="mb-8 text-center">
                <h1 className="text-4xl font-extrabold text-primary mb-2">Editar Paquete</h1>
                <p className="text-gray-500">Completa la información para editar el paquete turístico</p>
            </header>

            <ImageUpload
                onFileSelect={setImageFile}
                currentFile={imageFile}
            />

            {/* Información básica */}
            <section className="grid grid-cols-1 gap-6 mb-8">
                <div className="w-full">
                    <label className="block text-sm font-medium text-green-600 mb-1">Nombre *</label>
                    <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 ${errors.name ? 'border-red-500' : 'border-gray-300'
                            }`}
                        placeholder="Nombre del paquete turístico"
                        aria-label="Nombre del paquete"
                    />
                    {errors.name && <p className="text-xs text-red-600 mt-1">{errors.name}</p>}
                </div>

                <div className="space-y-3">
                    <label className="block text-sm font-medium text-green-600">Descripción *</label>
                    <textarea
                        value={formData.description}
                        onChange={(e) => handleInputChange('description', e.target.value)}
                        rows={4}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none ${errors.description ? 'border-red-500' : 'border-gray-300'
                            }`}
                        placeholder="Describe las experiencias y actividades incluidas en el paquete"
                    />
                    {errors.description && <p className="text-sm text-red-600">{errors.description}</p>}
                </div>
            </section>

            {/* Experiencias y fechas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full my-8">
                <ExperienceSelector
                    experiences={experiences}
                    selectedExperiences={formData.selectedExperiences}
                    onToggle={handleExperienceToggle}
                    loading={loadingExperiences}
                    error={errors.selectedExperiences}
                />

                <DateCalendar
                    unavailableDates={formData.unavailableDates || []}
                    onDateToggle={handleDateToggle}
                />
            </div>

            {/* Duración y precio */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="space-y-3">
                    <label className="block text-sm font-medium text-green-600">
                        <Clock className="inline mr-2 h-4 w-4" />
                        Duración Por Horas *
                    </label>
                    <Input
                        id="duration"
                        type="number"
                        value={formData.duration}
                        onChange={(e) => handleInputChange('duration', Number(e.target.value))}
                        placeholder="0"
                        inputMode="numeric"
                        min={0}
                        max={10000000}
                        className='!p-2'
                    />
                    {errors.duration && <p className="text-sm text-red-600">{errors.duration}</p>}
                </div>

                <PriceField
                    value={formData.price}
                    onChange={(value) => handleInputChange('price', value)}
                    error={errors.price}
                />
                <div className="space-y-3">
                    <label className="block text-sm font-medium text-green-600">
                        <Clock className="inline mr-2 h-4 w-4" />
                        Cantidad de Personas *
                    </label>
                    <Input
                        id="capacity"
                        type="number"
                        value={formData.capacity}
                        onChange={(e) => handleInputChange('capacity', Number(e.target.value))}
                        placeholder="0"
                        inputMode="numeric"
                        min={1}
                        max={10000000}
                        className='!p-2'
                    />
                    {errors.capacity && <p className="text-sm text-red-600">{errors.capacity}</p>}
                </div>
            </div>

            <DetailsSelector
                details={details}
                selectedDetails={formData.selectedDetails}
                onToggle={handleDetailToggle}
                loading={loadingDetails}
                error={errors.selectedDetails}
            />

            {/* Botones */}
            <div className="flex justify-end gap-4 mt-8">
                <button
                    type="button"
                    onClick={handleCancel}
                    disabled={isLoading}
                    className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                    Cancelar
                </button>
                <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={isLoading}
                    className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center"
                >
                    {isLoading && <span className="loader mr-2"></span>}
                    Guardar
                </button>
            </div>
        </div>
    );
};

export default EditPackageForm;