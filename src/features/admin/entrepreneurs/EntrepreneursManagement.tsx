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

    const config = EntrepreneursConfig({
        data: entrepreneurs,
        CardComponent: (props) => (
            <EntrepreneurCard
                {...props}
            />
        ),
        actions: {
            onCreate: () => setShowCreateForm(true),
            onUpdate: () => {
                toast.success('Emprendedor actualizado');
            },
            onDelete: () => {
                toast.success('Emprendedor eliminado');
            },
            onChangeStatus: () => {
               
            }
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