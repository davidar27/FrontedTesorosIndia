import { useGenericManagement } from '@/hooks/useGenericManagement';
import { Farm } from '@/interfaces/farm';
import GenericManagement, { defaultSidebarItems } from '@/components/admin/GenericManagent';
import { createFarmsConfig } from '@/components/admin/farms/createFarmsConfig';
import { FarmCard } from '@/components/admin/farms/FarmCard';

export function FarmsManagementWithAPI() {
    const {
        items: farms,
        isLoading,
        create,
        update,
        delete: deleteFarm
    } = useGenericManagement<Farm>('farms', '/api/farms');
    
    const handleEdit = (farm: Farm) => {
        // Abrir modal de edición
        const updatedFarm = { ...farm, name: farm.name + ' (Editada)' };
        update(updatedFarm);
    };

    const handleDelete = (farmId: number) => {
        if (confirm('¿Estás seguro de que quieres eliminar esta finca?')) {
            deleteFarm(farmId);
        }
    };

    const handleView = (farm: Farm) => {
        // Navegar a vista detallada
        console.log('Viewing farm:', farm);
    };

    const handleCreate = () => {
        const newFarm = {
            name: 'Nueva Finca',
            entrepreneur: 'Nuevo Emprendedor',
            location: 'Nueva Ubicación',
            cropType: 'Café',
            status: 'draft' as const
        };
        create(newFarm);
    };

    if (isLoading) {
        return <div>Cargando...</div>;
    }

    const config = createFarmsConfig(
        farms,
        FarmCard,
        { onEdit: handleEdit, onDelete: handleDelete, onView: handleView, onCreate: handleCreate }
    );

    const sidebarItems = defaultSidebarItems.map(item => ({
        ...item,
        active: item.id === 'fincas'
    }));

    return <GenericManagement config={ config } sidebarItems = { sidebarItems } />;
}