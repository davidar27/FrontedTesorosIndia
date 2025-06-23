/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { Edit, X, Check, Calendar, Users } from 'lucide-react';
import { Package } from '@/features/admin/packages/PackageTypes';
import { usePackagesManagement } from '@/services/admin/usePackagesManagement';
import { normalizeStatus } from '../adminHelpers';
import React from 'react';
import type { ActionButton } from '@/components/admin/ReusableCard/types';
import ConfirmDialog from '@/components/ui/feedback/ConfirmDialog';
import { ExperiencePackageEditCard } from '@/components/admin/ReusableCard/ExperiencePackageEditCard';
import { ExperiencePackageViewCard } from '@/components/admin/ReusableCard/ExperiencePackageViewCard';

interface PackagesCardProps {
    item: Package;
    onUpdate: (item: Package) => void;
    onChangeStatus?: (id: number, status: string) => void;
}

export const PackagesCard = React.memo(function PackagesCard({
    item,
    onUpdate,
    onChangeStatus,
}: PackagesCardProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [confirmAction, setConfirmAction] = useState<string | null>(null);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const { updateAsync } = usePackagesManagement();


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

    const handleSave = async (data: Partial<Package> | FormData) => {
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
        const action = normalized === 'inactive' ? 'activate' : 'disable';
        setConfirmAction(action);
        setConfirmOpen(true);
    };

    const handleConfirm = () => {
        if (!confirmAction) return;

        const newStatus = normalized === 'inactive' ? 'active' : 'inactive';
        onChangeStatus?.(item.id ?? 0, newStatus);
        setConfirmOpen(false);
        setConfirmAction(null);
    };


    const stats = [
        { value: `${item.duration}H`, label: 'Duración', bgColor: 'bg-blue-50', textColor: 'text-blue-600', icon: Calendar },
        { value: item.capacity, label: 'Capacidad (personas)', bgColor: 'bg-purple-50', textColor: 'text-purple-600', icon: Users },

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
    if (onChangeStatus) {
        if (normalized === 'active') {
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
        if (!item.id) return null;
        return (
            <ExperiencePackageEditCard
                item={{ ...item, id: item.id }}
                onSave={handleSave}
                onCancel={handleCancel}
                editFields={{
                    name: true,
                    description: true,
                    price: true,
                    duration: true,
                    capacity: true,
                }}
                entity="packages"
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
                entity="packages"
                loading={isLoading}
                title="Paquete"
                stats={stats}
                actions={actions}
            />
            <ConfirmDialog
                open={confirmOpen}
                onConfirm={handleConfirm}
                onCancel={() => setConfirmOpen(false)}
                title={
                    confirmAction === 'activate'
                        ? '¿Activar Paquete?'
                        : '¿Desactivar Paquete?'
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
