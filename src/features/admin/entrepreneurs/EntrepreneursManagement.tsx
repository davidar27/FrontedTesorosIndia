import { useState } from 'react';
import { toast } from 'sonner';
import GenericManagement from '@/components/admin/GenericManagent';
import { EntrepreneurCard } from '@/features/admin/entrepreneurs/EntrepreneursCard';
import { CreateEntrepreneurForm } from '@/features/admin/entrepreneurs/CreateEntrepreneurForm';
import { EntrepreneursConfig } from '@/features/admin/entrepreneurs/EntrepreneursConfig';
import { Entrepreneur, CreateEntrepreneurData } from '@/features/admin/entrepreneurs/EntrepreneursTypes';
import { useGenericManagement } from '@/hooks/useGenericManagement';

export default function EntrepreneursManagement() {
    const [showCreateForm, setShowCreateForm] = useState(false);
    const {
        items: entrepreneurs,
        isLoading = false,
        error,
        create,
        update,
        delete: deleteItem,
        isCreating,
        // isUpdating,
        // isDeleting
    } = useGenericManagement<Entrepreneur>('entrepreneurs', '/dashboard/emprendedores');

    const handleCreateSubmit = (data: CreateEntrepreneurData) => {
        toast.promise(
            new Promise((resolve, reject) => {
                create(data as unknown as Entrepreneur, {
                    onSuccess: resolve,
                    onError: reject
                });
            }),
            {
                loading: 'Creando emprendedor...',
                success: 'Emprendedor creado exitosamente',
                error: (err) => err.message
            }
        ).then(() => setShowCreateForm(false));
    };

    const config = EntrepreneursConfig({
        data: entrepreneurs,
        CardComponent: (props) => (
            <EntrepreneurCard
                {...props}
                onEdit={(id, updatedFields) => update({ id, ...updatedFields } as Entrepreneur)}
                onDelete={deleteItem}
                onActivate={() => {}}
                onDisable={() => {}}
            />
        ),
        actions: {
            onCreate: () => setShowCreateForm(true),
            onEdit: (item) => update(item),
            onDelete: deleteItem
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
                <GenericManagement<Entrepreneur>
                    config={config}
                    isLoading={ isLoading}
                    error={error as string | null}
                />
            )}
        </>
    );
}