import React from 'react';
import { MapPin } from 'lucide-react';
import ReusableMap from '@/components/shared/ReusableMap';
import { Experience } from '@/features/experience/types/experienceTypes';

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
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                <MapPin className="w-4 h-4 text-blue-600" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-800">Nuestra Ubicación</h3>
                        </div>
                    </div>
                    <div className="h-64">
                        <ReusableMap
                            locations={[{
                                id: experience?.id || 0,
                                position: { lat: experience?.lat || 4, lng: experience?.lng || -75 },
                                name: experience?.name || '',
                                description: experience?.description || '',
                                type: experience?.type || '',
                            }]}
                        />
                        {experience?.lat && experience?.lng && (
                            <div className="absolute top-4 right-4">
                                <MapPin className="w-6 h-6 text-red-500" />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ActivitiesAndMap;