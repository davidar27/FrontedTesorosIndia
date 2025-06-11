import { useState, useMemo, useCallback } from 'react';
import { toast } from 'sonner';
import GenericManagement from '@/components/admin/GenericManagent';
import { EntrepreneurCard } from '@/features/admin/entrepreneurs/EntrepreneursCard';
import { CreateEntrepreneurForm } from '@/features/admin/entrepreneurs/CreateEntrepreneurForm';
import { EntrepreneursConfig } from '@/features/admin/entrepreneurs/EntrepreneursConfig';
import { Entrepreneur, CreateEntrepreneurData, UpdateEntrepreneurData } from '@/features/admin/entrepreneurs/EntrepreneursTypes';
import { useEntrepreneursManagement } from '@/services/admin/useEntrepreneursManagement';

export default function EntrepreneursManagement() {
    const [showCreateForm, setShowCreateForm] = useState(false);
    const {
        items,
        create,
        isCreating,
        changeStatus,
        updateAsync
    } = useEntrepreneursManagement();

    const handleCreateSubmit = (data: CreateEntrepreneurData) => {
        toast.promise(
            new Promise((resolve, reject) => {
                create(data as unknown as Entrepreneur, {
                    onSuccess: () => {
                        resolve(true);
                        setShowCreateForm(false);
                    },
                    onError: reject
                });
            }),
            {
                loading: 'Creando emprendedor...',
                success: 'Emprendedor creado exitosamente',
                error: (err) => err.message
            }
        );
    };

    const handleUpdate = useCallback(
        async (id: number, data: UpdateEntrepreneurData) => {
            updateAsync({ id, ...data }, {
                onSuccess: () => {
                    toast.success('Emprendedor actualizado exitosamente');
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
            entityType: 'entrepreneur'
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
        const entrepreneurs = Array.isArray(items) ? items : [];
        return EntrepreneursConfig({
            data: entrepreneurs,
            CardComponent: (props) => (
                <EntrepreneurCard {...props} />
            ),
            actions: {
                onCreate: () => setShowCreateForm(true),
                onUpdate: (item) => handleUpdate(item.id ?? 0, item as unknown as UpdateEntrepreneurData),
                onDelete: () => { },
                onChangeStatus: handleChangeStatus
            }
        });
    }, [items, handleUpdate, handleChangeStatus]);

    return (
        <>
            {showCreateForm ? (
                <CreateEntrepreneurForm
                    onSubmit={handleCreateSubmit}
                    onCancel={() => setShowCreateForm(false)}
                    isLoading={isCreating}
                />
            ) : (
                <GenericManagement<Entrepreneur> config={config} />
            )}
        </>
    );
}