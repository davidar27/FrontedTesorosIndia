import { useState } from 'react';
import { toast } from 'sonner';
import GenericManagement from '@/components/admin/GenericManagent';
import { EntrepreneurCard } from '@/features/admin/entrepreneurs/EntrepreneursCard';
import { CreateEntrepreneurForm } from '@/features/admin/entrepreneurs/CreateEntrepreneurForm';
import { EntrepreneursConfig } from '@/features/admin/entrepreneurs/EntrepreneursConfig';
import { Entrepreneur, CreateEntrepreneurData } from '@/features/admin/entrepreneurs/EntrepreneursTypes';
import { useEntrepreneursManagement } from '@/services/admin/useEntrepreneursManagement';

export default function EntrepreneursManagement() {
    const [showCreateForm, setShowCreateForm] = useState(false);
    const {
        items,
        create,
        isCreating,
        changeStatus
    } = useEntrepreneursManagement();

    const entrepreneurs = Array.isArray(items) ? items : [];

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

    const handleChangeStatus = (id: number, status: string) => {
        toast.promise(
            new Promise((resolve, reject) => {
                changeStatus({
                    id,
                    status,
                    entityType: 'entrepreneur'
                }, {
                    onSuccess: resolve,
                    onError: reject
                });
            }),
            {
                loading: 'Cambiando estado...',
                success: 'Estado actualizado exitosamente',
                error: (err) => err.message
            }
        );
    };

    const config = EntrepreneursConfig({
        data: entrepreneurs,
        CardComponent: (props) => (
            <EntrepreneurCard
                {...props}
            />
        ),
        actions: {
            onCreate: () => setShowCreateForm(true),
            onUpdate: () => {},
            onDelete: () => {},
            onChangeStatus: handleChangeStatus
        }
    });

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