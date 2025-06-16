import { useMemo, useCallback } from 'react';
import { toast } from 'sonner';
import GenericManagement from '@/components/admin/GenericManagent';
import { usePackagesManagement } from '@/services/admin/usePackagesManagement';
import { PackagesCard } from './PackagesCard';
import { PackagesConfig } from '@/features/admin/packages/PackagesConfig';
import { Package } from './PackageTypes';
import { UpdatePackageData } from './PackageTypes';

export default function PackagesManagement() {
    const {
        items,
        changeStatus,
        updateAsync
    } = usePackagesManagement();

    const handleUpdate = useCallback(
        async (id: number, data: UpdatePackageData) => {
            updateAsync({ id, ...data }, {
                onSuccess: () => {
                    toast.success('Paquete actualizado exitosamente');
                },
                onError: (err) => {
                    toast.error(err.message);
                }
            });
        },
        [updateAsync]
    );

    const handleChangeStatus = useCallback(
        (id: number, status: string) => {
            changeStatus({
                id,
                status,
                entityType: 'package'
            }, {
                onSuccess: () => {
                    toast.success('Estado actualizado exitosamente');
                },
                onError: (err) => {
                    toast.error(err.message);
                }
            });
        }, [changeStatus]);

    const config = useMemo(() => {
        const packages = Array.isArray(items) ? items : [];

        return PackagesConfig({
            data: packages,
            CardComponent: PackagesCard,
            actions: {
                onUpdate: (item) => {
                    handleUpdate(item.id ?? 0, item as unknown as UpdatePackageData);
                },
                onChangeStatus: (id, status) => {
                    handleChangeStatus(id, status);
                }
            }
        });
    }, [items, handleUpdate, handleChangeStatus]);

    return (
        <GenericManagement<Package> config={config} />
    );
}