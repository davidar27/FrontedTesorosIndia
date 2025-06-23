import { useMemo, useCallback } from 'react';
import { toast } from 'sonner';
import GenericManagement from '@/components/admin/GenericManagent';
import { useExperiencesManagement } from '@/services/admin/useExperiencesManagement';
import { ExperienceCard } from './ExperienceCard';
import { ExperiencesConfig } from '@/features/admin/experiences/ExperienceConfig';
import { Experience } from './ExperienceTypes';
import { UpdateExperienceData } from './ExperienceTypes';

export default function ExperiencesManagement() {
    const {
        items,
        changeStatus,
        updateAsync
    } = useExperiencesManagement();

    const handleUpdate = useCallback(
        async (id: string, data: UpdateExperienceData) => {
            updateAsync({ id, ...data }, {
                onSuccess: () => {
                    toast.success('Experiencia actualizada exitosamente');
                },
                onError: (err) => {
                    toast.error(err.message);
                }
            });
        },
        [updateAsync]
    );

    const handleChangeStatus = useCallback(
        (id: string, status: string) => {
            changeStatus({
                id,
                status,
                entityType: 'experience'
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
        const experiences = Array.isArray(items) ? items : [];

        return ExperiencesConfig({
            data: experiences,
            CardComponent: ExperienceCard,
            actions: {
                onUpdate: (item) => {
                    handleUpdate(item.id ?? 0, item as unknown as UpdateExperienceData);
                },
                onChangeStatus: (id, status) => {
                    handleChangeStatus(id, status);
                }
            }
        });
    }, [items, handleUpdate, handleChangeStatus]);

    return (
        <GenericManagement<Experience> config={config} />
    );
}