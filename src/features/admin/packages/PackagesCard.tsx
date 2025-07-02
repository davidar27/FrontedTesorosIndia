import { useState } from 'react';
import { Edit, X, Check, Calendar, Users, Eye } from 'lucide-react';
import { Package } from '@/features/admin/packages/PackageTypes';
import { normalizeStatus } from '../adminHelpers';
import React from 'react';
import type { ActionButton } from '@/components/admin/ReusableCard/types';
import ConfirmDialog from '@/components/ui/feedback/ConfirmDialog';
import { ExperiencePackageViewCard } from '@/components/admin/ReusableCard/ExperiencePackageViewCard';
interface PackagesCardProps {
    item: Package;
    onUpdate: (item: Package) => void;
    onChangeStatus?: (id: number, status: string) => void;
    onView?: (item: Package) => void;
}

export const PackagesCard = React.memo(function PackagesCard({
    item,
    onUpdate,
    onChangeStatus,
    onView
}: PackagesCardProps) {
    const [isLoading,] = useState(false);
    const [confirmAction, setConfirmAction] = useState<string | null>(null);
    const [confirmOpen, setConfirmOpen] = useState(false);


    const normalized = normalizeStatus(item.status);



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
        { value: item.capacity, label: 'Cantidad (personas)', bgColor: 'bg-purple-50', textColor: 'text-purple-600', icon: Users },
    ];
    const actions: ActionButton[] = [
        {
            icon: Eye,
            label: 'Ver',
            onClick: () => { onView?.(item); },
            variant: 'success'
        },
        {
            icon: Edit,
            label: 'Editar',
            onClick: () => onUpdate(item),
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

    return (
        <>
            <ExperiencePackageViewCard
                item={{ ...item, id: item.id ?? 0 } as unknown as Package & { type: string }}
                onUpdate={onUpdate}
                onChangeStatus={onChangeStatus}
                onView={onView}
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
