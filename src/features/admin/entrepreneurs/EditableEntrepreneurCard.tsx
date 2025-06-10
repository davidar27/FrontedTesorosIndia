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
    const [imageError, setImageError] = useState(false);
    const [retryCount, setRetryCount] = useState(0);
    const [loadingImage, setLoadingImage] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            try {
                const webpFile = await fileToWebp(file);
                const previewUrl = URL.createObjectURL(webpFile);
                setImagePreview(previewUrl);
                setFormData(prev => ({ ...prev, image: webpFile }));
                return () => URL.revokeObjectURL(previewUrl);
            } catch  {
                alert('No se pudo convertir la imagen a webp');
            }
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(item.id ?? 0, formData);
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
            <div className=" flex flex-col items-center mb-6">
                <div className="relative">
                    {loadingImage ? (
                        <div className="w-24 h-24 flex items-center justify-center">
                            <span className="loader" />
                        </div>
                    ) : imageError || !item.image ? (
                        <Avatar name={item.name} size={96} />
                    ) : (
                        <img
                            src={imagePreview ? imagePreview : getImageUrl(item.image) || ''}
                            alt={item.name || 'Avatar'}
                            className="w-24 h-24 rounded-full object-cover"
                            onError={() => {
                                if (retryCount < 3) {
                                    setLoadingImage(true);
                                    setTimeout(() => {
                                        setRetryCount(c => c + 1);
                                        setLoadingImage(false);
                                    }, 1500);
                                } else {
                                    setImageError(true);
                                }
                            }}
                            onLoad={() => {
                                setLoadingImage(false);
                                setImageError(false);
                                setRetryCount(0);
                            }}
                            key={retryCount}
                        />
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

