import React, { useState } from 'react';
import { CheckCircle, MapPin, Navigation, Edit3, FileText, Leaf, Sparkles } from 'lucide-react';
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
    const hasDescription = experience?.description && experience.description.length > 0;
    const currentDescription = editData.description || experience?.description || '';




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
                <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100">
                    {/* Header */}
                    <div className="px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-emerald-50 via-green-50 to-teal-50">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
                                    <Leaf className="w-7 h-7 text-white" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                                        ¿Qué hacemos?
                                        <Sparkles className="w-5 h-5 text-emerald-500" />
                                    </h2>
                                </div>
                            </div>

                            {isEditMode && (
                                <div className="bg-white/80 backdrop-blur-sm rounded-lg px-3 py-2 border border-white/50">
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <Edit3 className="w-4 h-4" />
                                        <span>Modo edición</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                        {isEditMode ? (
                            <div className="space-y-4">
                                <div className="flex items-center gap-3 text-sm text-gray-600">
                                    <FileText className="w-4 h-4" />
                                    <span>Describe la experiencia que ofreces a tus visitantes</span>
                                </div>

                                <div className="relative">
                                    <textarea
                                        value={currentDescription}
                                        onChange={(e) => onEditDataChange({ ...editData, description: e.target.value })}
                                        className="w-full p-4 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 bg-gray-50 focus:bg-white resize-none text-gray-700 leading-relaxed"
                                        rows={8}
                                        placeholder="Cuéntanos sobre tu experiencia... ¿Qué actividades realizas? ¿Qué hace única tu finca? ¿Qué pueden esperar los visitantes?"
                                        maxLength={500}
                                    />

                                    {/* Character counter */}
                                    <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg px-2 py-1 border border-gray-200">
                                        <span className="text-xs text-gray-500">
                                            {currentDescription.length}/500 caracteres
                                        </span>
                                    </div>
                                </div>

                                {/* Helper text */}
                                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                                    <div className="flex items-start gap-3">
                                        <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                                            <Sparkles className="w-4 h-4 text-emerald-600" />
                                        </div>
                                        <div>
                                            <h4 className="font-medium text-emerald-800 mb-1">Consejos para una buena descripción:</h4>
                                            <ul className="text-sm text-emerald-700 space-y-1">
                                                <li>• Menciona las actividades principales que realizas</li>
                                                <li>• Describe el ambiente y la experiencia única</li>
                                                <li>• Incluye qué aprenderán o vivirán los visitantes</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {hasDescription ? (
                                    <div className="prose prose-lg max-w-none">
                                        <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-6 border border-gray-200">
                                            <p className="text-gray-700 leading-relaxed text-lg m-0">
                                                {experience?.description}
                                            </p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center py-12">
                                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <FileText className="w-10 h-10 text-gray-400" />
                                        </div>
                                        <h4 className="text-xl font-semibold text-gray-700 mb-2">
                                            Sin descripción
                                        </h4>
                                        <p className="text-gray-500 max-w-md mx-auto">
                                            No se ha proporcionado una descripción para esta experiencia.
                                            Agrega una descripción para que los visitantes sepan qué pueden esperar.
                                        </p>
                                    </div>
                                )}
                            </div>
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