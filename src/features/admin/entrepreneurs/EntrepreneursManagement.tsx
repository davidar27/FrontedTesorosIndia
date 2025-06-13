import { useState, useMemo, useCallback } from 'react';
import { toast } from 'sonner';
import GenericManagement from '@/components/admin/GenericManagent';
import { EntrepreneurCard } from '@/features/admin/entrepreneurs/EntrepreneursCard';
import { EntrepreneursConfig } from '@/features/admin/entrepreneurs/EntrepreneursConfig';
import { Entrepreneur, CreateEntrepreneurData, UpdateEntrepreneurData, EntrepreneurStatus } from '@/features/admin/entrepreneurs/EntrepreneursTypes';
import { useEntrepreneursManagement } from '@/services/admin/useEntrepreneursManagement';
import { CreateCard } from '@/components/admin/ReusableCard/CreateCard';

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
        (data: Partial<Entrepreneur>) => {
            const createData: CreateEntrepreneurData = {
                ...data as unknown as CreateEntrepreneurData,
            };
            
            toast.promise(
                new Promise((resolve, reject) => {
                    create(createData as unknown as Entrepreneur, {
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
                            <CreateCard
                                item={props.item}
                                onCreate={handleCreateSubmit}
                                onCancel={() => setShowCreateForm(false)}
                                loading={isCreating}
                                editFields={{
                                    name: true,
                                    email: true,
                                    phone: true,
                                    name_experience: true,
                                    image: true
                                }}
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