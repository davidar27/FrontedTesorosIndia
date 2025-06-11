/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import Button from '@/components/ui/buttons/Button';
import { ReusableCard } from '@/components/admin/Card';

interface FieldConfig {
    name: string;
    label: string;
    type: string;
    required?: boolean;
    placeholder?: string;
}

interface EditableCardFormProps<T> {
    item: T;
    fields: FieldConfig[];
    onSave: (id: number, data: Partial<T> | FormData) => void;
    onCancel: () => void;
    isLoading?: boolean;
    imageField?: string;
    avatarFallback?: React.ReactNode;
    contactInfo?: any[];
    stats?: any[];
}

export function EditableCardForm<T extends { id?: number }>(props: EditableCardFormProps<T>) {
    const { item, fields, onSave, onCancel, isLoading, imageField, contactInfo = [], stats = [] } = props;
    const [formData, setFormData] = useState<Partial<T>>(item);
    const [imagePreview, setImagePreview] = useState<string | undefined>(undefined);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, files } = e.target;
        if (type === 'file' && files && files[0]) {
            setFormData(prev => ({ ...prev, [name]: files[0] as any }));
            setImagePreview(URL.createObjectURL(files[0]));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (imageField && formData[imageField as keyof typeof formData]) {
            const fd = new FormData();
            fd.append('id', String(item.id));
            fields.forEach(f => {
                if (formData[f.name as keyof typeof formData] !== undefined) {
                    fd.append(f.name, formData[f.name as keyof typeof formData] as any);
                }
            });
            fd.append(imageField, formData[imageField as keyof typeof formData] as any);
            onSave(item.id ?? 0, fd);
        } else {
            onSave(item.id ?? 0, formData);
        }
    };

    // Prepara el objeto para el ReusableCard
    const cardItem = {
        ...item,
        id: item.id ?? 0,
        image: imageField ? (imagePreview || (item as any)[imageField] || undefined) : undefined,
        name: (formData as any).name || (item as any).name || '',
        status: (item as any).status,
    };

    return (
        <form onSubmit={handleSubmit} className="text-center flex flex-col items-center shadow-xl border-1 border-gray-200 rounded-lg p-4 hover:shadow-2xl transition-all duration-300">
            <ReusableCard
                item={cardItem}
                contactInfo={contactInfo}
                stats={stats}
                showImage={!!imageField}
                showStatus={false}
                variant="compact"
                className="shadow-none py-0 border-none bg-transparent w-full hover:!shadow-none hover:border-none hover:bg-transparent"
            >
                {fields.map(f => (
                    <input
                        key={f.name}
                        type={f.type}
                        name={f.name}
                        value={formData[f.name as keyof typeof formData] as any || ''}
                        onChange={handleChange}
                        className="w-full text-xl font-bold text-gray-800 bg-transparent border-b border-gray-300 focus:border-primary outline-none px-1 mb-2"
                        required={f.required}
                        placeholder={f.placeholder || f.label}
                    />
                ))}

                <div className="flex gap-2 w-full mt-4">
                    <Button
                        type="button"
                        onClick={onCancel}
                        bgColor='bg-red-600'
                        textColor='text-white'
                        hoverBg='hover:bg-transparent'
                        hoverTextColor='hover:text-red-600'
                        borderColor='border-red-600'
                        hoverBorderColor='hover:border-red-600'
                        className="w-full flex items-center justify-center gap-2"
                    >
                        Cancelar
                    </Button>
                    <Button
                        type="submit"
                        className="bg-primary hover:bg-primary/80 text-white p-2 w-full flex items-center justify-center gap-2"
                        disabled={isLoading}
                    >
                        Guardar
                    </Button>
                </div>
            </ReusableCard>
        </form>
    );
}