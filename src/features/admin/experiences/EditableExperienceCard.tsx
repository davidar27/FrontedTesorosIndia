import React, { useState } from 'react';
import { ReusableCard } from '@/components/admin/Card';
import { Home, X, Check, House } from 'lucide-react';
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
        name_experience: item.name_experience,
        description: item.description,
        location: item.location,
        type: item.type,
        status: item.status,
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
            icon: House,
            value: (
                <input
                    type="text"
                    name="name_experience"
                    value={formData.name_experience || ''}
                    onChange={handleChange}
                    className="bg-transparent border-b border-gray-300 focus:border-primary outline-none  w-auto text-sm text-gray-600"
                    required
                    placeholder="Nombre de la experiencia"
                />
            ),
            label: 'Nombre de la experiencia'
        },
        // {
        //     icon: Phone,
        //     value: (
        //         <input
        //             type="tel"
        //             name="phone"
        //             value={formData.phone || ''}
        //             onChange={handleChange}
        //             className="bg-transparent border-b border-gray-300 focus:border-primary outline-nonen w-auto text-sm text-gray-600"
        //             required
        //             placeholder="Número de teléfono"
        //         />
        //     ),
        //     label: 'Teléfono'
        // }
    ];

    const stats = [
        {
            value: (
                <input
                    type="text"
                    name="name_experience"
                    value={formData.name_experience || ''}
                    onChange={handleChange}
                    className="bg-transparent border-b border-gray-300 focus:border-primary outline-none text-center w-auto text-lg font-bold text-green-600"
                    required
                    placeholder="Nombre de la experiencia"
                />
            ),
            label: 'Nombre de la experiencia',
            bgColor: 'bg-green-50',
            textColor: 'text-green-600',
            icon: Home
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
                        value={formData.name_experience || ''}
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

