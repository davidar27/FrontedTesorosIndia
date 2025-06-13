import { useState } from 'react';
import { ViewCard } from '@/components/admin/ReusableCard/ViewCard';
import { EditCard } from '@/components/admin/ReusableCard/EditCard';
import { Phone, Mail, Calendar, Home, Edit, Check, X } from 'lucide-react';
import { Entrepreneur } from '@/features/admin/entrepreneurs/EntrepreneursTypes';
import { useEntrepreneursManagement } from '@/services/admin/useEntrepreneursManagement';
import { formatDate, normalizeEntrepreneurStatus } from '../adminHelpers';
import React from 'react';
import type { ActionButton } from '@/components/admin/ReusableCard/types';

interface EntrepreneurCardProps {
    item: Entrepreneur;
    onUpdate: (item: Entrepreneur) => void;
    onChangeStatus?: (id: number, status: string) => void;
}

export const EntrepreneurCard = React.memo(function EntrepreneurCard({
    item,
    onUpdate,
    onChangeStatus,
}: EntrepreneurCardProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { updateAsync } = useEntrepreneursManagement();

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleCancel = () => {
        setIsEditing(false);
    };

    const handleSave = async (updatedItem: Partial<Entrepreneur>) => {
        if (!updatedItem.id) return;
        
        setIsLoading(true);
        try {
            const result = await updateAsync(updatedItem as Entrepreneur);
            onUpdate({ ...updatedItem, image: result.image } as Entrepreneur);
            setIsEditing(false);
        } catch (error) {
            console.error('Error updating entrepreneur:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleChangeStatus = () => {
        const normalizedStatus = normalizeEntrepreneurStatus(item.status);
        const newStatus = normalizedStatus === 'inactive' ? 'active' : 'inactive';
        onChangeStatus?.(item.id ?? 0, newStatus);
    };

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

    const normalizedStatus = normalizeEntrepreneurStatus(item.status);
    const actions: ActionButton[] = [
        {
            icon: Edit,
            label: 'Editar',
            onClick: handleEditClick,
            variant: 'primary'
        }
    ];

    if (onChangeStatus) {
        if (normalizedStatus === 'active') {
            actions.push({
                icon: X,
                label: 'Desactivar',
                onClick: handleChangeStatus,
                variant: 'danger'
            });
        } else {
            actions.push({
                icon: Check,
                label: 'Activar',
                onClick: handleChangeStatus,
                variant: 'success'
            });
        }
    }

    if (isEditing) {
        return (
            <EditCard
                item={item}
                onSave={handleSave}
                onCancel={handleCancel}
                editFields={{
                    name: true,
                    email: true,
                    phone: true,
                    name_experience: true,
                    image: true
                }}
                contactInfo={contactInfo}
                stats={stats}
                loading={isLoading}
                title="Emprendedor"
            />
        );
    }

    return (
        <ViewCard

            item={item}
            contactInfo={contactInfo}
            showStatus={true}
            stats={stats}
            actions={actions}
            onChangeStatus={onChangeStatus}
            loading={isLoading}
            title="Emprendedor"
            variant="default"
        />
    );
});
