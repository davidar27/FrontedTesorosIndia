import React, { useState } from 'react';
import { DollarSign, Users } from 'lucide-react';
import Picture from '@/components/ui/display/Picture';
import { BaseItem, StatInfo } from './types';
import { getImageUrl } from '@/utils/getImageUrl';
import Button from '@/components/ui/buttons/Button';
import LoadingSpinner from '@/components/ui/display/LoadingSpinner';
import { getExperienceTypeDetails } from '@/features/admin/experiences/experienceUtils';
import { fileToWebp } from '@/utils/fileToWebp';

interface ExperiencePackageEditCardProps<T extends BaseItem> {
    item: T;
    onSave: (data: Partial<T> | FormData) => void;
    onCancel: () => void;
    editFields: {
        name?: boolean;
        email?: boolean;
        phone?: boolean;
        image?: boolean;
        location?: boolean;
        type?: boolean;
        name_experience?: boolean;
        price?: boolean;
        duration?: boolean;
        capacity?: boolean;
        description?: boolean;
    };
    stats?: StatInfo[];
    entity: 'experiences' | 'packages';
    loading?: boolean;
    children?: React.ReactNode;
}

export function ExperiencePackageEditCard<T extends BaseItem>({
    item,
    onSave,
    onCancel,
    editFields,
    entity,
    loading = false,
    children,
    stats
}: ExperiencePackageEditCardProps<T>) {
    const [formData, setFormData] = useState<Partial<T>>(item);
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const { Icon: TypeIcon } = getExperienceTypeDetails(item.type as string);


    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setPreviewImage(imageUrl);
            setImageFile(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const modifiedFields: Partial<T> = {};
        Object.keys(editFields).forEach(key => {
            const typedKey = key as keyof T;
            if (formData[typedKey] !== item[typedKey]) {
                modifiedFields[typedKey] = formData[typedKey];
            }
        });

        if (imageFile) {
            const submitData = new FormData();

            Object.entries(modifiedFields).forEach(([key, value]) => {
                if (value !== undefined) {
                    submitData.append(key, String(value));
                }
            });

            const webpFile = await fileToWebp(imageFile);
            submitData.append('file', webpFile);

            onSave(submitData);
        } else if (Object.keys(modifiedFields).length > 0) {
            onSave(modifiedFields as T);
        }
    };

    React.useEffect(() => {
        return () => {
            if (previewImage) {
                URL.revokeObjectURL(previewImage);
            }
        };
    }, [previewImage]);

    return (
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 animate-fade-in-up p-6 b">
            {loading && (
                <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50 rounded-2xl">
                    <LoadingSpinner message="Guardando..." />
                </div>
            )}

            {/* Imagen principal */}
            {editFields.image && (
                <div className="mb-6">
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                        id="image-input"
                    />
                    <label
                        htmlFor="image-input"
                        className="cursor-pointer block"
                    >
                        <div className="relative w-full h-48 rounded-xl overflow-hidden bg-gray-100">
                            {previewImage || getImageUrl(item.image) ? (
                                <Picture
                                    src={previewImage || getImageUrl(item.image) || ''}
                                    alt={formData.name as string}
                                    className="w-full h-full object-cover hover:opacity-90 transition-opacity"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    <span className="text-gray-600 text-sm">No hay imagen</span>
                                </div>
                            )}
                            <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                                <span className="text-white font-medium">
                                    {previewImage || getImageUrl(item.image) ? 'Cambiar imagen' : 'Agregar imagen'}
                                </span>
                            </div>
                        </div>
                    </label>
                </div>
            )}

            {/* Nombre */}
            <div>
                <h3 className="font-bold text-gray-800 text-xl mb-2">
                    <input
                        type="text"
                        name="name"
                        value={formData.name || ''}
                        onChange={handleInputChange}
                        className="w-full bg-transparent border-b border-gray-300 focus:border-primary outline-none"
                        placeholder={`Ingrese el nombre de la ${entity === 'experiences' ? 'experiencia' : 'paquete'}`}
                    />
                </h3>
            </div>

            {/* Campos específicos según el tipo de entidad */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {entity === 'packages' && (
                    <>
                        {editFields.price && (
                            <div className="flex items-center gap-2 text-gray-600">
                                <DollarSign className="w-5 h-5 flex-shrink-0" />
                                <input
                                    type="number"
                                    name="price"
                                    value={formData.price || ''}
                                    onChange={handleInputChange}
                                    className="w-full bg-transparent border-b border-gray-300 focus:border-primary outline-none"
                                    placeholder="Ingrese precio"
                                />
                            </div>
                        )}
                        {editFields.capacity && (
                            <div className="flex items-center gap-2 text-gray-600">
                                <Users className="w-5 h-5 flex-shrink-0" />
                                <input
                                    type="number"
                                    name="capacity"
                                    value={formData.capacity || ''}
                                    onChange={handleInputChange}
                                    className="w-full bg-transparent border-b border-gray-300 focus:border-primary outline-none"
                                    placeholder="Ingrese Cantidad de personas"
                                />
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Descripción */}
            {editFields.description && (
                <div>
                    <textarea
                        name="description"
                        value={formData.description || ''}
                        onChange={handleInputChange}
                        className="w-full bg-transparent border border-gray-300 rounded-lg p-3 focus:border-primary outline-none"
                        placeholder="Ingrese descripción"
                        rows={4}
                    />
                </div>
            )}

            {stats && stats.length > 0 && (
                <div className={`grid gap-3 mb-6 ${stats.length === 1 ? 'grid-cols-1' : stats.length === 2 ? 'grid-cols-2' : stats.length === 3 ? 'grid-cols-3' : stats.length === 4 ? 'grid-cols-2' : 'grid-cols-2'}`}>
                    {editFields.type && (
                        <div className="text-center p-3 rounded-lg bg-green-50">
                            <TypeIcon className="w-5 h-5 mx-auto mb-1 text-green-600" />

                            <div className="relative w-full">
                                <select
                                    name="type"
                                    value={formData.type || ''}
                                    onChange={handleInputChange}
                                    className={`
                                        w-full appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2
                                        text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary
                                        text-sm shadow-sm transition-all
                                    `}
                                >
                                    <option value="">Seleccione un tipo</option>
                                    <option value="Café">Café</option>
                                    <option value="Hostal">Hostal</option>
                                    <option value="Gastronomia">Gastronomía</option>
                                    <option value="Masajes">Masajes</option>
                                    <option value="Agroecológico">Agroecológico</option>
                                </select>

                                <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-500">
                                    <svg
                                        className="h-4 w-4"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        viewBox="0 0 24 24"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                            </div>
                            <p className="text-xs text-gray-600">Tipo de experiencia</p>
                        </div>
                    )}
                </div>
            )}

            {children}

            <div className="flex gap-2 mt-4">
                <Button
                    type="button"
                    onClick={onCancel}
                    variant="danger"
                >
                    Cancelar
                </Button>
                <Button
                    type="submit"
                    className='w-full'
                    variant='success'
                    disabled={loading}
                >
                    Guardar
                </Button>
            </div>
        </form>
    );
} 