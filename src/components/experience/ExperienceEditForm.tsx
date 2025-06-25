import React, { useState } from 'react';
import { Save, X, Upload } from 'lucide-react';
import { Experience } from '@/features/admin/experiences/ExperienceTypes';

interface ExperienceEditFormProps {
    experience: Experience;
    onSave: (data: Experience) => void;
    onCancel: () => void;
    isSaving: boolean;
}

const ExperienceEditForm: React.FC<ExperienceEditFormProps> = ({
    experience,
    onSave,
    onCancel,
    isSaving
}) => {
    const [formData, setFormData] = useState({
        name: experience?.name || '',
        history: experience?.history || '',
        description: experience?.description || '',
        type: experience?.type || '',
        image: experience?.image || ''
    });

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData as unknown as Experience);
    };

    return (
        <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Editar Experiencia</h2>
                <div className="flex items-center gap-3">
                    <button
                        onClick={handleSubmit}
                        disabled={isSaving}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 disabled:opacity-50"
                    >
                        {isSaving ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                        ) : (
                            <Save className="w-4 h-4" />
                        )}
                        Guardar Cambios
                    </button>
                    <button
                        onClick={onCancel}
                        className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
                    >
                        <X className="w-4 h-4" />
                        Cancelar
                    </button>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Información básica */}
                <div className="grid md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Nombre de la Experiencia
                        </label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => handleInputChange('name', e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                            placeholder="Nombre de tu experiencia"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Tipo de Experiencia
                        </label>
                        <select
                            value={formData.type}
                            onChange={(e) => handleInputChange('type', e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                            required
                        >
                            <option value="">Seleccionar tipo</option>
                            <option value="Ecoturismo">Ecoturismo</option>
                            <option value="Artesanía">Artesanía</option>
                            <option value="Gastronomía">Gastronomía</option>
                            <option value="Cultura">Cultura</option>
                            <option value="Aventura">Aventura</option>
                        </select>
                    </div>
                </div>

                {/* Imagen */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Imagen Principal
                    </label>
                    <div className="flex items-center gap-4">
                        {formData.image && (
                            <img
                                src={formData.image}
                                alt="Preview"
                                className="w-24 h-24 object-cover rounded-lg border border-gray-300"
                            />
                        )}
                        <button
                            type="button"
                            className="flex items-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-emerald-500 transition-colors"
                        >
                            <Upload className="w-5 h-5 text-gray-500" />
                            <span className="text-gray-600">Subir imagen</span>
                        </button>
                    </div>
                </div>

                {/* Historia */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Historia de la Experiencia
                    </label>
                    <textarea
                        value={formData.history as string}
                        onChange={(e) => handleInputChange('history', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
                        rows={6}
                        placeholder="Cuenta la historia de tu experiencia, cómo comenzó, qué te inspiró..."
                    />
                </div>

                {/* Descripción */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Descripción de Actividades
                    </label>
                    <textarea
                        value={formData.description as string}
                        onChange={(e) => handleInputChange('description', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
                        rows={6}
                        placeholder="Describe qué actividades realizan, qué pueden esperar los visitantes..."
                    />
                </div>
            </form>
        </div>
    );
};

export default ExperienceEditForm; 