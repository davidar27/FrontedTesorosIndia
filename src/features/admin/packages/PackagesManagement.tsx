import { useState, useMemo, useCallback } from 'react';
import { toast } from 'sonner';
import GenericManagement from '@/components/admin/GenericManagent';
import { usePackagesManagement } from '@/services/admin/usePackagesManagement';
import { PackagesCard } from './PackagesCard';
import { PackagesConfig } from '@/features/admin/packages/PackagesConfig';
import { Package, CreatePackageData, PackageStatus } from './PackageTypes';
import { UpdatePackageData } from './PackageTypes';
import CreatePackageForm from './createPackageForm';
import { fileToWebp } from '@/utils/fileToWebp';

type PackageWithForm = Package | {
    id: -1;
    isForm: true;
    name: string;
    status: PackageStatus;
    unavailableDates: string[];
    selectedDetails: number[];
    selectedExperiences: number[];
    image: string;
    pricePerPerson: number;
    description: string;
    duration: number;
    capacity: number;
    joinDate: string;
};

export default function PackagesManagement() {
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const {
        items,
        changeStatus,
        updateAsync,
        createAsync
    } = usePackagesManagement();

    const handleCreateSubmit = useCallback(async (data: CreatePackageData, file: File | null) => {
        setIsCreating(true);
        try {
            if (file) {
                const webpFile = await fileToWebp(file);
                
                const formData = new FormData();
                formData.append('name', data.title);
                formData.append('description', data.description);
                formData.append('duration', data.duration.toString());
                formData.append('capacity', data.capacity.toString());
                formData.append('pricePerPerson', data.pricePerPerson.toString());
                formData.append('unavailableDates', JSON.stringify(data.unavailableDates));
                formData.append('selectedDetails', JSON.stringify(data.selectedDetails));
                formData.append('selectedExperiences', JSON.stringify(data.selectedExperiences));
                formData.append('file', webpFile);
                
                await createAsync(formData, {
                    onSuccess: () => {
                        toast.success('Paquete creado exitosamente');
                        setShowCreateForm(false);
                    },
                    onError: (err) => {
                        toast.error(err.message);
                    }
                });
            } else {
                // Use regular JSON for data without file
                const packageData = {
                    name: data.title,
                    description: data.description,
                    duration: data.duration,
                    capacity: data.capacity,
                    pricePerPerson: Number(data.pricePerPerson),
                    unavailableDates: data.unavailableDates,
                    selectedDetails: data.selectedDetails,
                    selectedExperiences: data.selectedExperiences,
                };
                
                await createAsync(packageData, {
                    onSuccess: () => {
                        toast.success('Paquete creado exitosamente');
                        setShowCreateForm(false);
                    },
                    onError: (err) => {
                        toast.error(err.message);
                    }
                });
            }
        } finally {
            setIsCreating(false);
        }
    }, [createAsync]);

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

    const itemsWithForm = useMemo(() => {
        const packages = Array.isArray(items) ? items : [];
        if (showCreateForm) {
            return [{
                id: -1,
                isForm: true,
                name: '',
                status: 'active' as PackageStatus,
                price: 0,
                description: '',
                duration: '',
                capacity: '',
                image: null,
                joinDate: new Date().toISOString()
            }, ...packages];
        }
        return packages;
    }, [items, showCreateForm]);

    const config = useMemo(() => {
        return PackagesConfig({
            data: itemsWithForm as Package[],
            CardComponent: (props) => {
                if ('isForm' in props.item) {
                    return (
                        <div className="animate-fade-in-up">
                            <CreatePackageForm
                                onSubmit={handleCreateSubmit}
                                onCancel={() => setShowCreateForm(false)}
                                isLoading={isCreating}
                            />
                        </div>
                    );
                }
                return <PackagesCard {...props} />;
            },
            actions: {
                onCreate: () => setShowCreateForm(true),
                onUpdate: (item) => {
                    if (!('isForm' in item)) {
                        handleUpdate(item.id ?? 0, item as unknown as UpdatePackageData);
                    }
                },
                onChangeStatus: (id, status) => {
                    if (id !== -1) {
                        handleChangeStatus(id, status);
                    }
                }
            }
        });
    }, [itemsWithForm, isCreating, handleUpdate, handleChangeStatus, handleCreateSubmit]);

    return showCreateForm ? (
        <div className="w-full">
            <CreatePackageForm
                onSubmit={handleCreateSubmit}
                onCancel={() => setShowCreateForm(false)}
                isLoading={isCreating}
            />
        </div>
    ) : (
        <GenericManagement<PackageWithForm> config={config} />
    );
}