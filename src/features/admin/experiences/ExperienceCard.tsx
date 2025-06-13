import { useState } from 'react';
import { ReusableCard } from '@/components/admin/ReusableCard';
import { Calendar, User, MapPin, Bird } from 'lucide-react';
import { useExperiencesManagement } from '@/features/admin/experiences/useExperiencesManagement';
import { formatDate } from '@/features/admin/adminHelpers';
import { toast } from 'react-hot-toast';
import React from 'react';
import { Experience, UpdateExperienceData } from './ExperienceTypes';
import { EditableExperienceCard } from '@/features/admin/experiences/EditableExperienceCard';
import { normalizeExperienceStatus } from '@/features/admin/adminHelpers';

interface ExperienceCardProps {
    item: Experience;
    onUpdate: (item: Experience) => void;
}

export const ExperienceCard = React.memo(function ExperienceCard({
    item,
    onUpdate,
}: ExperienceCardProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { update, changeStatus } = useExperiencesManagement();

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
        if (data.name && data.name !== item.name) changedFields.name = data.name;
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
                    setIsLoading(false);
                },
                onError: () => {
                    setIsLoading(false);
                }
            }
        );
    };

    const handleChangeStatus = () => {
        const normalizedStatus = normalizeExperienceStatus(item.status);
        const getNewStatus = (currentStatus: string) => {
            switch (currentStatus) {
                case 'published':
                    return 'draft';
                case 'draft':
                    return 'published';
                case 'inactive':
                    return 'published';
                default:
                    return 'published';
            }
        };

        const newStatus = getNewStatus(normalizedStatus);
        changeStatus({
            id: item.id ?? 0,
            status: newStatus,
            entityType: 'experience'
        });
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
            value: item.type,
            label: 'Tipo de experiencia',
            bgColor: 'bg-green-50',
            textColor: 'text-green-600',
            icon: Bird
        }
    ];

    return (
        <ReusableCard
            item={{
                ...item,
                status: normalizeExperienceStatus(item.status),
                id: item.id ?? 0,
                name: item.name,
                description: `Experiencia registrada el ${formatDate(item.joinDate)}`
            }}
            contactInfo={contactInfo}
            stats={stats}
            onUpdate={handleEditClick}
            onChangeStatus={handleChangeStatus}
            showImage={false}
            showStatus={true}
            variant="default"
            title='Experiencia'
            loading={isLoading}
        />
    );
});
