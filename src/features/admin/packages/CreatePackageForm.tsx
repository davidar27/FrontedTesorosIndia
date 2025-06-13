import { useState } from 'react';
import { CreatePackageData } from './PackageTypes';
import Button from '@/components/ui/buttons/Button';

interface CreatePackageFormProps {
    onSubmit: (data: CreatePackageData) => void;
    onCancel: () => void;
    isLoading?: boolean;
}

export function CreatePackageForm({ onSubmit, onCancel, isLoading }: CreatePackageFormProps) {
    const [formData, setFormData] = useState<CreatePackageData>({
        name: '',
        price: 0,
        description: '',
        duration: 0,    
        capacity: 0,
    });

    const [errors, setErrors] = useState<Partial<CreatePackageData>>({});

    const validateForm = (): boolean => {
        const newErrors: Partial<CreatePackageData> = {};

        if (!formData.name.trim()) {
            newErrors.name = 'El nombre es requerido';
        }

        if (!formData.description.trim()) {
            newErrors.description = 'La descripción es requerida';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validateForm()) {
            onSubmit(formData);
        }
    };

    const handleChange = (field: keyof CreatePackageData) => (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        setFormData(prev => ({
            ...prev,
            [field]: e.target.value
        }));

        if (errors[field]) {
            setErrors(prev => ({
                ...prev,
                [field]: undefined
            }));
        }
    };

    return (
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-6">
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Crear Nuevo Paquete</h2>
                <p className="text-gray-600">Completa la información para registrar un nuevo paquete</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Nombre */}
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                            Nombre *
                        </label>
                        <input
                            type="text"
                            id="name"
                            value={formData.name}
                            onChange={handleChange('name')}
                            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.name ? 'border-red-300 bg-red-50' : 'border-gray-300'
                                }`}
                            placeholder="Ingresa el nombre"
                        />
                        {errors.name && (
                            <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                        )}
                    </div>

                </div>

                {/* Botones */}
                <div className="flex gap-4 pt-6 border-t">
                    <Button
                        type="button"
                        onClick={onCancel}
                        disabled={isLoading}
                        className='flex-1  rounded-md hover:!text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center border border-red-500'
                        variant='danger'
                    >
                        Cancelar
                    </Button>
                    <Button
                        type="submit"
                        disabled={isLoading}
                        variant='success'
                    >
                        {isLoading ? (
                            <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                Creando...
                            </>
                        ) : (
                                'Crear Paquete'
                        )}
                    </Button>
                </div>
            </form>
        </div>
    );
}