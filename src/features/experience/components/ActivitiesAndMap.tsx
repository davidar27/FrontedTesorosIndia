import React, { useState } from 'react';
import { CheckCircle, MapPin, Navigation, Edit3 } from 'lucide-react';
import ReusableMap from '@/components/shared/ReusableMap';
import { Experience } from '@/features/experience/types/experienceTypes';
import Button from '@/components/ui/buttons/Button';

interface ActivitiesAndMapProps {
    experience: Experience;
    isEditMode: boolean;
    editData: Partial<Experience>;
    onEditDataChange: (data: Partial<Experience>) => void;
}

const ActivitiesAndMap: React.FC<ActivitiesAndMapProps> = ({
    experience,
    isEditMode,
    editData,
    onEditDataChange
}) => {
    const [position, setPosition] = useState<[number, number] | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const currentLat = editData.lat || experience.lat;
    const currentLng = editData.lng || experience.lng;
    const hasLocation = experience?.lat && experience?.lng;




    const getCurrentLocation = () => {
        setIsLoading(true);
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const { latitude, longitude } = pos.coords;
                console.log('ActivitiesAndMap: Setting coordinates to:', { lat: latitude, lng: longitude }); // Debug log
                setPosition([latitude, longitude]);
                onEditDataChange({
                    ...editData,
                    lat: latitude,
                    lng: longitude
                });
                setIsSuccess(true);
                setIsLoading(false);
                setTimeout(() => {
                    setIsSuccess(false);
                }, 3000);
            },
            (error) => {
                console.error('Error obteniendo ubicación:', error);
            }
        );
    }

    const deleteCurrentLocation = () => {
        setPosition(null);
        onEditDataChange({
            ...editData,
            lat: undefined,
            lng: undefined
        });
    }
    return (
        <section className="mb-12">
            <div className="grid lg:grid-cols-2 gap-8">
                <div className="bg-white rounded-3xl shadow-xl p-8">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                            <span className="text-orange-600 text-xl">🌱</span>
                        </div>
                        <h2 className="text-3xl font-bold text-gray-800">¿Qué hacemos?</h2>
                    </div>
                    <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
                        {isEditMode ? (
                            <textarea
                                value={editData.description || ''}
                                onChange={(e) => onEditDataChange({ ...editData, description: e.target.value })}
                                className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                                rows={6}
                                placeholder="Describe qué hace tu experiencia..."
                            />
                        ) : (
                            <p>{experience?.description || 'No se ha proporcionado una descripción para esta experiencia.'}</p>
                        )}
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100">
                    {/* Header */}
                    <div className="px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                                    <MapPin className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-gray-800">Nuestra Ubicación</h3>
                                </div>
                            </div>

                            {isEditMode && (
                                <div className="flex items-center gap-2">
                                    <Button
                                        variant={position ? 'danger' : 'primary'}
                                        onClick={position ? deleteCurrentLocation : getCurrentLocation}
                                        loading={isLoading}
                                        messageLoading="Obteniendo ubicación..."
                                        variantLoading="secondary"
                                        className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200"
                                    >
                                        <Navigation className="w-4 h-4" />
                                        Configurar nueva ubicación
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                        {/* Address Input/Display */}
                        {isEditMode ? (
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Dirección de la experiencia
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={editData.location || ''}
                                        onChange={(e) => {
                                            console.log('ActivitiesAndMap: Location changed to:', e.target.value); // Debug log
                                            onEditDataChange({ ...editData, location: e.target.value });
                                        }}
                                        placeholder="Ej: Vía La Julia, Km 3,9, Filandia, Quindío, Colombia"
                                        className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                                    />
                                    <Edit3 className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                </div>
                            </div>
                        ) : (
                            <div className="mb-6">
                                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-200">
                                    <MapPin className="w-5 h-5 text-blue-600 flex-shrink-0" />
                                    <span className="text-gray-700 font-medium">
                                        {editData.location || 'Vía La Julia, Km 3,9, Filandia, Quindío, Colombia'}
                                    </span>
                                </div>
                            </div>
                        )}

                        {/* Map Container */}
                        <div className="relative">
                            <div className="h-64 rounded-xl overflow-hidden border border-gray-200 bg-gray-100">
                                {/* Success Overlay */}
                                {isEditMode && isSuccess && (
                                    <div className="absolute inset-0 bg-black/50 z-50 flex items-center justify-center rounded-xl backdrop-blur-sm">
                                        <div className="bg-white rounded-2xl p-6 shadow-2xl border border-green-200">
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                                                    <CheckCircle className="w-6 h-6 text-green-600" />
                                                </div>
                                                <div>
                                                    <h4 className="font-semibold text-gray-800">¡Perfecto!</h4>
                                                    <p className="text-sm text-gray-600">Ubicación actualizada con éxito</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Map Content */}
                                {isEditMode ? (
                                    <ReusableMap
                                        locations={[{
                                            id: experience?.id || 0,
                                            position: {
                                                lat: currentLat || position?.[0] || 4,
                                                lng: currentLng || position?.[1] || -75
                                            },
                                            name: experience?.name || '',
                                            description: experience?.description || '',
                                            type: experience?.type || '',
                                        }]}
                                    />
                                ) : (
                                    <>
                                        {hasLocation ? (
                                            <ReusableMap
                                                locations={[{
                                                    id: experience?.id || 0,
                                                    position: { lat: experience.lat, lng: experience.lng },
                                                    name: experience?.name || '',
                                                    description: experience?.description || '',
                                                    type: experience?.type || '',
                                                }]}
                                            />
                                        ) : (
                                            <div className="flex flex-col items-center justify-center h-full text-center p-8">
                                                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                                                    <MapPin className="w-8 h-8 text-gray-400" />
                                                </div>
                                                <h4 className="text-lg font-semibold text-gray-700 mb-2">
                                                    Sin ubicación definida
                                                </h4>
                                                <p className="text-sm text-gray-500 max-w-xs">
                                                    No se ha configurado una ubicación para esta experiencia
                                                </p>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>

                            {/* Status Badge */}
                            {!isEditMode && hasLocation && (
                                <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-medium shadow-lg">
                                    Ubicación activa
                                </div>
                            )}
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
};

export default ActivitiesAndMap;