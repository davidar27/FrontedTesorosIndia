import React, { useState, useCallback, FormEvent } from 'react';
import { Clock } from 'lucide-react';
import { CreatePackageData } from '@/features/admin/packages/PackageTypes';
import { ExperiencesApi } from '@/services/home/experiences';
import { Experience } from '../experiences/ExperienceTypes';
import { usePackagesManagement } from '@/services/admin/usePackagesManagement';
import { usePackageForm } from './hooks/usePackageForm';
import { ImageUpload } from '@/features/admin/packages/components/ImageUpload';
import { ExperienceSelector } from '@/features/admin/packages/components/ExperienceSelector';
import { DateCalendar } from '@/features/admin/packages/components/DateCalendar';
import { PriceField } from '@/features/admin/packages/components/PriceField';
import { DetailsSelector } from '@/features/admin/packages/components/DetailsSelector';
import Input from '@/components/ui/inputs/Input';

interface PackageFormProps {
    initialData?: Partial<CreatePackageData>;
    onSubmit?: (data: CreatePackageData, file: File | null) => void;
    onCancel?: () => void;
    isLoading?: boolean;
}

interface DashboardDetails {
    detail_id: number;
    description: string;
}

const CreatePackageForm: React.FC<PackageFormProps> = ({
    initialData,
    onSubmit,
    onCancel,
    isLoading = false
}) => {
    const { formData, errors, handleInputChange, toggleArrayItem, validateForm, resetForm, setFormData } = usePackageForm(initialData);

    const [draggedFile, setDraggedFile] = useState<File | null>(null);
    const [experiences, setExperiences] = useState<Experience[]>([]);
    const [loadingExperiences, setLoadingExperiences] = useState(true);
    const [details, setDetails] = useState<DashboardDetails[] | null>(null);
    const [loadingDetails, setLoadingDetails] = useState(true);
    const [unavailableDates, setUnavailableDates] = useState<string[]>([]);
    const { getDashboardDetails } = usePackagesManagement();

    React.useEffect(() => {
        const fetchData = async () => {
            setLoadingExperiences(true);
            setLoadingDetails(true);
            try {
                const [experiencesData, detailsData] = await Promise.all([
                    ExperiencesApi.getExperiences(),
                    getDashboardDetails(),
                ]);
                setExperiences(experiencesData);
                setDetails(detailsData as DashboardDetails[]);
            } catch (error) {
                console.error('Error al cargar los datos del dashboard:', error);
            } finally {
                setLoadingExperiences(false);
                setLoadingDetails(false);
            }
        };

        fetchData();
    }, [getDashboardDetails]);

    const handleExperienceToggle = useCallback((id: number) => {
        toggleArrayItem('selectedExperiences', id);
    }, [toggleArrayItem]);

    const handleDetailToggle = useCallback((id: number) => {
        toggleArrayItem('selectedDetails', id);
    }, [toggleArrayItem]);

    const handleDateToggle = (dateString: string) => {
        const date = new Date(dateString);
        const formattedDate = `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
        
        setUnavailableDates(prev => {
            if (prev.includes(dateString)) {
                return prev.filter(date => date !== dateString);
            } else {
                return [...prev, dateString];
            }
        });

        // Also update the form data with formatted date
        setFormData(prev => {
            const currentDates = prev.unavailableDates || [];
            if (currentDates.includes(formattedDate)) {
                return {
                    ...prev,
                    unavailableDates: currentDates.filter(date => date !== formattedDate)
                };
            } else {
                return {
                    ...prev,
                    unavailableDates: [...currentDates, formattedDate]
                };
            }
        });
    }

    const handleSubmit = (e: FormEvent<HTMLButtonElement>): void => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        if (onSubmit) {
            onSubmit(formData, draggedFile);
        } else {
            alert('¡Paquete guardado exitosamente!');
        }
    };

    const handleCancel = (): void => {
        if (onCancel) {
            onCancel();
        } else {
            resetForm();
            setDraggedFile(null);
        }
    };

    return (
        <div className="w-full max-w-3xl mx-auto bg-white rounded-2xl shadow-2xl p-8 border border-primary/20">
            <header className="mb-8 text-center">
                <h1 className="text-4xl font-extrabold text-primary mb-2">Crear Nuevo Paquete</h1>
                <p className="text-gray-500">Completa la información para crear un paquete turístico</p>
            </header>

            <ImageUpload
                onFileSelect={setDraggedFile}
                currentFile={draggedFile}
            />

            {/* Información básica */}
            <section className="grid grid-cols-1 gap-6 mb-8">
                <div className="w-full">
                    <label className="block text-sm font-medium text-green-600 mb-1">Título *</label>
                    <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => handleInputChange('title', e.target.value)}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 ${errors.title ? 'border-red-500' : 'border-gray-300'
                            }`}
                        placeholder="Nombre del paquete turístico"
                        aria-label="Título del paquete"
                    />
                    {errors.title && <p className="text-xs text-red-600 mt-1">{errors.title}</p>}
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
                    unavailableDates={unavailableDates}
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
                    value={formData.pricePerPerson}
                    onChange={(value) => handleInputChange('pricePerPerson', value)}
                    error={errors.pricePerPerson}
                />
                <div className="space-y-3">
                    <label className="block text-sm font-medium text-green-600">
                        <Clock className="inline mr-2 h-4 w-4" />
                        Cantidad de Personas *
                    </label>
                    <Input
                        id="capacity"
                        type="number"
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

export default CreatePackageForm;