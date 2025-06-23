/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { ViewCard } from '@/components/admin/ReusableCard/ViewCard';
import { EditCard } from '@/components/admin/ReusableCard/EditCard';
import { Phone, Mail, Calendar, Home, Edit, Check, X } from 'lucide-react';
import { Entrepreneur } from '@/features/admin/entrepreneurs/EntrepreneursTypes';
import { useEntrepreneursManagement } from '@/services/admin/useEntrepreneursManagement';
import { formatDate, normalizeStatus } from '../adminHelpers';
import React from 'react';
import type { ActionButton } from '@/components/admin/ReusableCard/types';
import ConfirmDialog from '@/components/ui/feedback/ConfirmDialog';

interface EntrepreneurCardProps {
    item: Entrepreneur;
    onUpdate: (item: Entrepreneur) => void;
    onChangeStatus?: (id: string, status: string) => void;
}

export const EntrepreneurCard = React.memo(function EntrepreneurCard({
    item,
    onUpdate,
    onChangeStatus,
}: EntrepreneurCardProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [confirmAction, setConfirmAction] = useState<'activate' | 'disable' | null>(null);
    const { updateAsync } = useEntrepreneursManagement();


    const normalizedStatus = normalizeStatus(item.status);


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

    const handleSave = async (data: Partial<Entrepreneur> | FormData) => {
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
    const handleChangeStatus = () => {
        
        const action = normalizedStatus === 'inactive' ? 'activate' : 'disable';
        setConfirmAction(action);
        setConfirmOpen(true);
    };

    const handleConfirm = () => {
        if (!confirmAction) return;

        const newStatus = normalizedStatus === 'inactive' ? 'active' : 'inactive';
        onChangeStatus?.(item.id ?? 0, newStatus);
        setConfirmOpen(false);
        setConfirmAction(null);
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
                    image: true,
                }}
                contactInfo={contactInfo}
                stats={stats}
                loading={isLoading}
                title="Emprendedor"
            />
        );
    }

    return (
        <>
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
            <ConfirmDialog
                open={confirmOpen}
                onConfirm={handleConfirm}
                onCancel={() => setConfirmOpen(false)}
                title={
                    confirmAction === 'activate'
                        ? '¿Activar Emprendedor?'
                        : '¿Desactivar Emprendedor?'
                }
                description={
                    confirmAction === 'activate'
                        ? `¿Deseas activar ${item.name}?`
                        : `¿Deseas desactivar ${item.name}?`
                }
                confirmText={
                    confirmAction === 'activate'
                        ? 'Activar'
                        : 'Desactivar'
                }
            />
        </>
    );
});
