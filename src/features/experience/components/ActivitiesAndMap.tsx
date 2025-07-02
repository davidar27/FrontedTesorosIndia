import React, { useState } from 'react';
import { CheckCircle, MapPin } from 'lucide-react';
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



    const getCurrentLocation = () => {
        setIsLoading(true);
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const { latitude, longitude } = pos.coords;
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

                <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
                    <div className="p-6">
                        <div className="flex items-center gap-3 justify-between">
                            <div className='flex items-center gap-3'>
                                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                    <MapPin className="w-4 h-4 text-blue-600" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-800">Nuestra Ubicación</h3>
                            </div>
                            {isEditMode && (

                                <Button
                                    className=''
                                    variant={position ? 'danger' : 'secondary'}
                                    onClick={position ? deleteCurrentLocation : getCurrentLocation}
                                    loading={isLoading}
                                    messageLoading='Obteniendo ubicación...'
                                    variantLoading='secondary'
                                >

                                    {position ? 'Eliminar ubicación Actual' : 'Agregar nueva ubicación'}
                                </Button>
                            )}
                        </div>

                    </div>
                    <div className="h-64">
                        {isEditMode ? (
                            <div className='relative'>
                                {isSuccess && (
                                    <div className='absolute top-0 left-0 w-full h-[64%] bg-black/30 z-50 flex justify-center items-center rounded-t-xl'>
                                        <div className='flex items-center gap-3'>
                                            <CheckCircle className='w-10 h-10 text-green-500' />
                                            <p className='text-white text-xl text-center'>Ubicación cambiada con exito</p>
                                        </div>
                                    </div>
                                )}
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
                            </div>
                        ) : (
                            experience?.lat && experience?.lng ? (
                                <ReusableMap
                                    locations={[{
                                        id: experience?.id || 0,
                                        position: { lat: experience?.lat || 4, lng: experience?.lng || -75 },
                                        name: experience?.name || '',
                                        description: experience?.description || '',
                                        type: experience?.type || '',
                                    }]}
                                />
                            ) : (
                                <div className='flex justify-center items-center h-full'>
                                    <p className='text-gray-500 text-xl text-center'>No se ha agregado una ubicación para esta experiencia</p>
                                </div>
                            )
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ActivitiesAndMap;