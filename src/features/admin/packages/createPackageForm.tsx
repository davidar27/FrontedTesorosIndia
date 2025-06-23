import React, { useState, ChangeEvent, FormEvent, DragEvent, useCallback, useMemo } from 'react';
import { Calendar, Upload, MapPin, Clock, DollarSign, Star } from 'lucide-react';
import { CreatePackageData } from '@/features/admin/packages/PackageTypes';
import { ExperiencesApi } from '@/services/home/experiences';
import { Experience } from '../experiences/ExperienceTypes';
import { formatPrice } from '@/utils/formatPrice';
import { usePackagesManagement } from '@/services/admin/usePackagesManagement';

interface PackageFormProps {
    initialData?: Partial<CreatePackageData>;
    onSubmit?: (data: CreatePackageData, file: File | null) => void;
    onCancel?: () => void;
    isLoading?: boolean;
}

interface DashboardDetails {
    detail_id: string;
    description: string;
}

const CreatePackageForm: React.FC<PackageFormProps> = ({
    initialData,
    onSubmit,
    onCancel,
    isLoading = false
}) => {
    const [formData, setFormData] = useState<CreatePackageData>({
        title: initialData?.title || '',
        description: initialData?.description || '',
        selectedExperiences: initialData?.selectedExperiences || [],
        unavailableDates: initialData?.unavailableDates || [],
        duration: initialData?.duration || '',
        pricePerPerson: initialData?.pricePerPerson || '',
        selectedDetails: initialData?.selectedDetails || ''
    });

    const [currentMonth, setCurrentMonth] = useState<Date>(new Date(2025, 5));
    const [draggedFile, setDraggedFile] = useState<File | null>(null);
    const [errors, setErrors] = useState<Partial<Record<keyof CreatePackageData, string>>>({});
    const [experiences, setExperiences] = useState<Experience[]>([]);
    const [loadingExperiences, setLoadingExperiences] = useState(true);
    const [displayValue, setDisplayValue] = useState('');
    const [, setNumericValue] = useState<number | null>(null);
    const { getDashboardDetails } = usePackagesManagement();
    const [details, setDetails] = useState<DashboardDetails[] | null>(null);
    const [loadingDetails, setLoadingDetails] = useState(true);

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



    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const raw = e.target.value.replace(/\D/g, '');
        const number = parseInt(raw, 10);

        if (!isNaN(number)) {
            setNumericValue(number);
            setDisplayValue(formatPrice(number));
        } else {
            setNumericValue(null);
            setDisplayValue('');
        }
    }, []);


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


    const handleExperienceToggle = useCallback((id: string) => {
        toggleArrayItem('selectedExperiences', id);
    }, [toggleArrayItem]);

    const handleDetailToggle = useCallback((id: string) => {
        toggleArrayItem('selectedDetails', id);
    }, [toggleArrayItem]);

    const handleDateToggle = useCallback((date: number) => {
        toggleArrayItem('unavailableDates', date);
    }, [toggleArrayItem]);


    const handleDragOver = useCallback((e: DragEvent<HTMLDivElement>): void => {
        e.preventDefault();
        e.stopPropagation();
    }, []);

    const handleDrop = useCallback((e: DragEvent<HTMLDivElement>): void => {
        e.preventDefault();
        e.stopPropagation();
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            const file = files[0];
            if (file.type.startsWith('image/') && file.size <= 5 * 1024 * 1024) { // 5MB
                setDraggedFile(file);
            } else {
                alert('Por favor selecciona una imagen menor a 5MB');
            }
        }
    }, []);

    const handleFileSelect = useCallback((e: ChangeEvent<HTMLInputElement>): void => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.type.startsWith('image/') && file.size <= 5 * 1024 * 1024) { // 5MB
                setDraggedFile(file);
            } else {
                alert('Por favor selecciona una imagen menor a 5MB');
            }
        }
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

        if (!formData.duration.trim()) {
            newErrors.duration = 'La duración es requerida';
        }

        if (!formData.pricePerPerson.trim()) {
            newErrors.pricePerPerson = 'El precio es requerido';
        } else if (isNaN(Number(formData.pricePerPerson)) || Number(formData.pricePerPerson) <= 0) {
            newErrors.pricePerPerson = 'Ingresa un precio válido';
        }

        if (!formData.selectedDetails.trim()) {
            newErrors.selectedDetails = 'Los servicios son requeridos';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }, [formData]);

    const daysInMonth = useMemo(() => {
        const date = currentMonth;
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonthCount = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay();

        const days: (number | null)[] = [];

        // Días vacíos al inicio
        for (let i = 0; i < startingDayOfWeek; i++) {
            days.push(null);
        }

        // Días del mes
        for (let day = 1; day <= daysInMonthCount; day++) {
            days.push(day);
        }

        return days;
    }, [currentMonth]);

    const navigateMonth = useCallback((direction: number): void => {
        setCurrentMonth(prev => {
            const newMonth = new Date(prev);
            newMonth.setMonth(prev.getMonth() + direction);
            return newMonth;
        });
    }, []);

    const monthNames: string[] = [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];

    const dayNames: string[] = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];

    const handleSubmit = (e: FormEvent<HTMLButtonElement>): void => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        if (onSubmit) {
            onSubmit(formData, draggedFile);
        } else {
            console.log('Datos del paquete:', formData);
            console.log('Archivo:', draggedFile);
            alert('¡Paquete guardado exitosamente!');
        }
    };

    const handleCancel = (): void => {
        if (onCancel) {
            onCancel();
        } else {
            setFormData({
                title: '',
                description: '',
                selectedExperiences: [],
                unavailableDates: [],
                duration: '',
                pricePerPerson: '',
                selectedDetails: ''
            });
            setDraggedFile(null);
            setErrors({});
        }
    };

    return (
        <div className="w-full max-w-3xl mx-auto bg-white rounded-2xl shadow-2xl p-8 border border-primary/20">
            <header className="mb-8 text-center">
                <h1 className="text-4xl font-extrabold text-primary mb-2">Crear Nuevo Paquete</h1>
                <p className="text-gray-500">Completa la información para crear un paquete turístico</p>
            </header>

            {/* Imagen */}
            <section className="mb-8 flex flex-col items-center">
                <label className="block text-lg font-semibold text-green-700 mb-2">Imagen del paquete</label>
                <div
                    className={`relative border-2 border-dashed rounded-xl p-6 w-full max-w-md bg-gray-50 flex flex-col items-center justify-center ${draggedFile ? 'border-green-500 bg-green-50' : 'border-gray-200'}`}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                >
                    {draggedFile ? (
                        <img src={URL.createObjectURL(draggedFile)} alt="Preview" className="w-40 h-40 object-cover rounded-lg mb-2" />
                    ) : (
                        <Upload className="h-12 w-12 text-gray-400 mb-2" />
                    )}
                    <input
                        type="file"
                        accept="image/*"
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        onChange={handleFileSelect}
                        aria-label="Cargar imagen del paquete"
                    />
                    <span className="text-gray-500 text-sm">Arrastra o haz clic para subir una imagen (máx 5MB)</span>
                    {draggedFile && (
                        <button
                            type="button"
                            onClick={() => setDraggedFile(null)}
                            className="mt-2 text-blue-500 underline text-xs"
                        >
                            Cambiar imagen
                        </button>
                    )}
                </div>
            </section>

            {/* Detalles básicos */}
            <section className="grid grid-cols-1 gap-6 mb-8">
                <div className="w-full">
                    <label className="block text-sm font-medium text-green-600 mb-1">Título *</label>
                    <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => handleInputChange('title', e.target.value)}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 ${errors.title ? 'border-red-500' : 'border-gray-300'}`}
                        placeholder="Nombre del paquete turístico"
                        aria-label="Título del paquete"
                    />
                    {errors.title && <p className="text-xs text-red-600 mt-1">{errors.title}</p>}
                </div>
            </section>

            {/* Descripción */}
            <div className="space-y-3">
                <label className="block text-sm font-medium text-green-600">
                    Descripción *
                </label>
                <textarea
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    rows={4}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none ${errors.description ? 'border-red-500' : 'border-gray-300'
                        }`}
                    placeholder="Describe las experiencias y actividades incluidas en el paquete"
                />
                {errors.description && (
                    <p className="text-sm text-red-600">{errors.description}</p>
                )}
            </div>

            {/* Selección de experiencias */}
            <div className="grid grid-cols-2 md:grid-cols-2 gap-6 w-full my-8">
                <div className="w-full border-2 border-primary/30 rounded-lg p-4">
                    <label className="text-sm font-medium text-green-600 mb-2 flex items-center">
                        <MapPin className="inline mr-2 h-4 w-4" />
                        Experiencias *
                    </label>
                    <div className="space-y-2">
                        {loadingExperiences ? (
                            <div className="text-center text-gray-400">Cargando experiencias...</div>
                        ) : (
                            experiences.map((experience) => (
                                <label key={experience.id} className="flex items-center space-x-3 cursor-pointer w-fit  transition-all duration-300">
                                    <input
                                        type="checkbox"
                                        checked={formData.selectedExperiences.includes(experience.id?.toString() || '')}
                                        onChange={() => handleExperienceToggle(experience.id?.toString() || '')}
                                        className="w-4 h-4 border-2 border-primary/50 rounded-full appearance-none checked:bg-primary checked:border-primary cursor-pointer mr-2 "
                                        aria-label={`Seleccionar experiencia ${experience.name}`}
                                    />
                                    <span className="text-gray-700">{experience.name}</span>
                                </label>
                            ))
                        )}
                    </div>
                    {errors.selectedExperiences && (
                        <p className="text-sm text-red-600">{errors.selectedExperiences}</p>
                    )}
                </div>

                {/* Fechas no disponibles */}
                <div className="w-full border-2 border-primary/30 rounded-lg p-4">
                    <label className=" text-sm font-medium text-green-600 mb-2 flex items-center">
                        <Calendar className="inline mr-2 h-4 w-4" />
                        Fechas no disponibles
                    </label>
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-center justify-between mb-4">
                            <button
                                type="button"
                                onClick={() => navigateMonth(-1)}
                                className="p-2 hover:bg-gray-200 rounded-lg transition-colors cursor-pointer"
                            >
                                ←
                            </button>
                            <h3 className="font-medium">
                                {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                            </h3>
                            <button
                                type="button"
                                onClick={() => navigateMonth(1)}
                                className="p-2 hover:bg-gray-200 rounded-lg transition-colors cursor-pointer"
                            >
                                →
                            </button>
                        </div>

                        <div className="grid grid-cols-7 gap-1 mb-2">
                            {dayNames.map((day, index) => (
                                <div key={`${day}-${index}`} className="text-center text-sm font-medium text-gray-500 py-2">
                                    {day}
                                </div>
                            ))}
                        </div>

                        <div className="grid grid-cols-7 gap-1">
                            {daysInMonth.map((day, index) => (
                                <div key={index} className="aspect-square flex items-center justify-center">
                                    {day && (
                                        <button
                                            type="button"
                                            onClick={() => handleDateToggle(day)}
                                            className={`w-8 h-8 rounded-full text-sm font-medium transition-colors ${formData.unavailableDates.includes(day)
                                                ? 'bg-red-500 text-white'
                                                : day === 5
                                                    ? 'bg-gray-300 text-gray-600'
                                                    : 'hover:bg-gray-200 text-gray-700'
                                                }`}
                                        >
                                            {day}
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>

                        <div className="flex items-center mt-4 text-sm text-red-600">
                            <div className="w-3 h-3 bg-red-600 rounded-full mr-2"></div>
                            <span>No disponibles</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Duración y Precio */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                    <label className="block text-sm font-medium text-green-600">
                        <Clock className="inline mr-2 h-4 w-4" />
                        Duración Por Horas*
                    </label>
                    <input
                        type="number"
                        inputMode="numeric"
                        value={formData.duration}
                        onChange={(e) => handleInputChange('duration', e.target.value)}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${errors.duration ? 'border-red-500' : 'border-gray-300'
                            }`}
                        placeholder="0"
                        min="0"
                    />
                    {errors.duration && (
                        <p className="text-sm text-red-600">{errors.duration}</p>
                    )}
                </div>

                <div className="space-y-3">
                    <label htmlFor="price" className="block text-sm font-medium text-green-600">
                        <DollarSign className="inline mr-2 h-4 w-4" />
                        Precio por persona (COP) *
                    </label>
                    <input
                        id="price"
                        type="text"
                        inputMode="numeric"
                        value={displayValue}
                        onChange={handleChange}
                        placeholder="$1.000"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
                    />

                    {errors.pricePerPerson && (
                        <p className="text-sm text-red-600">{errors.pricePerPerson}</p>
                    )}
                </div>
            </div>

            {/* Detalles */}
            <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <Star className="mr-2 h-5 w-5 text-green-600" />
                    Detalles
                </h3>

                <div className="space-y-3">
                    <div className="space-y-2">
                        {loadingDetails ? (
                            <div className="text-center text-gray-400">Cargando detalles...</div>
                        ) : (
                            details?.map((detail) => (
                                <label key={detail.detail_id} className="flex items-center space-x-3 cursor-pointer w-fit  transition-all duration-300">
                                    <input
                                        type="checkbox"
                                        checked={formData.selectedDetails.includes(detail.detail_id?.toString() || '')}
                                        onChange={() => handleDetailToggle(detail.detail_id?.toString() || '')}
                                        className="w-4 h-4 border-2 border-primary/50 rounded-full appearance-none checked:bg-primary checked:border-primary cursor-pointer mr-2 "
                                        aria-label={`Seleccionar detalle ${detail.description}`}
                                    />
                                    <span className="text-gray-700">{detail.description}</span>
                                </label>
                            ))
                        )}
                    </div>
                    {errors.selectedDetails && (
                        <p className="text-sm text-red-600">{errors.selectedDetails}</p>
                    )}
                </div>
            </div>

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