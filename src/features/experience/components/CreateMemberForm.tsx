import React, { useState } from 'react';
import { Save, X, Upload, User, Briefcase, Calendar, FileText, Image as ImageIcon } from 'lucide-react';
import Button from '@/components/ui/buttons/Button';
import Input from '@/components/ui/inputs/Input';
import { fileToWebp } from '@/utils/fileToWebp';

export interface CreateMemberData {
    name: string;
    age: number;
    profession: string;
    description: string;
    image: File | null;
}

interface CreateMemberFormProps {
    onSave: (memberData: CreateMemberData) => Promise<void>;
    onCancel: () => void;
    isLoading?: boolean;
}

const CreateMemberForm: React.FC<CreateMemberFormProps> = ({
    onSave,
    onCancel,
    isLoading = false
}) => {
    const [formData, setFormData] = useState<CreateMemberData>({
        name: '',
        age: 0,
        profession: '',
        description: '',
        image: null
    });
    const [errors, setErrors] = useState<Partial<CreateMemberData>>({});
    const [dragActive, setDragActive] = useState(false);

    const validateForm = (): boolean => {
        const newErrors: Partial<CreateMemberData> = {};

        if (!formData.name.trim()) {
            newErrors.name = 'El nombre es requerido';
        }

        if (!formData.profession.trim()) {
            newErrors.profession = 'La profesión es requerida';
        }

        if (formData.age <= 0) {
            newErrors.age = 'La edad debe ser mayor a 0' as unknown as number;
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {
            await onSave(formData);
        } catch (error) {
            console.error('Error al crear el miembro:', error);
        }
    };

    const handleImageChange = async (file: File) => {
        if (file) {
            try {
                const webpFile = await fileToWebp(file);
                setFormData(prev => ({ ...prev, image: webpFile }));
            } catch (error) {
                console.error('Error al convertir la imagen:', error);
            }
        }
    };

    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) handleImageChange(file);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setDragActive(false);
        const file = e.dataTransfer.files?.[0];
        if (file && file.type.startsWith('image/')) {
            handleImageChange(file);
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setDragActive(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setDragActive(false);
    };

    return (
        <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                <div className="bg-gradient-to-r from-primary via-primary/80 to-primary/60 p-8 text-white">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-3xl font-bold mb-2">Nuevo Integrante</h1>
                            <p className="text-gray-100 text-lg">Completa la información del nuevo miembro del equipo</p>
                        </div>
                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row items-center gap-4">
                            <Button
                                type="submit"
                                onClick={handleSubmit}
                                disabled={isLoading}
                                className='flex items-center gap-2'
                                variant='success'
                            >
                                <Save className="w-5 h-5 mr-2" />
                                {isLoading ? (
                                    <span className="flex items-center gap-2">
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        Creando...
                                    </span>
                                ) : (
                                    'Crear Integrante'
                                )}
                            </Button>

                            <Button
                                type="button"
                                onClick={onCancel}
                                variant="cancel"
                                disabled={isLoading}
                                className='flex items-center gap-2'
                            >
                                <X className="w-5 h-5 mr-2" />
                                Cancelar
                            </Button>
                        </div>
                    </div>
                </div>
                {/* Form Card */}


                <form className="p-8 space-y-8">
                    {/* Image Upload Section */}
                    <div className="flex flex-col items-center">
                        <div className="relative mb-6">
                            <div
                                className={`w-32 h-32 rounded-full border-4 border-dashed transition-all duration-300 flex items-center justify-center cursor-pointer ${dragActive
                                    ? 'border-primary bg-primary/10'
                                    : 'border-gray-300 hover:border-primary hover:bg-gray-50'
                                    }`}
                                onDrop={handleDrop}
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onClick={() => document.getElementById('member-image')?.click()}
                            >
                                {formData.image ? (
                                    <div className="relative w-full h-full">
                                        <img
                                            src={URL.createObjectURL(formData.image)}
                                            alt="Preview"
                                            className="w-full h-full object-cover rounded-full"
                                        />
                                        <div className="absolute inset-0 bg-black bg-opacity-40 rounded-full flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
                                            <Upload className="w-6 h-6 text-white" />
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center">
                                        <ImageIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                                        <p className="text-xs text-gray-500">Subir foto</p>
                                    </div>
                                )}
                            </div>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileInput}
                                className="hidden"
                                id="member-image"
                            />
                        </div>
                        <p className="text-sm text-gray-500 text-center">
                            Arrastra una imagen o haz clic para seleccionar
                        </p>
                    </div>

                    {/* Form Fields */}
                    <div className="grid lg:grid-cols-2 gap-6">
                        {/* Name Field */}
                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                                <User className="w-4 h-4 text-primary" />
                                Nombre Completo *
                            </label>
                            <div className="relative">
                                <Input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                    placeholder="Ingresa el nombre completo"
                                    error={errors.name}
                                    className="pl-10 h-12 border-2 border-gray-200 focus:border-primary rounded-xl transition-all duration-300"
                                    required
                                />
                                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                            </div>
                        </div>

                        {/* Age Field */}
                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                                <Calendar className="w-4 h-4 text-primary" />
                                Edad *
                            </label>
                            <div className="relative">
                                <Input
                                    type="number"
                                    value={formData.age || ''}
                                    onChange={(e) => setFormData(prev => ({ ...prev, age: parseInt(e.target.value) || 0 }))}
                                    placeholder="Edad"
                                    min="1"
                                    max="120"
                                    error={errors.age?.toString()}
                                    className="pl-10 h-12 border-2 border-gray-200 focus:border-primary rounded-xl transition-all duration-300"
                                    required
                                />
                                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                            </div>
                        </div>

                        {/* Profession Field */}
                        <div className="lg:col-span-2 space-y-2">
                            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                                <Briefcase className="w-4 h-4 text-primary" />
                                Profesión *
                            </label>
                            <div className="relative">
                                <Input
                                    type="text"
                                    value={formData.profession}
                                    onChange={(e) => setFormData(prev => ({ ...prev, profession: e.target.value }))}
                                    placeholder="Profesión o rol en el equipo"
                                    error={errors.profession}
                                    className="pl-10 h-12 border-2 border-gray-200 focus:border-primary rounded-xl transition-all duration-300"
                                    required
                                />
                                <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                            </div>
                        </div>
                    </div>

                    {/* Description Field */}
                    <div className="space-y-2">
                        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                            <FileText className="w-4 h-4 text-primary" />
                            Descripción
                        </label>
                        <div className="relative">
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 focus:border-primary focus:ring-0 rounded-xl resize-none transition-all duration-300 min-h-[100px]"
                                rows={4}
                                placeholder="Describe brevemente al integrante, sus habilidades y experiencia..."
                                maxLength={500}
                            />
                            <FileText className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                        </div>
                        <div className="flex justify-between items-center">
                            <p className="text-xs text-gray-500">
                                Opcional: Añade una breve descripción que destaque las fortalezas del integrante
                            </p>
                            <div className={`text-xs font-medium ${formData.description.length > 250 ? 'text-orange-500' : 'text-gray-400'
                                }`}>
                                {formData.description.length}/500
                            </div>
                        </div>
                    </div>


                </form>
            </div>
        </div>
    );
};

export default CreateMemberForm;