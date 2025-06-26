import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Clock, DollarSign, Star, Users, Edit, Trash2, Eye } from 'lucide-react';
import { CreatePackageData } from '@/features/admin/packages/PackageTypes';
import { ExperiencesApi } from '@/services/home/experiences';
import { Experience } from '@/features/admin/experiences/ExperienceTypes';
import { formatPrice } from '@/utils/formatPrice';
import { usePackagesManagement } from '@/services/admin/usePackagesManagement';

interface PackageData extends CreatePackageData {
    id?: string;
    imageUrl?: string;
    createdAt?: string;
    status?: 'active' | 'inactive' | 'draft';
    bookingsCount?: number;
}

interface PackageDetailsViewProps {
    packageData: PackageData;
    onEdit?: (packageData: PackageData) => void;
    onDelete?: (packageId: string) => void;
    onStatusChange?: (packageId: string, status: string) => void;
    isEditable?: boolean;
    showActions?: boolean;
}

interface DashboardDetails {
    detail_id: number;
    description: string;
}

const PackageDetailsView: React.FC<PackageDetailsViewProps> = ({
    packageData,
    onEdit,
    onDelete,
    onStatusChange,
    isEditable = true,
    showActions = true
}) => {
    const [experiences, setExperiences] = useState<Experience[]>([]);
    const [details, setDetails] = useState<DashboardDetails[]>([]);
    const [loadingData, setLoadingData] = useState(true);
    const [currentMonth, setCurrentMonth] = useState<Date>(new Date(2025, 5));
    const { getDashboardDetails } = usePackagesManagement();

    // Cargar datos de experiencias y detalles
    useEffect(() => {
        const fetchData = async () => {
            setLoadingData(true);
            try {
                const [experiencesData, detailsData] = await Promise.all([
                    ExperiencesApi.getExperiences(),
                    getDashboardDetails(),
                ]);
                setExperiences(experiencesData);
                setDetails(detailsData as DashboardDetails[]);
            } catch (error) {
                console.error('Error al cargar los datos:', error);
            } finally {
                setLoadingData(false);
            }
        };

        fetchData();
    }, [getDashboardDetails]);

    // Obtener experiencias seleccionadas
    const selectedExperiences = experiences.filter(exp =>
        packageData.selectedExperiences.includes(exp.id?.toString() || '')
    );

    // Obtener detalles seleccionados
    const selectedDetails = details.filter(detail =>
        packageData.selectedDetails.includes(detail.detail_id?.toString() || '')
    );

    // Funciones para el calendario
    const navigateMonth = (direction: number): void => {
        setCurrentMonth(prev => {
            const newMonth = new Date(prev);
            newMonth.setMonth(prev.getMonth() + direction);
            return newMonth;
        });
    };

    const getDaysInMonth = (date: Date) => {
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
    };

    const monthNames: string[] = [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];

    const dayNames: string[] = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];

    const getStatusColor = (status?: string) => {
        switch (status) {
            case 'active':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'inactive':
                return 'bg-red-100 text-red-800 border-red-200';
            case 'draft':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getStatusText = (status?: string) => {
        switch (status) {
            case 'active':
                return 'Activo';
            case 'inactive':
                return 'Inactivo';
            case 'draft':
                return 'Borrador';
            default:
                return 'Sin estado';
        }
    };

    const handleEdit = () => {
        if (onEdit) {
            onEdit(packageData);
        }
    };

    const handleDelete = () => {
        if (onDelete && packageData.id) {
            if (window.confirm('¿Estás seguro de que deseas eliminar este paquete?')) {
                onDelete(packageData.id);
            }
        }
    };

    const handleStatusChange = (newStatus: string) => {
        if (onStatusChange && packageData.id) {
            onStatusChange(packageData.id, newStatus);
        }
    };

    return (
        <div className="w-full max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl border border-primary/20">
            {/* Header con acciones */}
            <header className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-start">
                    <div className="flex-1">
                        <div className="flex items-center gap-4 mb-2">
                            <h1 className="text-3xl font-extrabold text-primary">{packageData.title}</h1>
                            {packageData.status && (
                                <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(packageData.status)}`}>
                                    {getStatusText(packageData.status)}
                                </span>
                            )}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                            {packageData.createdAt && (
                                <span>Creado: {new Date(packageData.createdAt).toLocaleDateString()}</span>
                            )}
                            {packageData.bookingsCount !== undefined && (
                                <span className="flex items-center gap-1">
                                    <Users className="h-4 w-4" />
                                    {packageData.bookingsCount} reservas
                                </span>
                            )}
                        </div>
                    </div>

                    {showActions && (
                        <div className="flex gap-2">
                            <button
                                onClick={handleEdit}
                                disabled={!isEditable}
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                title="Editar paquete"
                            >
                                <Edit className="h-5 w-5" />
                            </button>
                            <button
                                onClick={handleDelete}
                                disabled={!isEditable}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                title="Eliminar paquete"
                            >
                                <Trash2 className="h-5 w-5" />
                            </button>
                            {packageData.status && (
                                <select
                                    value={packageData.status}
                                    onChange={(e) => handleStatusChange(e.target.value)}
                                    disabled={!isEditable}
                                    className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <option value="active">Activo</option>
                                    <option value="inactive">Inactivo</option>
                                    <option value="draft">Borrador</option>
                                </select>
                            )}
                        </div>
                    )}
                </div>
            </header>

            <div className="p-8">
                {/* Imagen del paquete */}
                {packageData.imageUrl && (
                    <section className="mb-8 flex justify-center">
                        <div className="relative max-w-md w-full">
                            <img
                                src={packageData.imageUrl}
                                alt={packageData.title}
                                className="w-full h-64 object-cover rounded-xl shadow-lg"
                            />
                            <div className="absolute top-2 right-2 bg-black/50 text-white px-2 py-1 rounded-lg text-xs">
                                <Eye className="inline h-3 w-3 mr-1" />
                                Vista previa
                            </div>
                        </div>
                    </section>
                )}

                {/* Descripción */}
                <section className="mb-8">
                    <h2 className="text-xl font-semibold text-green-700 mb-3">Descripción</h2>
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-gray-700 leading-relaxed">{packageData.description}</p>
                    </div>
                </section>

                {/* Información principal */}
                <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="bg-blue-50 p-4 rounded-lg">
                        <h3 className="font-semibold text-blue-700 mb-2 flex items-center">
                            <Clock className="mr-2 h-5 w-5" />
                            Duración
                        </h3>
                        <p className="text-2xl font-bold text-blue-800">{packageData.duration} horas</p>
                    </div>

                    <div className="bg-green-50 p-4 rounded-lg">
                        <h3 className="font-semibold text-green-700 mb-2 flex items-center">
                            <DollarSign className="mr-2 h-5 w-5" />
                            Precio por persona
                        </h3>
                        <p className="text-2xl font-bold text-green-800">
                            {formatPrice(Number(packageData.pricePerPerson))}
                        </p>
                    </div>
                </section>

                {/* Experiencias y Fechas */}
                <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    {/* Experiencias incluidas */}
                    <div className="border-2 border-primary/30 rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-green-700 mb-4 flex items-center">
                            <MapPin className="mr-2 h-5 w-5" />
                            Experiencias Incluidas
                        </h3>
                        <div className="space-y-3">
                            {loadingData ? (
                                <div className="text-center text-gray-400">Cargando experiencias...</div>
                            ) : selectedExperiences.length > 0 ? (
                                selectedExperiences.map((experience) => (
                                    <div key={experience.id} className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                        <span className="text-gray-700 font-medium">{experience.name}</span>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-500 italic">No hay experiencias seleccionadas</p>
                            )}
                        </div>
                    </div>

                    {/* Fechas no disponibles */}
                    <div className="border-2 border-primary/30 rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-green-700 mb-4 flex items-center">
                            <Calendar className="mr-2 h-5 w-5" />
                            Fechas No Disponibles
                        </h3>
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <div className="flex items-center justify-between mb-4">
                                <button
                                    type="button"
                                    onClick={() => navigateMonth(-1)}
                                    className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                                >
                                    ←
                                </button>
                                <h4 className="font-medium">
                                    {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                                </h4>
                                <button
                                    type="button"
                                    onClick={() => navigateMonth(1)}
                                    className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
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
                                {getDaysInMonth(currentMonth).map((day, index) => (
                                    <div key={index} className="aspect-square flex items-center justify-center">
                                        {day && (
                                            <div
                                                className={`w-8 h-8 rounded-full text-sm font-medium flex items-center justify-center ${packageData.unavailableDates.includes(day)
                                                        ? 'bg-red-500 text-white'
                                                        : 'text-gray-400'
                                                    }`}
                                            >
                                                {day}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>

                            <div className="flex items-center mt-4 text-sm text-red-600">
                                <div className="w-3 h-3 bg-red-600 rounded-full mr-2"></div>
                                <span>Fechas no disponibles: {packageData.unavailableDates.length}</span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Detalles del paquete */}
                <section className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                        <Star className="mr-2 h-5 w-5 text-green-600" />
                        Detalles Incluidos
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {loadingData ? (
                            <div className="text-center text-gray-400 col-span-full">Cargando detalles...</div>
                        ) : selectedDetails.length > 0 ? (
                            selectedDetails.map((detail) => (
                                <div key={detail.detail_id} className="flex items-center space-x-3 p-3 bg-white rounded-lg shadow-sm">
                                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                    <span className="text-gray-700">{detail.description}</span>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500 italic col-span-full">No hay detalles seleccionados</p>
                        )}
                    </div>
                </section>
            </div>
        </div>
    );
};

export default PackageDetailsView;