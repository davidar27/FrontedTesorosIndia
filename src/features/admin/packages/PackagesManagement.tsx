import GenericManagement from '@/components/admin/GenericManagent';
import { createPackagesConfig } from '@/features/admin/packages/createPackagesConfig';
import PackageCard from '@/features/admin/packages/PackagesCard';
import { useMemo } from 'react';
import { Package } from './PackageTypes';



const packages: Package[] = [
    {
        id: 1,
        name: "Paquete Premium",
        price: 45000,
        description: "Café especial de alta calidad con notas frutales",
        category: "Premium",
        status: "active",
        duration: "1 mes",
        capacity: "10 Personas"
    },
    // ... más paquetes
];

function PackagesManagement() {
    const handleEdit = (pkg: Package) => {
        console.log('Editing package:', pkg);
    };

    const handleDelete = (packageId: number) => {
        console.log('Deleting package:', packageId);
    };

   

    const handleCreate = () => {
        console.log('Creating new package');
    };

    const config = useMemo(() => createPackagesConfig(
        packages,
        PackageCard,
        {
            onEdit: handleEdit,
            onDelete: handleDelete,
            onCreate: handleCreate
        }
    ), []);


    return <GenericManagement config={config} />;

}
export default PackagesManagement;
