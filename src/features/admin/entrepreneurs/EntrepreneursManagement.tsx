import { useState, useMemo, useCallback } from 'react';
import { toast } from 'sonner';
import GenericManagement from '@/components/admin/GenericManagent';
import { EntrepreneurCard } from '@/features/admin/entrepreneurs/EntrepreneursCard';
import { CreateEntrepreneurForm } from '@/features/admin/entrepreneurs/CreateEntrepreneurForm';
import { EntrepreneursConfig } from '@/features/admin/entrepreneurs/EntrepreneursConfig';
import { Entrepreneur, CreateEntrepreneurData, UpdateEntrepreneurData, EntrepreneurStatus } from '@/features/admin/entrepreneurs/EntrepreneursTypes';
import { useEntrepreneursManagement } from '@/services/admin/useEntrepreneursManagement';

type EntrepreneurWithForm = Entrepreneur | {
    id: -1;
    isForm: true;
    name: string;
    status: EntrepreneurStatus;
    email: string;
    phone: string;
    image: string | null;
    name_experience: string;
    joinDate: string;
};

export default function EntrepreneursManagement() {
    const [showCreateForm, setShowCreateForm] = useState(false);
    const {
        items,
        create,
        isCreating,
        changeStatus,
        updateAsync
    } = useEntrepreneursManagement();

    const handleCreateSubmit = useCallback(
        (data: CreateEntrepreneurData) => {
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
    }, [create, setShowCreateForm]);

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
        const itemsWithForm: EntrepreneurWithForm[] = showCreateForm 
            ? [{
                id: -1,
                isForm: true,
                name: '',
                status: 'active' as EntrepreneurStatus,
                email: '',
                phone: '',
                name_experience: '',
                joinDate: new Date().toISOString(),
                image: null
            }, ...entrepreneurs]
            : entrepreneurs;

        return EntrepreneursConfig({
            data: itemsWithForm,
            CardComponent: (props) => {
                if ('isForm' in props.item) {
                    return (
                        <div className="animate-fade-in-up">
                            <CreateEntrepreneurForm
                                onSubmit={handleCreateSubmit}
                                onCancel={() => setShowCreateForm(false)}
                                isLoading={isCreating}
                            />
                        </div>
                    );
                }
                return <EntrepreneurCard {...props} />;
            },
            actions: {
                onCreate: () => setShowCreateForm(true),
                onUpdate: (item) => {
                    if (!('isForm' in item)) {
                        handleUpdate(item.id ?? 0, item as unknown as UpdateEntrepreneurData);
                    }
                },
                onDelete: () => { },
                onChangeStatus: (id, status) => {
                    if (id !== -1) {
                        handleChangeStatus(id, status);
                    }
                }
            }
        });
    }, [items, showCreateForm, isCreating, handleUpdate, handleChangeStatus, handleCreateSubmit]);

    return (
        <GenericManagement<EntrepreneurWithForm> config={config} />
    );
}