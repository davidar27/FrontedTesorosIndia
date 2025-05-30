import React from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Edit3, Eye, MapPin, Coffee, Users, Calendar } from 'lucide-react';
import clsx from 'clsx';
import LoadingSpinner from '@/components/layouts/LoadingSpinner';
import { useFarmQuery } from '@/hooks/useFarmQuery';

interface AuthUser {
    id: number;
    role: string;
}

interface AuthContextType {
    user: AuthUser | null;
}

const renderValue = (value: string | number | boolean | Date | null | undefined): string => {
    if (value instanceof Date) {
        return value.toLocaleDateString();
    }
    return String(value || 'No disponible');
};

const FarmPage: React.FC = () => {
    const { farmId } = useParams<{ farmId: string }>();
    const { user } = useAuth() as AuthContextType;
    const { data: farm, isLoading, error } = useFarmQuery(farmId);

    const isEntrepreneur = user?.role === 'emprendedor';
    const isOwner = isEntrepreneur && farm?.entrepreneurId === user?.id;

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <LoadingSpinner message="Cargando información de la finca..." />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <p className="text-red-600 text-lg">Error al cargar la información de la finca</p>
                <p className="text-gray-500 mt-2">Por favor, intente más tarde</p>
            </div>
        );
    }

    if (!farm) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <p className="text-gray-600 text-lg">Finca no encontrada</p>
                <p className="text-gray-500 mt-2">La finca que busca no existe o fue eliminada</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                {/* Encabezado */}
                <div className="relative h-48 bg-gradient-to-r from-green-600 to-green-400">
                    <div className="absolute inset-0 bg-black/20" />
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                        <div className="flex justify-between items-end">
                            <div>
                                <h1 className="text-3xl font-bold text-white mb-2">{farm.name}</h1>
                                <div className="flex items-center text-white/90">
                                    <MapPin className="w-4 h-4 mr-2" />
                                    <span>{renderValue(farm.location)}</span>
                                </div>
                            </div>
                            {isOwner && (
                                <button
                                    className={clsx(
                                        'flex items-center gap-2 px-4 py-2 rounded-lg',
                                        'bg-white/10 backdrop-blur-sm text-white',
                                        'hover:bg-white/20 transition-colors duration-200'
                                    )}
                                >
                                    <Edit3 className="w-4 h-4" />
                                    <span>Editar Finca</span>
                                </button>
                            )}
                            {!isOwner && (
                                <div className="flex items-center gap-2 text-white/90">
                                    <Eye className="w-4 h-4" />
                                    <span>Modo Visualización</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Contenido */}
                <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Información General */}
                        <div className="col-span-2 space-y-6">
                            <section>
                                <h2 className="text-xl font-semibold text-gray-800 mb-4">Descripción</h2>
                                <p className="text-gray-600">
                                    {renderValue(farm.description)}
                                </p>
                            </section>

                            <section>
                                <h2 className="text-xl font-semibold text-gray-800 mb-4">Características</h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                                        <Coffee className="w-5 h-5 text-green-600" />
                                        <div>
                                            <p className="text-sm text-gray-500">Tipo de Finca</p>
                                            <p className="font-medium text-gray-800">{renderValue(farm.cropType)}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                                        <Users className="w-5 h-5 text-green-600" />
                                        <div>
                                            <p className="text-sm text-gray-500">Capacidad de Visitantes</p>
                                            <p className="font-medium text-gray-800">{renderValue(farm.visitorCapacity)}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                                        <Calendar className="w-5 h-5 text-green-600" />
                                        <div>
                                            <p className="text-sm text-gray-500">Horario de Visitas</p>
                                            <p className="font-medium text-gray-800">{renderValue(farm.visitSchedule)}</p>
                                        </div>
                                    </div>
                                </div>
                            </section>
                        </div>

                        {/* Barra Lateral */}
                        <div className="space-y-6">
                            <div className="bg-gray-50 p-6 rounded-lg">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">Información de Contacto</h3>
                                <div className="space-y-3">
                                    <p className="text-gray-600">
                                        <span className="font-medium">Email:</span> {renderValue(farm.email)}
                                    </p>
                                    <p className="text-gray-600">
                                        <span className="font-medium">Teléfono:</span> {renderValue(farm.phone)}
                                    </p>
                                    <p className="text-gray-600">
                                        <span className="font-medium">Dirección:</span> {renderValue(farm.address)}
                                    </p>
                                </div>
                            </div>

                            {isOwner && (
                                <div className="bg-green-50 p-6 rounded-lg">
                                    <h3 className="text-lg font-semibold text-green-800 mb-4">Acciones del Propietario</h3>
                                    <div className="space-y-3">
                                        <button className="w-full py-2 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                                            Gestionar Reservas
                                        </button>
                                        <button className="w-full py-2 px-4 bg-white text-green-600 border border-green-600 rounded-lg hover:bg-green-50 transition-colors">
                                            Ver Estadísticas
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FarmPage; 