import GenericManagement, { defaultSidebarItems, BaseEntity } from '@/components/admin/GenericManagent';
import { PackageCard } from '@/components/admin/packages/PackagesCard';
import { createPackagesConfig } from '@/components/admin/packages/createPackagesConfig';

export interface Package extends BaseEntity {
    price: number;
    description: string;
    category: string;
    weight: string;
}

const packages: Package[] = [
    {
        id: 1,
        name: "Paquete Premium",
        price: 45000,
        description: "Café especial de alta calidad con notas frutales",
        category: "Premium",
        weight: "250g",
        status: "active",
    },
    // ... más paquetes
];

export default function PackagesManagement() {
    const handleEdit = (pkg: Package) => {
        console.log('Editing package:', pkg);
    };

    const handleDelete = (packageId: number) => {
        console.log('Deleting package:', packageId);
    };

    const handleView = (pkg: Package) => {
        console.log('Viewing package:', pkg);
    };

    const handleCreate = () => {
        console.log('Creating new package');
    };

    const config = createPackagesConfig(
        packages,
        PackageCard,
        { onEdit: handleEdit, onDelete: handleDelete, onView: handleView, onCreate: handleCreate }
    );

    const sidebarItems = defaultSidebarItems.map(item => ({
        ...item,
        active: item.id === 'paquetes'
    }));

    return <GenericManagement config={config} sidebarItems={sidebarItems} />;
}
