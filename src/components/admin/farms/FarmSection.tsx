import GenericManagement, { defaultSidebarItems } from '@/components/admin/GenericManagent';
import { Farm } from '@/components/admin/farms/FamCard';
import FarmCard from '@/components/admin/farms/FamCard';
import { createFarmsConfig } from '@/components/admin/farms/createFarmsConfig';

const farms: Farm[] = [
    {
        id: 1,
        name: "Puerto Arturo",
        entrepreneur: "Arturo Ocampo",
        location: "La finca Rillera del Guarriak se halla ubicada...",
        cropType: "Café Arábigo",
        status: "active",
    },
    // ... más fincas
];

export default function FarmsManagement() {
    const handleEdit = (farm: Farm) => {
        console.log('Editing farm:', farm);
    };

    const handleDelete = (farmId: number) => {
        console.log('Deleting farm:', farmId);
    };

    const handleView = (farm: Farm) => {
        console.log('Viewing farm:', farm);
    };

    const handleCreate = () => {
        console.log('Creating new farm');
    };

    const config = createFarmsConfig(
        farms,
        FarmCard,
        { onEdit: handleEdit, onDelete: handleDelete, onView: handleView, onCreate: handleCreate }
    );

    const sidebarItems = defaultSidebarItems.map(item => ({
        ...item,
        active: item.id === 'fincas'
    }));

    return <GenericManagement config={config} sidebarItems={sidebarItems} />;
}
