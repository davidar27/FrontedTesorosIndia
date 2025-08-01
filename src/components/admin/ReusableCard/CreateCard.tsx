import React, { useState } from 'react';
import { Mail, Phone, Home, Lock } from 'lucide-react';
import { BaseItem, CreateCardProps } from './types';

const CARD_VARIANTS = {
    default: 'p-6',
    compact: 'p-4',
    detailed: 'p-8',
};

export function CreateCard<T extends BaseItem>({
    item,
    onCreate,
    onCancel,
    editFields,
    className = "",
    variant = 'default',
    loading = false,
    entityName,
    children
}: CreateCardProps<T>) {
    const [formData, setFormData] = useState<Partial<T>>(item);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onCreate(formData as unknown as T);
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
                    <h3 className="font-bold text-gray-800 group-hover:text-primary transition-colors duration-200 truncate whitespace-normal text-md">
                        <input
                            type="text"
                            name="name"
                            value={formData.name || ''}
                            onChange={handleInputChange}
                            className="w-full bg-transparent border-b border-gray-300 focus:border-primary outline-none"
                            placeholder={`Ingrese el nombre del ${entityName}`}
                            required
                        />
                    </h3>
                </div>
            </div>

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
                            placeholder="Ingrese el correo electrónico"
                            required
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
                            className="w-full  bg-transparent border-b border-gray-300 focus:border-primary outline-none"
                            placeholder="Ingrese el teléfono"
                            required
                        />
                    </div>
                )}
                {editFields.password && (
                    <div className="flex items-center gap-2 text-gray-600">
                        <Lock className="w-4 h-4 flex-shrink-0" />
                        <input
                            type="password"
                            name="password"
                            value={formData.password || ''}
                            onChange={handleInputChange}
                            className="w-full bg-transparent border-b border-gray-300 focus:border-primary outline-none"
                            placeholder="Ingrese la contraseña"
                            required
                        />
                    </div>
                )}

            </div>
            {editFields.name_experience && (
            <div className="flex items-center flex-col gap-2 text-primary bg-green-50 p-2">
                <Home className="w-4 h-4 flex-shrink-0" />
                <input
                    type="text"
                    name="name_experience"
                    value={formData.name_experience || ''}
                    onChange={handleInputChange}
                    className="w-full  text-center bg-transparent border-b border-gray-300 focus:border-primary outline-none"
                    placeholder="Ingrese nombre de experiencia"
                    required
                    />
                </div>
            )}

            {children}

            <div className="flex gap-2 mt-4">
                <button
                    type="button"
                    onClick={onCancel}
                    className="flex-1 px-4 py-2 text-red-600 border border-red-600 rounded-lg hover:bg-red-50"
                >
                    Cancelar
                </button>
                <button
                    type="submit"
                    className="flex-1 px-4 py-2 text-white bg-primary rounded-lg hover:bg-primary/80"
                    disabled={loading}
                >
                    Crear
                </button>
            </div>
        </form>
    );
} 