import { useState, useMemo, useCallback } from 'react';
import { toast } from 'sonner';
import GenericManagement from '@/components/admin/GenericManagent';
import { usePackagesManagement } from '@/services/admin/usePackagesManagement';
import { PackagesConfig } from './PackagesConfig';
import { Package, CreatePackageData, UpdatePackageData } from './PackageTypes';
import { CreatePackageForm } from './CreatePackageForm';
import PackageCard from './PackagesCard';
    
export default function PackagesManagement() {
    const [showCreateForm, setShowCreateForm] = useState(false);
    const { 
        items,
        create,
        isCreating,
        changeStatus,
        updateAsync
    } = usePackagesManagement();

    const handleCreateSubmit = (data: CreatePackageData) => {
        toast.promise(
            new Promise((resolve, reject) => {
                create(data as unknown as Package, {
                    onSuccess: () => {
                        resolve(true);
                        setShowCreateForm(false);
                    },
                    onError: reject
                });
            }),
            {
                loading: 'Creando paquete...',
                success: 'Paquete creado exitosamente',
                error: (err) => err.message
            }
        );
    };

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
        const categories = Array.isArray(items) ? items : [];
        return PackagesConfig({
            data: categories as unknown as Package[],
            CardComponent: (props) => (
                <PackageCard {...props} />
            ),
            actions: {
                onCreate: () => setShowCreateForm(true),
                onUpdate: (item) => handleUpdate(item.id ?? 0, item as unknown as UpdatePackageData),
                onChangeStatus: handleChangeStatus
            }
        });
    }, [items, handleUpdate, handleChangeStatus]);

    return (
        <>
            {showCreateForm ? (
                <CreatePackageForm
                    onSubmit={handleCreateSubmit}
                    onCancel={() => setShowCreateForm(false)}
                    isLoading={isCreating}
                />
            ) : (
                <GenericManagement<Package> config={config} />
            )}
        </>
    );
}