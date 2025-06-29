import React from 'react';
import { getImageUrl } from '@/utils/getImageUrl';
import { Experience } from '@/features/experience/types/experienceTypes';

interface HistorySectionProps {
    experience: Experience;
    isEditMode: boolean;
    editData: Partial<Experience>;
    onEditDataChange: (data: Partial<Experience>) => void;
}

const HistorySection: React.FC<HistorySectionProps> = ({
    experience,
    isEditMode,
    editData,
    onEditDataChange
}) => {
    return (
        <section className="mb-16">
            <div className="relative bg-gradient-to-br from-white via-emerald-50/30 to-amber-50/20 rounded-3xl shadow-2xl overflow-hidden">
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-400/10 to-amber-400/10 rounded-full -translate-y-16 translate-x-16"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-emerald-300/10 to-transparent rounded-full translate-y-12 -translate-x-12"></div>

                <div className="flex flex-col lg:flex-row min-h-[500px]">
                    {/* Imagen Section */}
                    <div className="lg:w-1/2 relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/20 to-transparent z-10"></div>
                        <img
                            src={getImageUrl(experience?.image) || ''}
                            alt={experience?.name}
                            className="w-full h-64 lg:h-full object-cover transform hover:scale-105 transition-transform duration-700"
                        />
                        {/* Overlay decorativo */}
                        <div className="absolute bottom-4 left-4 z-20">
                            <div className="bg-white/90 backdrop-blur-sm rounded-2xl px-4 py-2 shadow-lg">
                                <span className="text-emerald-600 font-semibold text-sm">Experiencia Auténtica</span>
                            </div>
                        </div>
                    </div>

                    {/* Content Section */}
                    <div className="lg:w-1/2 p-8 lg:p-12 relative z-10">
                        {/* Header con animación mejorada */}
                        <div className="flex items-center gap-4 mb-8">
                            <div className="relative">
                                <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg transform rotate-3 hover:rotate-0 transition-transform duration-300">
                                    <span className="text-white text-2xl">📜</span>
                                </div>
                                {/* Sparkle effect */}
                                <div className="absolute -top-1 -right-1 w-4 h-4 bg-amber-400 rounded-full animate-pulse"></div>
                            </div>
                            <div>
                                <h2 className="text-4xl font-bold bg-gradient-to-r from-emerald-700 via-emerald-600 to-emerald-500 bg-clip-text text-transparent">
                                    Nuestra Historia
                                </h2>
                                <div className="w-12 h-1 bg-gradient-to-r from-emerald-500 to-amber-400 rounded-full mt-2"></div>
                            </div>
                        </div>

                        {/* Content con mejor tipografía */}
                        <div className="relative">
                            {isEditMode ? (
                                <div className="relative">
                                    <textarea
                                        value={editData.history || ''}
                                        onChange={(e) => onEditDataChange({ ...editData, history: e.target.value })}
                                        className="w-full p-6 border-2 border-emerald-200 rounded-2xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-400 resize-none transition-all duration-300 bg-white/80 backdrop-blur-sm text-gray-700 placeholder-gray-400"
                                        rows={8}
                                        placeholder="Cuenta la historia fascinante de tu experiencia, los orígenes de tu emprendimiento y lo que hace especial este lugar..."
                                    />
                                    {/* Character counter */}
                                    <div className="absolute bottom-3 right-3 text-xs text-gray-400 bg-white/80 px-2 py-1 rounded-lg">
                                        {editData.history?.length || 0} caracteres
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <div className="relative">
                                        {/* Quote decoration */}
                                        <div className="absolute -left-4 -top-2 text-6xl text-emerald-200 font-serif">"</div>
                                        <p className="text-lg leading-relaxed text-gray-700 pl-8 relative z-10 font-light">
                                            {experience?.history || 'Cada lugar tiene una historia única que contar. Esta experiencia representa años de tradición, pasión y dedicación por ofrecer lo mejor de nuestra cultura y territorio.'}
                                        </p>
                                        <div className="absolute -right-2 -bottom-2 text-4xl text-emerald-200 font-serif">"</div>
                                    </div>

                                    {/* Elementos decorativos adicionales */}
                                    <div className="flex items-center gap-6 mt-8 pt-6 border-t border-emerald-100">
                                        <div className="flex items-center gap-2 text-emerald-600">
                                            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                                            <span className="text-sm font-medium">Tradición Familiar</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-amber-600">
                                            <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></div>
                                            <span className="text-sm font-medium">Experiencia Auténtica</span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Botón de acción si está en modo edición */}
                        {isEditMode && (
                            <div className="mt-6 flex justify-end">
                                <button className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-6 py-3 rounded-xl hover:from-emerald-600 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center gap-2">
                                    <span>💾</span>
                                    Guardar Historia
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HistorySection;