/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { ViewCard } from '@/components/admin/ReusableCard/ViewCard';
import { EditCard } from '@/components/admin/ReusableCard/EditCard';
import { Calendar, Home, Edit, User, MapPin } from 'lucide-react';
import { Experience } from '@/features/admin/experiences/ExperienceTypes';
import { useExperiencesManagement } from '@/services/admin/useExperiencesManagement';
import { formatDate, normalizeStatus } from '../adminHelpers';
import React from 'react';
import type { ActionButton } from '@/components/admin/ReusableCard/types';

interface ExperienceCardProps {
    item: Experience;
    onUpdate: (item: Experience) => void;
    onChangeStatus?: (id: number, status: string) => void;
}

export const ExperienceCard = React.memo(function ExperienceCard({
    item,
    onUpdate,
    onChangeStatus,
}: ExperienceCardProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { updateAsync } = useExperiencesManagement();


    const normalized = normalizeStatus(item.status);

    React.useEffect(() => {
        const event = new CustomEvent('cardEditingStateChange', {
            detail: { isEditing, itemId: item.id }
        });
        window.dispatchEvent(event);
    }, [isEditing, item.id]);

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleCancel = () => {
        setIsEditing(false);
    };

    const handleSave = async (data: Partial<Experience> | FormData) => {
        if (!item.id) return;

        setIsLoading(true);
        try {
            let result;
            if (data instanceof FormData) {
                data.append('id', String(item.id));
                result = await updateAsync(data);
            } else {
                result = await updateAsync({ ...data, id: item.id });
            }

            if (result && typeof result === 'object' && 'updatedFields' in result) {
                const updatedFields = result.updatedFields as Record<string, any>;
                onUpdate({ ...item, ...updatedFields });
            } else if (result && typeof result === 'object') {
                const responseData = result as Record<string, any>;
                onUpdate({ ...item, ...responseData });
            }
            setIsEditing(false);
        } catch (error) {
            console.error('Error updating entrepreneur:', error);
        } finally {
            setIsLoading(false);
        }
    };



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
            label: 'Fecha de la experiencia',
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
            icon: Home
        }
    ];

    console.log(normalized);
    const actions: ActionButton[] = [
        {
            icon: Edit,
            label: 'Editar',
            onClick: handleEditClick,
            variant: 'primary'
        }
    ];


    if (isEditing) {
        if (!item.id) return null;
        return (
            <EditCard
                item={{ ...item, id: item.id }}
                onSave={handleSave}
                onCancel={handleCancel}
                editFields={{
                    name: true,
                    location: true,
                    type: true,
                }}
                contactInfo={contactInfo}
                stats={stats}
                loading={isLoading}
                title="Experiencia"
            />
        );
    }

    return (
        <>
            <ViewCard
                item={{ ...item, id: item.id ?? 0 }}
                contactInfo={contactInfo}
                showStatus={true}
                stats={stats}
                actions={actions}
                onChangeStatus={onChangeStatus}
                loading={isLoading}
                title="Experiencia"
                variant="default"
            />
            
        </>
    );
});
