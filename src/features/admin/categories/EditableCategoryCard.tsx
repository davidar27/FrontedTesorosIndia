/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { ReusableCard } from '@/components/admin/Card';
import { X, Check, Edit } from 'lucide-react';
import Button from '@/components/ui/buttons/Button';
import { Category, UpdateCategoryData } from './CategoriesTypes';

interface EditableCategoryCardProps {
    item: Category;
    onSave: (id: number, data: UpdateCategoryData) => void;
    onCancel: () => void;
    isLoading?: boolean;
}

export function EditableCategoryCard({
    item,
    onSave,
    onCancel,
    isLoading
}: EditableCategoryCardProps) {
    const [formData, setFormData] = useState<UpdateCategoryData>({
        name: item.name,
    });


    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };



    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const changedFields: Partial<UpdateCategoryData> = {};
        if (formData.name !== item.name) changedFields.name = formData.name;


        if (Object.keys(changedFields).length === 0) {
            const fd = new FormData();
            fd.append('id', String(item.id));
            Object.entries(changedFields).forEach(([key, value]) => {
                if (value !== undefined) fd.append(key, value as string);
            });
            for (const pair of fd.entries()) {
                console.log('DEBUG - FormData:', pair[0], pair[1]);
            }
            onSave(item.id ?? 0, fd as any);
        } else {
            console.log('DEBUG - Sending changedFields:', changedFields);
            onSave(item.id ?? 0, changedFields as UpdateCategoryData);
        }
    };

    const contactInfo = [
        {
            icon: Edit,
            value: (
                <input
                    type="text"
                    name="name"
                    value={formData.name || ''}
                    onChange={handleChange}
                    className="bg-transparent border-b border-gray-300 focus:border-primary outline-none  w-auto text-lg  text-gray-600"
                    required
                    placeholder="Nombre de la categoría"
                />
            ),
            label: 'Nombre de la categoría',
            
        }

    ];



    return (
        <form onSubmit={handleSubmit} className="text-center flex flex-col items-center shadow-xl border-1 border-gray-200 rounded-lg p-4 hover:shadow-2xl transition-all duration-300">

            <ReusableCard
                item={{
                    id: item.id || 0,
                    name: formData.name || item.name,
                    status: item.status,
                    image: undefined,

                }}
                contactInfo={contactInfo}
                stats={[]}
                showImage={false}
                showStatus={false}
                variant="compact"
                className="shadow-none py-0 border-none bg-transparent  w-full hover:!shadow-none hover:border-none hover:bg-transparent"
            >
                
                <div className="flex gap-2 w-full mt-4">
                    <Button
                        type="button"
                        onClick={onCancel}
                        bgColor='bg-transparent'
                        textColor='text-red-600'
                        hoverBg='hover:bg-red-600'
                        hoverTextColor='hover:text-white'
                        borderColor='border-red-600'
                        hoverBorderColor='hover:border-red-600'
                        className="w-full flex items-center justify-center gap-2"
                    >
                        <X className="w-4 h-4" />
                        Cancelar
                    </Button>
                    <Button
                        type="submit"
                        bgColor='bg-transparent'
                        textColor='text-primary'
                        hoverBg='hover:bg-primary'
                        hoverTextColor='hover:text-white'
                        borderColor='border-primary'
                        hoverBorderColor='hover:border-primary'
                        className="w-full flex items-center justify-center gap-2"
                        disabled={isLoading}
                    >
                        <Check className="w-4 h-4" />
                        Guardar
                    </Button>
                </div>
            </ReusableCard>
        </form>
    );
}

