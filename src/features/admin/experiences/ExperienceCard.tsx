import { useState } from 'react';
import { ReusableCard } from '@/components/admin/Card';
import { Calendar, Home, User, MapPin } from 'lucide-react';
import { useEntrepreneursManagement } from '@/services/admin/useEntrepreneursManagement';
import { formatDate, normalizeStatus, getImageUrl } from '@/features/admin/entrepreneurs/entrepreneurHelpers';
import { toast } from 'react-hot-toast';
import React from 'react';
import { Experience, UpdateExperienceData } from './ExperienceTypes';
import { EditableExperienceCard } from '@/features/admin/experiences/EditableExperienceCard';

interface ExperienceCardProps {
    item: Experience;
    onUpdate: (item: Experience) => void;
    onDelete?: (id: number) => void;
}

export const ExperienceCard = React.memo(function ExperienceCard({
    item,
    onUpdate,
    onDelete,
}: ExperienceCardProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { update, changeStatus } = useEntrepreneursManagement();

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
    };

    const handleSave = (id: number, data: UpdateExperienceData) => {
        setIsEditing(false);
        setIsLoading(true);

        const changedFields: Partial<UpdateExperienceData> = {};
        if (data.name_experience && data.name_experience !== item.name_experience) changedFields.name_experience = data.name_experience;
        if (data.description && data.description !== item.description) changedFields.description = data.description;
        if (data.location && data.location !== item.location) changedFields.location = data.location;
        if (data.type && data.type !== item.type) changedFields.type = data.type;

        if (Object.keys(changedFields).length === 0) {
            toast.error('No realizaste ningún cambio.');
            setIsLoading(false);
            return;
        }

        update(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            { id, ...changedFields } as any,
            {
                onSuccess: () => {
                    onUpdate({
                        ...item,
                        ...changedFields,
                    });
                },
                onError: () => {
                    setIsLoading(false);
                }
            }
        );
    };

    const handleChangeStatus = () => {
        const normalizedStatus = normalizeStatus(item.status);
        const newStatus = normalizedStatus === 'active' ? 'inactive' : 'active';
        changeStatus(item.id ?? 0, newStatus);
    };

    if (isEditing) {
        return (
            <EditableExperienceCard
                item={item}
                onSave={handleSave}
                onCancel={handleCancelEdit}
                isLoading={isLoading}
            />
        );
    }

    const contactInfo = [
        {
            icon: User,
            value: item.name_entrepreneur || '',
            label: 'Nombre del emprendedor',
            copyable: true
        },
        {
            icon: MapPin,
            value: item.location || '',
            label: 'Ubicación',
            copyable: true
        }
    ];

    const stats = [
            {
                value: formatDate(item.created_at),
                label: 'Fecha de registro',
                bgColor: 'bg-blue-50',
                textColor: 'text-blue-600',
                icon: Calendar
            },
        {
            value: item.type,
            label: 'Tipo de experiencia',
            bgColor: 'bg-green-50',
            textColor: 'text-green-600',
            icon: Home
        }
    ];


    return (
        <ReusableCard
            item={{
                ...item,
                status: normalizeStatus(item.status),
                id: item.id ?? 0,
                name: item.name_experience,
                image: getImageUrl(item.image) || '',
                description: `Experiencia creada el ${formatDate(item.created_at)}`
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
