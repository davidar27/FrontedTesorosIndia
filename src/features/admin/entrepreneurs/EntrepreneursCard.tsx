import { useState } from 'react';
import { ReusableCard } from '@/components/admin/Card';
import { Phone, Mail, Calendar, Home } from 'lucide-react';
import { Entrepreneur, UpdateEntrepreneurData } from '@/features/admin/entrepreneurs/EntrepreneursTypes';
import { EditableEntrepreneurCard } from './EditableEntrepreneurCard';
import { useEntrepreneursManagement } from '@/services/admin/useEntrepreneursManagement';
import { formatDate, normalizeEntrepreneurStatus, getImageUrl } from '../adminHelpers';
import { toast } from 'react-hot-toast';
import React from 'react';

interface EntrepreneurCardProps {
    item: Entrepreneur;
    onUpdate: (item: Entrepreneur) => void;
    onDelete?: (id: number) => void;
    onChangeStatus?: (id: number, status: string) => void;
}

export const EntrepreneurCard = React.memo(function EntrepreneurCard({
    item,
    onUpdate,
    onDelete,
    onChangeStatus,
}: EntrepreneurCardProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { update } = useEntrepreneursManagement();

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
    };

    const handleSave = (id: number, data: UpdateEntrepreneurData) => {
        console.log('handleSave called with:', { id, data });
        setIsEditing(false);
        setIsLoading(true);

        const changedFields: Partial<UpdateEntrepreneurData> = {};
        if (data.name && data.name !== item.name) changedFields.name = data.name;
        if (data.email && data.email !== item.email) changedFields.email = data.email;
        if (data.phone && data.phone !== item.phone) changedFields.phone = data.phone;
        if (data.name_experience && data.name_experience !== item.name_experience) changedFields.name_experience = data.name_experience;
        if (data.image) {
            console.log('Image data:', data.image);
            // Si es FormData, lo enviamos directamente
            if (data.image instanceof FormData) {
                console.log('Image is FormData');
                changedFields.image = data.image;
            } else {
                // Si es File, creamos un FormData
                console.log('Image is File, creating FormData');
                const formData = new FormData();
                formData.append('image', data.image);
                changedFields.image = formData;
            }
        }

        console.log('Changed fields:', changedFields);

        if (Object.keys(changedFields).length === 0) {
            toast.error('No realizaste ningún cambio.');
            setIsLoading(false);
            return;
        }

        update(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            { id, ...changedFields } as any,
            {
                onSuccess: (data) => {
                    console.log('Update successful:', data);
                    onUpdate({ 
                        ...item, 
                        ...changedFields,   
                        image: data.image
                    });
                    setIsLoading(false);
                },
                onError: (error) => {
                    console.error('Error updating entrepreneur:', error);
                    toast.error('Error al actualizar el emprendedor');
                    setIsLoading(false);
                }
            }
        );
    };

    const handleChangeStatus = () => {
        const normalizedStatus = normalizeEntrepreneurStatus(item.status);
        const newStatus = normalizedStatus === 'inactive' ? 'active' : 'inactive';
        onChangeStatus?.(item.id ?? 0, newStatus);
    };

    if (isEditing) {
        return (
            <EditableEntrepreneurCard
                item={item}
                onSave={handleSave}
                onCancel={handleCancelEdit}
                isLoading={isLoading}
            />
        );
    }

    const contactInfo = [
        {
            icon: Mail,
            value: item.email || '',
            label: 'Correo electrónico',
            copyable: true
        },
        {
            icon: Phone,
            value: item.phone || '',
            label: 'Teléfono',
            copyable: true
        }
    ];

    const stats = [
        {
            value: formatDate(item.joinDate),
            label: 'Fecha de registro',
            bgColor: 'bg-blue-50',
            textColor: 'text-blue-600',
            icon: Calendar
        },
        {
            value: item.name_experience,
            label: 'Nombre de la experiencia',
            bgColor: 'bg-green-50',
            textColor: 'text-green-600',
            icon: Home
        }
    ];


    return (
        <ReusableCard
            item={{
                ...item,
                status: normalizeEntrepreneurStatus(item.status),
                id: item.id ?? 0,
                name: item.name,
                image: getImageUrl(item.image) || '',
                description: `Emprendedor registrado el ${formatDate(item.joinDate)}`
            }}
            contactInfo={contactInfo}
            stats={stats}
            onEdit={handleEditClick}
            onChangeStatus={handleChangeStatus}
            onDelete={() => onDelete?.(item.id ?? 0)}
            showImage={true}
            showStatus={true}
            variant="default"
            title='Emprendedor'
            loading={isLoading}
            >
        </ReusableCard>
    );
});
