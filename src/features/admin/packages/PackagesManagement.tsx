import { useState, useMemo, useCallback, useEffect } from 'react';
import { toast } from 'sonner';
import GenericManagement from '@/components/admin/GenericManagent';
import { usePackagesManagement } from '@/services/admin/usePackagesManagement';
import { PackagesCard } from './PackagesCard';
import { PackagesConfig } from '@/features/admin/packages/PackagesConfig';
import { Package, CreatePackageData, PackageStatus } from './PackageTypes';
import { UpdatePackageData } from './PackageTypes';
import CreatePackageForm from '@/features/admin/packages/CreatePackageForm';
import { fileToWebp } from '@/utils/fileToWebp';
import EditPackageForm from '@/features/admin/packages/EditPackageForm';
import ViewPackageInfo from '@/features/admin/packages/ViewPackageInfo';
import { ExperiencesApi } from '@/services/home/experiences';
import { Experience } from '@/features/packages/types/packagesTypes';
// Defino la interfaz localmente
interface DashboardDetails {
    detail_id: number;
    description: string;
}

type PackageWithForm = Package | {
    id: -1;
    isForm: true;
    name: string;
    status: PackageStatus;
    unavailableDates: string[];
    selectedDetails: number[];
    selectedExperiences: number[];
    image: string;
    price: number;
    pricePerPerson: number;
    description: string;
    duration: number;
    capacity: number;
    joinDate: string;
};

export default function PackagesManagement() {
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const [editingPackage, setEditingPackage] = useState<Package | null>(null);
    const [isUpdating, setIsUpdating] = useState(false);
    const [viewPackage, setViewPackage] = useState<Package | null>(null);
    const [isViewing, setIsViewing] = useState(false);
    const [experiences, setExperiences] = useState<Experience[]>([]);
    const [details, setDetails] = useState<DashboardDetails[]>([]);
    const {
        items,
        changeStatus,
        updateAsync,
        createAsync,
        getDashboardDetails
    } = usePackagesManagement();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [experiencesData, detailsData] = await Promise.all([
                    ExperiencesApi.getExperiences(),
                    getDashboardDetails()
                ]);
                setExperiences(experiencesData as unknown as Experience[]);
                setDetails(detailsData as DashboardDetails[]);
            } catch (error) {
                console.error('Error al cargar experiencias o detalles:', error);
            }
        };
        fetchData();
    }, [getDashboardDetails]);

    const handleCreateSubmit = useCallback(async (data: CreatePackageData, file: File | null) => {
        setIsCreating(true);
        try {
            if (file) {
                const webpFile = await fileToWebp(file);

                const formData = new FormData();
                formData.append('name', data.name);
                formData.append('description', data.description);
                formData.append('duration', data.duration.toString());
                formData.append('capacity', data.capacity.toString());
                formData.append('price', data.price?.toString() || '');
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
                    name: data.name,
                    description: data.description,
                    duration: data.duration,
                    capacity: data.capacity,
                    price: Number(data.price),
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
        (data: UpdatePackageData) => {
            setIsUpdating(true);
            try {
                updateAsync(data, {
                    onSuccess: () => {
                        toast.success('Paquete actualizado exitosamente');
                        setEditingPackage(null);
                    },
                    onError: (err) => {
                        toast.error(err.message);
                    }
                });
            } finally {
                setIsUpdating(false);
            }
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

    const handleView = useCallback((item: Package) => {
        // Normaliza unavailableDates si es string
        let unavailableDates = item.unavailableDates;
        if (typeof unavailableDates === 'string') {
            try {
                unavailableDates = JSON.parse(unavailableDates);
            } catch {
                unavailableDates = [];
            }
        }
        setViewPackage({ ...item, unavailableDates });
        setIsViewing(true);
    }, []);

    const itemsWithForm = useMemo(() => {
        const packages = Array.isArray(items) ? items : [];
        if (showCreateForm) {
            return [{
                id: -1,
                isForm: true,
                name: '',
                status: 'active' as PackageStatus,
                price: 0,
                pricePerPerson: 0,
                description: '',
                duration: '',
                capacity: '',
                image: null,
                joinDate: new Date().toISOString(),
                unavailableDates: [],
                selectedDetails: [],
                selectedExperiences: [],
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
                        setEditingPackage(item as Package);
                    }
                },
                onChangeStatus: (id, status) => {
                    if (id !== -1) {
                        handleChangeStatus(id, status);
                    }
                },
                onView: handleView
            }
        });
    }, [itemsWithForm, isCreating, handleChangeStatus, handleCreateSubmit, handleView]);

    return (
        <>
            {showCreateForm ? (
                <div className="w-full">
                    <CreatePackageForm
                        onSubmit={handleCreateSubmit}
                        onCancel={() => setShowCreateForm(false)}
                        isLoading={isCreating}
                    />
                </div>
            ) : isViewing && viewPackage ? (
                <div className="w-full">
                    <button
                        className="mb-4 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                        onClick={() => setIsViewing(false)}
                    >
                        Volver a la lista
                    </button>
                    <ViewPackageInfo
                        packageData={viewPackage}
                        experiences={experiences.filter(e =>
                            viewPackage.selectedExperiences.includes(e.experience_id)
                        )}
                        details={details}
                    />
                </div>
            ) : editingPackage ? (
                <div className="w-full">
                    <EditPackageForm
                        initialData={editingPackage as unknown as Partial<UpdatePackageData> & { image: string | File }}
                        onSave={handleUpdate}
                        onCancel={() => setEditingPackage(null)}
                        isLoading={isUpdating}
                    />
                </div>
            ) : (
                <GenericManagement<PackageWithForm> config={config} />
            )}
        </>
    );
}
