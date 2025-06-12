import React, { useState } from 'react';
import { ReusableCard } from '@/components/admin/Card';
import { X, Check, MapPin, Bird } from 'lucide-react';
import Button from '@/components/ui/buttons/Button';
import { Experience } from './ExperienceTypes';
import { UpdateExperienceData } from './ExperienceTypes';

interface EditableExperienceCardProps {
    item: Experience;
    onSave: (id: number, data: UpdateExperienceData) => void;
    onCancel: () => void;
    isLoading?: boolean;
}

export function EditableExperienceCard({
    item,
    onSave,
    onCancel,
    isLoading
}: EditableExperienceCardProps) {
    const [formData, setFormData] = useState<UpdateExperienceData>({
        name: item.name,
        location: item.location,
        type: item.type,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };


    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(item.id ?? 0, formData);
    };

    const contactInfo = [
        {
            icon: MapPin,
            value: (
                <input
                    type="text"
                    name="location"
                    value={formData.location || ''}
                    onChange={handleChange}
                    className="bg-transparent border-b border-gray-300 focus:border-primary outline-none  w-auto text-sm text-gray-600"
                    required
                    placeholder="Ubicación de la experiencia"
                />
            ),
            label: 'Ubicación de la experiencia'
        }
    ];

    const stats = [
        {
            value: (
                <input
                    type="text"
                    name="type"
                    value={formData.type || ''}
                    onChange={handleChange}
                    className="bg-transparent border-b border-gray-300 focus:border-primary outline-none text-center w-auto text-lg font-bold text-green-600"
                    required
                    placeholder="Tipo de experiencia"
                />
            ),
            label: 'Tipo de experiencia',
            bgColor: 'bg-green-50',
            textColor: 'text-green-600',
            icon: Bird
        }
    ];
    return (
        <form onSubmit={handleSubmit} className="text-center flex flex-col items-center shadow-xl border-1 border-gray-200 rounded-lg p-4 hover:shadow-2xl transition-all duration-300">

            <ReusableCard
                item={{
                    id: item.id || 0,
                    name: '',
                    status: item.status,
                    image: undefined,
                }}
                contactInfo={contactInfo}
                stats={stats}
                showImage={false}
                showStatus={false}
                variant="compact"
                className="shadow-none py-0 border-none bg-transparent  w-full hover:!shadow-none hover:border-none hover:bg-transparent"
            >
                <div className="">
                    <input
                        type="text"
                        name="name"
                        value={formData.name || ''}
                        onChange={handleChange}
                        className="w-full text-xl font-bold text-gray-800 bg-transparent border-b border-gray-300 focus:border-primary outline-none px-1"
                        required
                        placeholder="Nombre de la experiencia"
                    />
                </div>
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
                        <X className="w-4 h-4" />
                        Cancelar
                    </Button>
                    <Button
                        type="submit"
                        className="bg-primary hover:bg-primary/80 text-white p-2 w-full flex items-center justify-center gap-2"
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

