/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { Experience } from '@/features/admin/experiences/ExperienceTypes';
import { useExperiencesManagement } from '@/services/admin/useExperiencesManagement';
import React from 'react';
import type { ActionButton } from '@/components/admin/ReusableCard/types';
import { ExperiencePackageEditCard } from '@/components/admin/ReusableCard/ExperiencePackageEditCard';
import { ExperiencePackageViewCard } from '@/components/admin/ReusableCard/ExperiencePackageViewCard';
import { Edit } from 'lucide-react';
import { getExperienceTypeDetails } from './experienceUtils';

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

    const { Icon: TypeIcon } = getExperienceTypeDetails(item.type);

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

    const stats = [
        {
            value: item.type,
            label: 'Tipo de experiencia',
            bgColor: 'bg-green-50',
            textColor: 'text-green-600',
            icon: TypeIcon  
        }
    ];

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
            <ExperiencePackageEditCard
                item={{ ...item, id: item.id }}
                onSave={handleSave}
                onCancel={handleCancel}
                editFields={{
                    name: true,
                    image: true,
                    type: true,
                }}
                stats={stats}
                entity="experiences"
                loading={isLoading}
            />
        );
    }

    return (
        <>
            <ExperiencePackageViewCard
                item={{ ...item, id: item.id ?? 0 }}
                onUpdate={onUpdate}
                onChangeStatus={onChangeStatus}
                entity="experiences"
                loading={isLoading}
                title="Experiencia"
                stats={stats}
                actions={actions}
            />
        </>
    );
});
