import React, { useState } from 'react';
import { Mail, Phone, Home } from 'lucide-react';
import Picture from '@/components/ui/display/Picture';
import Avatar from '@/components/ui/display/Avatar';
import { BaseItem, EditCardProps } from './types';
import { getImageUrl } from '@/features/admin/adminHelpers';
import Button from '@/components/ui/buttons/Button';

const CARD_VARIANTS = {
    default: 'p-6',
    compact: 'p-4',
    detailed: 'p-8',
};

export function EditCard<T extends BaseItem>({
    item,
    onSave,
    onCancel,
    editFields,
    contactInfo = [],
    stats = [],
    showImage = true,
    className = "",
    variant = 'default',
    loading = false,
    children
}: EditCardProps<T>) {
    const [formData, setFormData] = useState<Partial<T>>(item);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const formData = new FormData();
            formData.append('image', file);
            setFormData(prev => ({ ...prev, image: formData }));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData as unknown as T);
    };

    const cardClasses = `
        bg-white rounded-2xl shadow-lg border border-gray-100 
        hover:shadow-xl transition-all duration-300 group animate-fade-in-up 
        ${CARD_VARIANTS[variant]}
        ${loading ? 'opacity-60 pointer-events-none' : ''}
        ${className}
    `.trim();

    return (
        <form onSubmit={handleSubmit} className={cardClasses}>
            <div className="relative flex items-start justify-between mb-4">
                <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-800 group-hover:text-primary transition-colors duration-200 truncate whitespace-normal text-xl">
                        <input
                            type="text"
                            name="name"
                            value={formData.name || ''}
                            onChange={handleInputChange}
                            className="w-full bg-transparent border-b border-gray-300 focus:border-primary outline-none"
                            placeholder="Ingrese nombre"
                        />
                    </h3>
                </div>
                {showImage && (
                    <div className="ml-4 flex-shrink-0">
                        {editFields.image ? (
                            <div className="relative">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="hidden"
                                    id="image-input"
                                />
                                <label 
                                    htmlFor="image-input" 
                                    className="cursor-pointer"
                                >
                                    <Picture
                                        src={item.image || ''}
                                        alt={formData.name as string}
                                        className="rounded-full object-cover w-12 h-12 hover:opacity-80 transition-opacity"
                                    />
                                </label>
                            </div>
                        ) : item.image && item.image !== null ? (
                            <Picture
                                src={getImageUrl(item.image)}
                                alt={formData.name as string}
                                className="rounded-full object-cover w-12 h-12"
                            />
                        ) : (
                            <Avatar
                                name={formData.name as string}
                                size={48}
                            />
                        )}
                    </div>
                )}
            </div>

            {contactInfo.length > 0 && (
                <div className="space-y-2 mb-4 flex gap-2 flex-wrap flex-col w-full">
                    {editFields.email && (
                        <div className="flex items-center gap-2 text-gray-600">
                            <Mail className="w-4 h-4 flex-shrink-0" />
                            <input
                                type="email"
                                name="email"
                                value={formData.email || ''}
                                onChange={handleInputChange}
                                className="w-full bg-transparent border-b border-gray-300 focus:border-primary outline-none"
                                placeholder="Ingrese email"
                            />
                        </div>
                    )}
                    {editFields.phone && (
                        <div className="flex items-center gap-2 text-gray-600">
                            <Phone className="w-4 h-4 flex-shrink-0" />
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone || ''}
                                onChange={handleInputChange}
                                className="w-full bg-transparent border-b border-gray-300 focus:border-primary outline-none"
                                placeholder="Ingrese teléfono"
                            />
                        </div>
                    )}
                </div>
            )}

            {stats.length > 0 && (
                <div className={`grid gap-3 mb-6 ${stats.length === 1 ? 'grid-cols-1' : stats.length === 2 ? 'grid-cols-2' : stats.length === 3 ? 'grid-cols-3' : stats.length === 4 ? 'grid-cols-2' : 'grid-cols-2'}`}>
                    {editFields.name_experience && (
                        <div className="text-center p-3 rounded-lg bg-green-50">
                            <Home className="w-5 h-5 mx-auto mb-1 text-green-600" />
                            <input
                                type="text"
                                name="name_experience"
                                value={formData.name_experience || ''}
                                onChange={handleInputChange}
                                className="w-full bg-transparent border-b border-gray-300 focus:border-primary outline-none text-center"
                                placeholder="Ingrese nombre de experiencia"
                            />
                            <p className="text-xs text-gray-600">Nombre de la experiencia</p>
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
                    className="flex-1 px-4 py-2 text-white bg-primary rounded-lg hover:bg-primary/80"
                    disabled={loading}
                >
                    Guardar
                </Button>
            </div>
        </form>
    );
} 