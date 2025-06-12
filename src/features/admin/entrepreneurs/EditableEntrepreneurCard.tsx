/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { ReusableCard } from '@/components/admin/Card';
import { Phone, Home, X, Check, Mail } from 'lucide-react';
import { Entrepreneur, UpdateEntrepreneurData } from '@/features/admin/entrepreneurs/EntrepreneursTypes';
import Button from '@/components/ui/buttons/Button';
import Avatar from '@/components/ui/display/Avatar';
import { fileToWebp } from '@/utils/imageToWebp';
import { getImageUrl } from '@/features/admin/adminHelpers';

interface EditableEntrepreneurCardProps {
    item: Entrepreneur;
    onSave: (id: number, data: UpdateEntrepreneurData) => void;
    onCancel: () => void;
    isLoading?: boolean;
}

export function EditableEntrepreneurCard({
    item,
    onSave,
    onCancel,
    isLoading
}: EditableEntrepreneurCardProps) {
    const [formData, setFormData] = useState<UpdateEntrepreneurData>({
        name: item.name,
        email: item.email,
        phone: item.phone,
        name_experience: item.name_experience,
    });
    const [imagePreview, setImagePreview] = useState<string | undefined>(undefined);
    const [loadingImage,] = useState(false);
    const [, setImageError] = useState(false);

    React.useEffect(() => {
        return () => {
            if (imagePreview) {
                URL.revokeObjectURL(imagePreview);
            }
        };
    }, [imagePreview]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (imagePreview) {
                URL.revokeObjectURL(imagePreview);
            }
            const previewUrl = URL.createObjectURL(file);
            setImagePreview(previewUrl);
            try {
                const webpFile = await fileToWebp(file);
                setFormData(prev => ({ ...prev, image: webpFile }));
            } catch {
                setFormData(prev => ({ ...prev, image: file }));
            }
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const changedFields: Partial<UpdateEntrepreneurData> = {};
        if (formData.name !== item.name) changedFields.name = formData.name;
        if (formData.email !== item.email) changedFields.email = formData.email;
        if (formData.phone !== item.phone) changedFields.phone = formData.phone;
        if (formData.name_experience !== item.name_experience) changedFields.name_experience = formData.name_experience;

        let hasImage = false;
        let imageFile: File | undefined;
        if (formData.image && formData.image instanceof File) {
            hasImage = true;
            imageFile = formData.image;
        }

        console.log('DEBUG - handleSubmit called');
        console.log('DEBUG - changedFields:', changedFields);
        console.log('DEBUG - hasImage:', hasImage, 'imageFile:', imageFile);

        if (Object.keys(changedFields).length === 0 && !hasImage) {
            console.log('DEBUG - No changes detected');
            return;
        }

        if (hasImage) {
            const fd = new FormData();
            fd.append('id', String(item.id));
            if (imageFile) fd.append('file', imageFile);
            Object.entries(changedFields).forEach(([key, value]) => {
                if (value !== undefined) fd.append(key, value as string);
            });
            for (const pair of fd.entries()) {
                console.log('DEBUG - FormData:', pair[0], pair[1]);
            }
            onSave(item.id ?? 0, fd as any);
        } else {
            console.log('DEBUG - Sending changedFields:', changedFields);
            onSave(item.id ?? 0, changedFields as UpdateEntrepreneurData);
        }
    };

    const contactInfo = [
        {
            icon: Mail,
            value: (
                <input
                    type="email"
                    name="email"
                    value={formData.email || ''}
                    onChange={handleChange}
                    className="bg-transparent border-b border-gray-300 focus:border-primary outline-none  w-auto text-sm text-gray-600"
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
                    value={formData.phone || ''}
                    onChange={handleChange}
                    className="bg-transparent border-b border-gray-300 focus:border-primary outline-nonen w-auto text-sm text-gray-600"
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
                    value={formData.name_experience || ''}
                    onChange={handleChange}
                    className="bg-transparent border-b border-gray-300 focus:border-primary outline-none text-center w-auto text-sm font-bold text-green-600"
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
            <div className="flex flex-col items-center mb-6">
                <div className="relative">
                    {loadingImage ? (
                        <div className="w-24 h-24 flex items-center justify-center">
                            <span className="loader" />
                        </div>
                    ) : imagePreview ? (
                        <img
                            src={imagePreview}
                            alt={item.name || 'Avatar'}
                            className="w-24 h-24 rounded-full object-cover"
                            onError={() => setImageError(true)}
                        />
                    ) : item.image ? (
                        <img
                            src={getImageUrl(item.image) || ''}
                            alt={item.name || 'Avatar'}
                            className="w-24 h-24 rounded-full object-cover"
                            onError={() => setImageError(true)}
                        />
                    ) : (
                        <Avatar name={item.name} size={96} />
                    )}
                    <input
                        type="file"
                        name="image"
                        onChange={handleImageChange}
                        accept="image/*"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        title="Cambiar imagen"
                    />
                </div>
                <span className="text-xs text-gray-500 mt-2">Click para cambiar imagen</span>
            </div>

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
                        placeholder="Nombre del emprendedor"
                    />
                </div>
                <div className="flex gap-2 w-full mt-4">
                    <Button
                        type="button"
                        onClick={onCancel}
                        bgColor='bg-transparent'
                        textColor='text-red-600'
                        hoverBg='hover:bg-red-600'
                        hoverTextColor='hover:text-white'
                        borderColor='border-red-600'
                        hoverBorderColor='hover:border-red-700'
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
