import { useState } from 'react';
import { ReusableCard } from '@/components/admin/Card';
import { Phone, Mail, Calendar, Home } from 'lucide-react';
import { Entrepreneur, UpdateEntrepreneurData } from '@/features/admin/entrepreneurs/EntrepreneursTypes';
import { useEntrepreneursManagement } from '@/services/admin/useEntrepreneursManagement';
import { formatDate, normalizeEntrepreneurStatus, getImageUrl } from '../adminHelpers';
import React from 'react';
import { EditableEntrepreneurCard } from './EditableEntrepreneurCard';

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
    const { updateAsync } = useEntrepreneursManagement();

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
    };

    const handleSave = async (id: number, data: UpdateEntrepreneurData | FormData) => {
        setIsEditing(false);
        setIsLoading(true);

        try {
            let result;
            if (data instanceof FormData) {
                result = await updateAsync(data);
            } else {
                result = await updateAsync({ id, ...data });
            }
            onUpdate({ ...item, ...data, image: result.image } as unknown as Entrepreneur);
            setIsLoading(false);
        } catch (error) {
            console.error('Error updating entrepreneur:', error);
            setIsLoading(false);
        }
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
        },
        {
            value: formatDate(item.joinDate),
            label: 'Fecha de registro',
            bgColor: 'bg-blue-50',
            textColor: 'text-blue-600',
            icon: Calendar
        },
    ];

    const stats = [
        
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
            onUpdate={handleEditClick}
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
