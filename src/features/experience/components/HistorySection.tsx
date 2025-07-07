import React, { useState } from 'react';
import { getImageUrl } from '@/utils/getImageUrl';
import { Experience } from '@/features/experience/types/experienceTypes';
import Picture from '@/components/ui/display/Picture';
import { CameraIcon, Save, Edit3 } from 'lucide-react';
import { motion } from 'framer-motion';
import { fileToWebp } from '@/utils/fileToWebp';

interface HistorySectionProps {
    experience: Experience;
    isEditMode: boolean;
    editData: Partial<Experience>;
    onEditDataChange: (data: Partial<Experience>) => void;
    onSave?: () => void;
}

const HistorySection: React.FC<HistorySectionProps> = ({
    experience,
    isEditMode,
    editData,
    onEditDataChange,
    onSave
}) => {
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [, setImageFile] = useState<File | null>(null);

    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Validación básica de tipo y tamaño (5MB máximo)
            if (!file.type.match('image.*')) {
                alert('Por favor selecciona un archivo de imagen válido');
                return;
            }
            if (file.size > 5 * 1024 * 1024) {
                alert('La imagen no debe exceder los 5MB');
                return;
            }
            const webpFile = await fileToWebp(file);
            const imageUrl = URL.createObjectURL(webpFile);
            setPreviewImage(imageUrl);
            setImageFile(webpFile);
            onEditDataChange({ ...editData, image: webpFile.name });
        }
    };

    return (
        <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-16"
        >
            <div className="relative bg-gradient-to-br from-white via-emerald-50/30 to-amber-50/20 rounded-3xl shadow-lg overflow-hidden border border-gray-100">
                {/* Decorative elements - más sutiles */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-400/5 to-amber-400/5 rounded-full -translate-y-16 translate-x-16"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-emerald-300/5 to-transparent rounded-full translate-y-12 -translate-x-12"></div>

                <div className="flex flex-col lg:flex-row min-h-[500px]">
                    {/* Imagen Section */}
                    <div className="lg:w-1/2 relative overflow-hidden group">
                        <input
                            type="file"
                            accept="image/jpeg, image/png"
                            onChange={handleImageChange}
                            className="hidden"
                            id="history-image-input"
                            aria-label="Cargar imagen de la experiencia"
                            disabled={!isEditMode}
                        />
                        <label
                            htmlFor={isEditMode ? "history-image-input" : undefined}
                            className={`block h-full w-full ${isEditMode ? 'cursor-pointer' : 'cursor-default'}`}
                        >
                            {previewImage || getImageUrl(experience?.image) ? (
                                <div className="relative h-full w-full">
                                    <Picture
                                        src={previewImage || getImageUrl(experience?.image) || ''}
                                        alt={experience?.name as string}
                                        className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105"
                                    />
                                    {isEditMode && (
                                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                            <motion.span
                                                className="text-white font-medium text-lg flex items-center gap-2"
                                                initial={{ y: 10 }}
                                                animate={{ y: 0 }}
                                            >
                                                <Edit3 className="w-5 h-5" />
                                                {previewImage ? 'Cambiar imagen' : 'Editar imagen'}
                                            </motion.span>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className={`w-full h-full aspect-video flex flex-col items-center justify-center gap-2 ${isEditMode ? 'bg-gray-100 hover:bg-gray-50' : 'bg-gray-50'
                                    } transition-colors`}>
                                    <CameraIcon className="w-10 h-10 text-gray-400" />
                                    <span className="text-sm font-medium">
                                        {isEditMode ? 'Agregar imagen' : 'Sin imagen'}
                                    </span>
                                    {isEditMode && (
                                        <span className="text-xs text-gray-400">JPEG, PNG (Max. 5MB)</span>
                                    )}
                                </div>
                            )}
                        </label>
                    </div>

                    {/* Content Section */}
                    <div className="lg:w-1/2 p-8 lg:p-12 relative z-10 flex flex-col">
                        {/* Header */}
                        <motion.div
                            className="flex items-center gap-4 mb-8"
                            initial={{ x: -20 }}
                            animate={{ x: 0 }}
                        >
                            <div className="relative">
                                <motion.div
                                    className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg"
                                    whileHover={{ rotate: 3 }}
                                >
                                    <span className="text-white text-2xl">📜</span>
                                </motion.div>
                            </div>
                            <div>
                                <h2 className="text-3xl font-bold text-gray-800">
                                    Nuestra Historia
                                </h2>
                                <div className="w-12 h-1 bg-gradient-to-r from-emerald-500 to-amber-400 rounded-full mt-2"></div>
                            </div>
                        </motion.div>

                        {/* Content */}
                        <div className="flex-grow">
                            {isEditMode ? (
                                <div className="relative h-full">
                                    <textarea
                                        value={editData.history || ''}
                                        onChange={(e) => onEditDataChange({ ...editData, history: e.target.value })}
                                        className="w-full h-full p-6 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 resize-none transition-all duration-200 bg-white text-gray-700 placeholder-gray-400"
                                        placeholder="Cuenta la historia fascinante de tu experiencia..."
                                        maxLength={2000}
                                    />
                                    <div className="absolute bottom-3 right-3 text-xs text-gray-500 bg-white px-2 py-1 rounded">
                                        {editData.history?.length || 0}/2000
                                    </div>
                                </div>
                            ) : (
                                <div className="h-full flex items-center">
                                    {experience?.history ? (
                                        <blockquote className="relative pl-8 text-gray-700 italic">
                                            <div className="absolute left-0 top-0 text-5xl text-emerald-100 font-serif leading-none">"</div>
                                            <p className="text-lg leading-relaxed">
                                                {experience.history}
                                            </p>
                                            <div className="absolute right-0 bottom-0 text-5xl text-emerald-100 font-serif leading-none">"</div>
                                        </blockquote>
                                    ) : (
                                        <p className="text-gray-500 italic">
                                            No se ha agregado la historia de esta experiencia.
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Action Button */}
                        {isEditMode && (
                            <div className="mt-6 flex justify-end">
                                <motion.button
                                    className="bg-emerald-600 text-white px-6 py-3 rounded-xl hover:bg-emerald-700 transition-colors flex items-center gap-2 shadow-md"
                                    whileHover={{ y: -2 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={onSave}
                                >
                                    <Save className="w-5 h-5" />
                                    Guardar Cambios
                                </motion.button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </motion.section>
    );
};

export default HistorySection;