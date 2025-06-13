import React, { useState } from 'react';
import { ReusableCard } from '@/components/admin/ReusableCard';
import { Phone, Home, X, Check, Mail, UserIcon } from 'lucide-react';
import { CreateEntrepreneurData } from '@/features/admin/entrepreneurs/EntrepreneursTypes';
import Button from '@/components/ui/buttons/Button';

interface CreateEntrepreneurFormProps {
    onSubmit: (data: CreateEntrepreneurData) => void;
    onCancel: () => void;
    isLoading?: boolean;
}

export function CreateEntrepreneurForm({
    onSubmit,
    onCancel,
    isLoading
}: CreateEntrepreneurFormProps) {
    const [formData, setFormData] = useState<CreateEntrepreneurData>({
        name: '',
        email: '',
        phone: '',
        name_experience: '',
        password: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    const contactInfo = [
        {
            icon: Mail,
            value: (
                <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200"
                    required
                    placeholder="Correo electrónico"
                />
            ),
            label: 'Correo electrónico'
        },
        {
            icon: Phone,
            value: (
                <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200"
                    required
                    placeholder="Número de teléfono"
                />
            ),
            label: 'Teléfono'
        }
    ];

    const stats = [
        {
            value: (
                <input
                    type="text"
                    name="name_experience"
                    value={formData.name_experience}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200 text-center"
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
        <form onSubmit={handleSubmit} className="w-full flex flex-col bg-white p-4 rounded-lg shadow-md">
            <div className="space-y-4 w-full">
                    <div className="w-full flex items-center gap-2">
                        <UserIcon className="w-6 h-6" />
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200"
                            required
                            placeholder="Nombre del emprendedor"
                        />
                    </div>
                </div>

            <ReusableCard
                item={{
                    id: 0,
                    name: formData.name,
                    status: 'active',
                    image: undefined,
                }}
                contactInfo={contactInfo}
                stats={stats}
                showImage={false}
                showStatus={false}
                variant="compact"
                className="w-full bg-transparent shadow-none border-none !mt-0 !p-0 hover:!shadow-none"
            >
                

                <div className="flex gap-2 w-full mt-6">
                    <Button
                        type="button"
                        onClick={onCancel}
                        variant='danger'
                        className="w-full flex items-center justify-center gap-2"
                    >
                        <X className="w-4 h-4" />
                        Cancelar
                    </Button>
                    <Button
                        type="submit"
                            variant='success'
                        className="flex-1 flex items-center justify-center gap-2"
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
